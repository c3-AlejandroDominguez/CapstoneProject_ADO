




function startBatchJob(options)     

/**
 * Data Quality Checker and Cleaner for SmartBulbMeasurement CSV files
 * 
 * This script:
 * 1. Reads the CSV file
 * 2. Identifies rows with data quality issues
 * 3. Writes problematic rows to issues/ subdirectory
 * 4. Returns clean data for further processing
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

/**
 * Data quality validation rules
 */
const DATA_QUALITY_CHECKS = {
    /**
     * Check if timestamp is valid (not "invalid_datetime")
     */
    isValidTimestamp: (timestamp) => {
        return timestamp !== 'invalid_datetime' && timestamp.match(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/);
    },
    
    /**
     * Check if Status is 0 or 1 (not -1 or other values)
     */
    isValidStatus: (status) => {
        return status === '0' || status === '1';
    },
    
    /**
     * Check if end timestamp is valid
     */
    isValidEndTimestamp: (end) => {
        return end.match(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/);
    },
    
    /**
     * Check if all required fields are present
     */
    hasAllFields: (row) => {
        return row.SN && row.timestamp && row.end && row.Status !== undefined;
    },
    
    /**
     * Check if numeric values are valid
     */
    isValidNumeric: (value) => {
        return !isNaN(parseFloat(value)) && isFinite(value);
    }
};

/**
 * Parse CSV line into object
 */
function parseCSVLine(line, headers) {
    const values = line.split(',');
    const row = {};
    
    headers.forEach((header, index) => {
        row[header] = values[index] || '';
    });
    
    return row;
}

/**
 * Convert row object back to CSV line
 */
function rowToCSVLine(row, headers) {
    return headers.map(header => row[header] || '').join(',');
}

/**
 * Validate a data row and return issues found
 */
function validateRow(row, rowNumber) {
    const issues = [];
    
    // Check 1: All fields present
    if (!DATA_QUALITY_CHECKS.hasAllFields(row)) {
        issues.push({
            rowNumber,
            issue: 'MISSING_FIELDS',
            description: 'One or more required fields are missing',
            severity: 'CRITICAL'
        });
    }
    
    // Check 2: Valid timestamp
    if (!DATA_QUALITY_CHECKS.isValidTimestamp(row.timestamp)) {
        issues.push({
            rowNumber,
            issue: 'INVALID_TIMESTAMP',
            description: `Invalid timestamp value: "${row.timestamp}"`,
            severity: 'CRITICAL',
            field: 'timestamp',
            value: row.timestamp
        });
    }
    
    // Check 3: Valid end timestamp
    if (!DATA_QUALITY_CHECKS.isValidEndTimestamp(row.end)) {
        issues.push({
            rowNumber,
            issue: 'INVALID_END_TIMESTAMP',
            description: `Invalid end timestamp value: "${row.end}"`,
            severity: 'CRITICAL',
            field: 'end',
            value: row.end
        });
    }
    
    // Check 4: Valid Status
    if (!DATA_QUALITY_CHECKS.isValidStatus(row.Status)) {
        issues.push({
            rowNumber,
            issue: 'INVALID_STATUS',
            description: `Status must be 0 or 1, found: "${row.Status}"`,
            severity: 'CRITICAL',
            field: 'Status',
            value: row.Status
        });
    }
    
    // Check 5: Numeric fields are valid
    const numericFields = ['Watts', 'Lumens', 'Temp', 'Voltage'];
    numericFields.forEach(field => {
        if (row[field] && !DATA_QUALITY_CHECKS.isValidNumeric(row[field])) {
            issues.push({
                rowNumber,
                issue: 'INVALID_NUMERIC',
                description: `${field} must be numeric, found: "${row[field]}"`,
                severity: 'CRITICAL',
                field,
                value: row[field]
            });
        }
    });
    
    return issues;
}

/**
 * Main function to clean data
 */
async function cleanDataFile(inputFilePath) {
    console.log('='.repeat(80));
    console.log('DATA QUALITY CLEANER');
    console.log('='.repeat(80));
    console.log(`\nProcessing file: ${inputFilePath}\n`);
    
    const cleanRows = [];
    const issueRows = [];
    const issueDetails = [];
    let headers = [];
    let rowNumber = 0;
    let headerLine = '';
    
    // Create issues directory if it doesn't exist
    const inputDir = path.dirname(inputFilePath);
    const issuesDir = path.join(inputDir, 'issues');
    if (!fs.existsSync(issuesDir)) {
        fs.mkdirSync(issuesDir, { recursive: true });
        console.log(`✓ Created issues directory: ${issuesDir}`);
    }
    
    // Setup file reader
    const fileStream = fs.createReadStream(inputFilePath);
    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    });
    
    // Process each line
    for await (const line of rl) {
        rowNumber++;
        
        // First line is header
        if (rowNumber === 1) {
            headers = line.split(',');
            headerLine = line;
            continue;
        }
        
        // Skip empty lines
        if (!line.trim()) {
            continue;
        }
        
        // Parse row
        const row = parseCSVLine(line, headers);
        
        // Validate row
        const issues = validateRow(row, rowNumber);
        
        if (issues.length > 0) {
            // Row has issues
            issueRows.push(row);
            issueDetails.push(...issues);
            console.log(`✗ Row ${rowNumber}: ${issues.length} issue(s) found - SN: ${row.SN}, timestamp: ${row.timestamp}`);
        } else {
            // Row is clean
            cleanRows.push(row);
        }
    }
    
    console.log('\n' + '='.repeat(80));
    console.log('PROCESSING SUMMARY');
    console.log('='.repeat(80));
    console.log(`Total rows processed: ${rowNumber - 1}`);
    console.log(`Clean rows: ${cleanRows.length} (${((cleanRows.length / (rowNumber - 1)) * 100).toFixed(2)}%)`);
    console.log(`Rows with issues: ${issueRows.length} (${((issueRows.length / (rowNumber - 1)) * 100).toFixed(2)}%)`);
    console.log(`Total issues found: ${issueDetails.length}`);
    
    // Write issue rows to CSV
    if (issueRows.length > 0) {
        const inputFileName = path.basename(inputFilePath, '.csv');
        const issuesCSVPath = path.join(issuesDir, `${inputFileName}_ISSUES.csv`);
        const issuesReportPath = path.join(issuesDir, `${inputFileName}_ISSUES_REPORT.json`);
        
        // Write CSV with problematic rows
        const issueCSVContent = [
            headerLine,
            ...issueRows.map(row => rowToCSVLine(row, headers))
        ].join('\n');
        
        fs.writeFileSync(issuesCSVPath, issueCSVContent);
        console.log(`\n✓ Wrote ${issueRows.length} problematic rows to: ${issuesCSVPath}`);
        
        // Write detailed issue report as JSON
        const issueReport = {
            summary: {
                totalRows: rowNumber - 1,
                cleanRows: cleanRows.length,
                issueRows: issueRows.length,
                totalIssues: issueDetails.length,
                processedAt: new Date().toISOString(),
                sourceFile: inputFilePath
            },
            issues: issueDetails,
            issuesByType: issueDetails.reduce((acc, issue) => {
                acc[issue.issue] = (acc[issue.issue] || 0) + 1;
                return acc;
            }, {})
        };
        
        fs.writeFileSync(issuesReportPath, JSON.stringify(issueReport, null, 2));
        console.log(`✓ Wrote detailed issue report to: ${issuesReportPath}`);
    }
    
    // Write clean data to new CSV
    const inputFileName = path.basename(inputFilePath, '.csv');
    const cleanCSVPath = path.join(inputDir, `${inputFileName}_CLEAN.csv`);
    
    const cleanCSVContent = [
        headerLine,
        ...cleanRows.map(row => rowToCSVLine(row, headers))
    ].join('\n');
    
    fs.writeFileSync(cleanCSVPath, cleanCSVContent);
    console.log(`✓ Wrote ${cleanRows.length} clean rows to: ${cleanCSVPath}`);
    
    console.log('\n' + '='.repeat(80));
    console.log('ISSUE BREAKDOWN');
    console.log('='.repeat(80));
    
    if (issueDetails.length > 0) {
        const issuesByType = issueDetails.reduce((acc, issue) => {
            acc[issue.issue] = (acc[issue.issue] || 0) + 1;
            return acc;
        }, {});
        
        Object.entries(issuesByType).forEach(([type, count]) => {
            console.log(`  ${type}: ${count} occurrences`);
        });
        
        console.log('\nSample Issues:');
        issueDetails.slice(0, 5).forEach(issue => {
            console.log(`  - Row ${issue.rowNumber}: ${issue.description}`);
        });
    } else {
        console.log('  No issues found! ✓');
    }
    
    console.log('\n' + '='.repeat(80));
    console.log('COMPLETE');
    console.log('='.repeat(80));
    
    return {
        cleanRows,
        issueRows,
        issueDetails,
        summary: {
            totalRows: rowNumber - 1,
            cleanRows: cleanRows.length,
            issueRows: issueRows.length,
            totalIssues: issueDetails.length
        }
    };
}

// Run if called directly
if (require.main === module) {
    const inputFile = process.argv[2] || path.join(__dirname, 'SmartBulbMeasurement_2024-01_Part1.csv');
    
    cleanDataFile(inputFile)
        .then(result => {
            console.log('\n✓ Data cleaning completed successfully!');
            console.log(`\nClean data contains ${result.cleanRows.length} rows ready for ingestion.`);
            process.exit(0);
        })
        .catch(error => {
            console.error('\n✗ Error during data cleaning:', error);
            process.exit(1);
        });
}

module.exports = { cleanDataFile, validateRow, DATA_QUALITY_CHECKS };
