/**
 * Example usage of the data cleaning function
 * 
 * This demonstrates how to:
 * 1. Clean the CSV file
 * 2. Access clean data as JavaScript objects
 * 3. Work with the data programmatically
 */

const { cleanDataFile } = require('./cleanData.js');
const path = require('path');

async function exampleUsage() {
    console.log('='.repeat(80));
    console.log('EXAMPLE: Using Clean Data in JavaScript');
    console.log('='.repeat(80));
    
    // Path to the data file
    const dataFilePath = path.join(__dirname, 'SmartBulbMeasurement_2024-01_Part1.csv');
    
    // Clean the data
    const result = await cleanDataFile(dataFilePath);
    
    console.log('\n' + '='.repeat(80));
    console.log('WORKING WITH CLEAN DATA');
    console.log('='.repeat(80));
    
    // 1. Access clean rows as JavaScript objects
    console.log(`\nTotal clean rows available: ${result.cleanRows.length}`);
    
    // 2. Sample first 3 clean rows
    console.log('\nFirst 3 clean rows:');
    result.cleanRows.slice(0, 3).forEach((row, index) => {
        console.log(`\nRow ${index + 1}:`);
        console.log(`  SN: ${row.SN}`);
        console.log(`  Timestamp: ${row.timestamp}`);
        console.log(`  End: ${row.end}`);
        console.log(`  Status: ${row.Status}`);
        console.log(`  Watts: ${row.Watts}`);
        console.log(`  Lumens: ${row.Lumens}`);
        console.log(`  Temp: ${row.Temp}`);
        console.log(`  Voltage: ${row.Voltage}`);
    });
    
    // 3. Group by device (SN)
    console.log('\n' + '='.repeat(80));
    console.log('DATA ANALYSIS');
    console.log('='.repeat(80));
    
    const deviceGroups = result.cleanRows.reduce((acc, row) => {
        if (!acc[row.SN]) {
            acc[row.SN] = [];
        }
        acc[row.SN].push(row);
        return acc;
    }, {});
    
    console.log(`\nDevices found: ${Object.keys(deviceGroups).length}`);
    Object.entries(deviceGroups).forEach(([sn, rows]) => {
        console.log(`  ${sn}: ${rows.length} measurements`);
    });
    
    // 4. Calculate statistics
    console.log('\n' + '='.repeat(80));
    console.log('STATISTICS');
    console.log('='.repeat(80));
    
    const watts = result.cleanRows.map(r => parseFloat(r.Watts));
    const avgWatts = watts.reduce((a, b) => a + b, 0) / watts.length;
    const maxWatts = Math.max(...watts);
    const minWatts = Math.min(...watts);
    
    console.log(`\nWatts Statistics:`);
    console.log(`  Average: ${avgWatts.toFixed(2)} W`);
    console.log(`  Min: ${minWatts.toFixed(2)} W`);
    console.log(`  Max: ${maxWatts.toFixed(2)} W`);
    
    const lumens = result.cleanRows.map(r => parseFloat(r.Lumens));
    const avgLumens = lumens.reduce((a, b) => a + b, 0) / lumens.length;
    
    console.log(`\nLumens Statistics:`);
    console.log(`  Average: ${avgLumens.toFixed(2)} lm`);
    
    // 5. Find measurements for a specific device
    console.log('\n' + '='.repeat(80));
    console.log('DEVICE-SPECIFIC DATA');
    console.log('='.repeat(80));
    
    const targetDevice = 'SMBLB1';
    const deviceData = result.cleanRows.filter(row => row.SN === targetDevice);
    
    console.log(`\nMeasurements for ${targetDevice}: ${deviceData.length} records`);
    if (deviceData.length > 0) {
        console.log(`  First measurement: ${deviceData[0].timestamp}`);
        console.log(`  Last measurement: ${deviceData[deviceData.length - 1].timestamp}`);
    }
    
    // 6. Convert to JSON for API/processing
    console.log('\n' + '='.repeat(80));
    console.log('DATA EXPORT OPTIONS');
    console.log('='.repeat(80));
    
    // Example: Convert first 2 rows to JSON
    const jsonSample = JSON.stringify(result.cleanRows.slice(0, 2), null, 2);
    console.log('\nSample JSON output (first 2 rows):');
    console.log(jsonSample);
    
    // Example: Create C3 AI format
    console.log('\n' + '='.repeat(80));
    console.log('C3 AI CANONICAL FORMAT EXAMPLE');
    console.log('='.repeat(80));
    
    const c3Format = result.cleanRows.slice(0, 2).map(row => ({
        id: `${row.SN}_${row.timestamp.replace(/[:\s]/g, '')}`,
        smartBulb: row.SN,
        start: row.timestamp,
        end: row.end,
        status: parseInt(row.Status),
        watts: parseFloat(row.Watts),
        lumens: parseFloat(row.Lumens),
        temperature: parseFloat(row.Temp),
        voltage: parseFloat(row.Voltage)
    }));
    
    console.log(JSON.stringify(c3Format, null, 2));
    
    console.log('\n' + '='.repeat(80));
    console.log('COMPLETE');
    console.log('='.repeat(80));
    console.log('\n✓ Clean data is now available as JavaScript objects');
    console.log('✓ Data can be further processed, analyzed, or transformed');
    console.log('✓ Ready for C3 AI ingestion pipeline');
}

// Run the example
if (require.main === module) {
    exampleUsage()
        .then(() => {
            console.log('\n✓ Example completed successfully!');
            process.exit(0);
        })
        .catch(error => {
            console.error('\n✗ Error:', error);
            process.exit(1);
        });
}

module.exports = { exampleUsage };
