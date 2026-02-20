# SmartBulbMeasurement Data Quality & Cleaning

This directory contains tools and files for validating and cleaning SmartBulbMeasurement CSV data before ingestion into C3 AI.

## 📁 Directory Structure

## 📁 Directory Structure

```
IncrementalData/
├── original/                    # Original source files
│   ├── SmartBulbMeasurement_2024-01_Part1.csv
│   ├── SmartBulbMeasurement_2024-01_Part2.csv
│   ├── SmartBulbMeasurement_2024-01_Part3.csv
│   └── SmartBulbMeasurement_2024-01_Part4.csv
├── clean/                       # ✅ Clean data ready for C3 AI
│   ├── SmartBulbMeasurement_2024-01_Part1_CLEAN.csv
│   ├── SmartBulbMeasurement_2024-01_Part2_CLEAN.csv
│   ├── SmartBulbMeasurement_2024-01_Part3_CLEAN.csv
│   └── SmartBulbMeasurement_2024-01_Part4_CLEAN.csv
└── issues/
    ├── part1/
    │   ├── SmartBulbMeasurement_2024-01_Part1_ISSUES.csv
    │   └── SmartBulbMeasurement_2024-01_Part1_ISSUES_REPORT.json
    ├── part2/
    │   ├── SmartBulbMeasurement_2024-01_Part2_ISSUES.csv
    │   └── SmartBulbMeasurement_2024-01_Part2_ISSUES_REPORT.json
    ├── part3/
    │   ├── SmartBulbMeasurement_2024-01_Part3_ISSUES.csv
    │   └── SmartBulbMeasurement_2024-01_Part3_ISSUES_REPORT.json
    └── part4/
        ├── SmartBulbMeasurement_2024-01_Part4_ISSUES.csv
        └── SmartBulbMeasurement_2024-01_Part4_ISSUES_REPORT.json
```

## 🚀 Quick Start

### 1. Clean Your Data

```bash
cd resource/Enhanced_Capstone_Data_Files/IncrementalData
node cleanData.js SmartBulbMeasurement_2024-01_Part1.csv
```

**Output:**
- Creates `*_CLEAN.csv` with valid rows
- Creates `issues/*_ISSUES.csv` with problematic rows
- Creates `issues/*_ISSUES_REPORT.json` with detailed issue report

### 2. Use Clean Data in Your Code

```javascript
const { cleanDataFile } = require('./cleanData.js');

const result = await cleanDataFile('SmartBulbMeasurement_2024-01_Part1.csv');

// Access clean data as JavaScript objects
console.log(`Clean rows: ${result.cleanRows.length}`);

// Work with the data
result.cleanRows.forEach(row => {
    console.log(`${row.SN}: ${row.Watts}W at ${row.timestamp}`);
});
```

### 3. Run Examples

```bash
node exampleUsage.js
```

This demonstrates:
- Loading clean data
- Grouping by device
- Calculating statistics
- Converting to C3 AI format

## 📊 Data Quality Summary

### Input Data
- **File:** SmartBulbMeasurement_2024-01_Part1.csv
- **Total rows:** 18,000

### Results
- ✅ **Clean rows:** 17,995 (99.97%)
- ⚠️ **Problematic rows:** 5 (0.03%)
- 📝 **Issues found:** 10 total

### Issues Detected

| Issue Type | Count | Severity | Description |
|------------|-------|----------|-------------|
| INVALID_TIMESTAMP | 5 | 🔴 CRITICAL | Rows with "invalid_datetime" instead of timestamp |
| INVALID_STATUS | 5 | 🔴 CRITICAL | Status = -1 instead of 0 or 1 |

### Affected Rows

All 5 problematic rows have both issues:

| Row # | SN | Issue |
|-------|----|-------|
| 4872 | SMBLB7 | invalid_datetime, Status=-1 |
| 9548 | SMBLB14 | invalid_datetime, Status=-1 |
| 12852 | SMBLB18 | invalid_datetime, Status=-1 |
| 16088 | SMBLB23 | invalid_datetime, Status=-1 |
| 17852 | SMBLB25 | invalid_datetime, Status=-1 |

## 🔍 Data Validation Checks

The cleaning script performs the following validations:

### ✅ Schema Validation
- Column names: SN, timestamp, end, Status, Watts, Lumens, Temp, Voltage
- Column order matches expected schema
- All required fields present

### ✅ Type Validation
- **timestamp:** Must match `YYYY-MM-DD HH:MM:SS` format
- **end:** Must match `YYYY-MM-DD HH:MM:SS` format
- **Status:** Must be `0` or `1`
- **Numeric fields:** Watts, Lumens, Temp, Voltage must be numeric

### ✅ Data Quality Checks
- No missing values
- No null fields
- Valid timestamp ranges
- Reasonable numeric values

## 📝 API Documentation

### `cleanDataFile(inputFilePath)`

Main function to clean a CSV file.

**Parameters:**
- `inputFilePath` (string): Absolute path to the CSV file

**Returns:** Promise resolving to object with:
```javascript
{
    cleanRows: Array<Object>,      // Clean data as JS objects
    issueRows: Array<Object>,      // Problematic rows
    issueDetails: Array<Object>,   // Detailed issue info
    summary: {
        totalRows: number,
        cleanRows: number,
        issueRows: number,
        totalIssues: number
    }
}
```

**Example:**
```javascript
const result = await cleanDataFile('data.csv');
console.log(`Processed ${result.summary.totalRows} rows`);
console.log(`Clean: ${result.cleanRows.length}`);
console.log(`Issues: ${result.issueRows.length}`);
```

### `validateRow(row, rowNumber)`

Validates a single data row.

**Parameters:**
- `row` (Object): Row data as key-value pairs
- `rowNumber` (number): Row number for error reporting

**Returns:** Array of issue objects

**Example:**
```javascript
const row = {
    SN: 'SMBLB1',
    timestamp: '2024-01-01 00:00:00',
    end: '2024-01-01 01:00:00',
    Status: '1',
    Watts: '15.12',
    Lumens: '333.16',
    Temp: '63.65',
    Voltage: '110'
};

const issues = validateRow(row, 1);
if (issues.length === 0) {
    console.log('Row is valid!');
}
```

### `DATA_QUALITY_CHECKS`

Object containing validation functions:

```javascript
DATA_QUALITY_CHECKS.isValidTimestamp(timestamp)
DATA_QUALITY_CHECKS.isValidStatus(status)
DATA_QUALITY_CHECKS.isValidEndTimestamp(end)
DATA_QUALITY_CHECKS.hasAllFields(row)
DATA_QUALITY_CHECKS.isValidNumeric(value)
```

## 📤 Uploading to C3 AI

### Use the CLEAN File

```bash
# Upload to data-load mount point
var contentLocation = FileSystem.inst().urlFromMount(FileSystemMount.DATA_LOAD) + "IncrementalData/SmartBulbMeasurement_2024-01_Part1_CLEAN.csv";

Curl.file({
  contentLocation: contentLocation,
  contentType: "text/csv",
  contentEncoding: "UTF-8",
  localFilePath: "/path/to/SmartBulbMeasurement_2024-01_Part1_CLEAN.csv",
  dataBinary: true,
  authenticationKind: AuthenticationKind.C3,
  authenticationToken: User.myUser().sessionToken().signedToken
});
```

### Then Sync

```javascript
SourceFile.syncAll(
    FileSystem.inst().urlFromMount(FileSystemMount.DATA_LOAD) + "IncrementalData/"
);
```

## 🔧 Customization

### Add Custom Validation Rules

Edit `cleanData.js` and add to `DATA_QUALITY_CHECKS`:

```javascript
DATA_QUALITY_CHECKS.customCheck = (value) => {
    // Your validation logic
    return value !== 'bad_value';
};
```

Then use in `validateRow()`:

```javascript
if (!DATA_QUALITY_CHECKS.customCheck(row.SomeField)) {
    issues.push({
        rowNumber,
        issue: 'CUSTOM_CHECK_FAILED',
        description: 'Custom validation failed',
        severity: 'WARNING'
    });
}
```

### Process Multiple Files

```javascript
const files = [
    'SmartBulbMeasurement_2024-01_Part1.csv',
    'SmartBulbMeasurement_2024-01_Part2.csv',
    'SmartBulbMeasurement_2024-01_Part3.csv'
];

for (const file of files) {
    await cleanDataFile(file);
}
```

## 📋 Files Generated

### Clean Data CSV
- **File:** `*_CLEAN.csv`
- **Purpose:** Ready for C3 AI ingestion
- **Format:** Same as original, minus bad rows

### Issues CSV
- **File:** `issues/*_ISSUES.csv`
- **Purpose:** Review problematic rows
- **Format:** Same as original, only bad rows

### Issue Report JSON
- **File:** `issues/*_ISSUES_REPORT.json`
- **Purpose:** Detailed analysis of all issues
- **Format:** JSON with summary and issue details

## 🎯 Next Steps

1. ✅ Review the [DATA_QUALITY_REPORT_Part1.md](DATA_QUALITY_REPORT_Part1.md)
2. ✅ Check [CLEANING_SUMMARY.md](CLEANING_SUMMARY.md) for results
3. ✅ Upload `*_CLEAN.csv` to C3 AI data-load mount
4. ✅ Sync with FileSourceCollection
5. ✅ Process through Transform pipeline

## 🐛 Troubleshooting

### Error: Module not found
```bash
# Make sure you're in the correct directory
cd resource/Enhanced_Capstone_Data_Files/IncrementalData
```

### Error: File not found
```bash
# Check file exists
ls -la SmartBulbMeasurement_2024-01_Part1.csv
```

### Error: Permission denied
```bash
# Check file permissions
chmod 644 SmartBulbMeasurement_2024-01_Part1.csv
```

## 📚 Additional Resources

- [C3 AI Data Integration Docs](https://developer.c3.ai/docs/latest/guide/guide-dm-di/)
- [FileSystem API Reference](https://developer.c3.ai/docs/latest/api/FileSystem/)
- [SourceFile API Reference](https://developer.c3.ai/docs/latest/api/SourceFile/)

---

**Last Updated:** February 6, 2026  
**Status:** ✅ Production Ready
