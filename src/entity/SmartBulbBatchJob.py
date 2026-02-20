"""
SmartBulbBatchJob implementation for processing SmartBulb measurement data in batches.

This module handles:
- Reading CSV files from FileSystem in batches
- Data quality validation and filtering
- Creating SourceFiles for SmartBulbMeasurementSeries and SmartBulbMeasurement
- Triggering data integration on completion
"""


import pandas as pd
from datetime import datetime
from typing import List, Dict, Any, Tuple
from io import StringIO


file_urls = [ "azure://c3azcs/aledominguez/capstoneproject/dl/SmartBulbMeasurement_2024-01_Part1.csv",
                "azure://c3azcs/aledominguez/capstoneproject/dl/SmartBulbMeasurement_2024-01_Part2.csv",
                "azure://c3azcs/aledominguez/capstoneproject/dl/SmartBulbMeasurement_2024-01_Part3.csv",
                "azure://c3azcs/aledominguez/capstoneproject/dl/SmartBulbMeasurement_2024-01_Part4.csv"
             ]  # Global variable to store file URLs for processing

## "azure://c3azcs/aledominguez/capstoneproject/dl/preprocessSmart"
def doStart(cls,job, options):
    """
    Initialize and start the batch job.
    
    This method divides the file URLs into batches based on batchSize
    and creates batch items for processing.
    
    Args:
        this: SmartBulbBatchJob instance
        spec: BatchJobSmartBulbMeasurementOptions containing configuration
    
    Returns:
        list: Batch items (each containing fileUrls for processing)
    """
    # Get the files in options if provided, otherwise use options files
    if options and hasattr(options, 'files') and options.files:
        file_urls = options.files
    else:
        raise Exception("No files provided in options for SmartBulbBatchJob. Please provide file URLs in the options when creating the job.")
    # Get batch size from options (default to 2 if not specified)
    batch_size = options.batchSize if options and hasattr(options, 'batchSize') else 2
    
    # Create batches using slices of the file_urls array
    batches = []
    for i in range(0, len(file_urls), batch_size):
        batch_files = file_urls[i:i+batch_size]
        
        # Create C3 batch item using Type.newObj
        batches.append(c3.BatchSmartBulbMeasurement.make({"values": batch_files}))
    if not batches:
        raise Exception("No batches created for processing")
    job.scheduleBatches(batches)

def processBatch(cls, batch, **kwargs):
    """
    Process a single batch of CSV files.
    
    For each batch:
    1. Read CSV files from FileSystem into DataFrame
    2. Validate and filter data for quality issues
    3. Create cleaned DataFrame
    4. Extract unique SmartBulb IDs
    5. Create SourceFile for SmartBulbMeasurementSeries
    6. Create SourceFile for SmartBulbMeasurement
    
    Args:
        this: SmartBulbBatchJob instance
        spec: BatchJobSmartBulbMeasurementOptions
        batch: BatchSmartBulbMeasurement containing fileUrls
    
    Returns:
        dict: Processing results and statistics
    """
    file_urls = batch.values
    batch_number = kwargs.get('batchNumber', 0)
    options = kwargs.get('options')
    
    # Initialize results tracking
    total_rows = 0
    total_filtered = 0
    quality_issues = []
    all_data_frames = []
    
    # Process each file in the batch
    for file_url in file_urls:
        try:
            # Read CSV from FileSystem using openFile for Azure URLs
            file = c3.FileSystem.openFile(file_url)
            content = file.readString()
            df = pd.read_csv(StringIO(content))
            
            total_rows += len(df)
            
            # Perform data quality validation
            filtered_df, issues = validate_and_filter_data(df, file_url)
            
            total_filtered += len(df) - len(filtered_df)
            quality_issues.extend(issues)
            
            all_data_frames.append(filtered_df)
            
        except Exception as e:
            quality_issues.append({
                "file": file_url,
                "error": str(e),
                "severity": "CRITICAL"
            })
    
    # Combine all DataFrames from this batch
    if not all_data_frames:
        return {
            "success": False,
            "message": "No valid data frames in batch"
        }
    
    combined_df = pd.concat(all_data_frames, ignore_index=True)
    
    # Create final cleaned DataFrame
    final_df = create_final_cleaned_dataframe(combined_df, options=options)
    
    # Extract unique SmartBulb IDs
    unique_smart_bulbs = final_df['SN'].unique().tolist()
    
    # Create SourceFile for SmartBulbMeasurementSeries
    series_source_file = create_series_source_file(unique_smart_bulbs, batch_number)
    
    # Create SourceFile for SmartBulbMeasurement
    measurement_source_file = create_measurement_source_file(final_df, batch_number)


def allComplete(cls, **kwargs):
    """
    Execute when all batches are complete.
    
    Triggers data integration on all created SourceFiles.
    
    Args:
        this: SmartBulbBatchJob instance
        spec: BatchJobSmartBulbMeasurementOptions
    """
    
    try:
        spec = c3.DataIntegSpec.make({"sourceFilesBatchSize": 150})
        spec = spec.withField("process",True)
        # Trigger data integration for SmartBulbMeasurementSeries
        series_collection = c3.FileSourceCollection.forName("SmartBulbMeasurementSeriesSource")
        if series_collection:
            ## Sync all files using a URL
            c3.SourceFile.syncAll(series_collection.inboxUrl(),spec)

        
        # Trigger data integration for SmartBulbMeasurement
        measurement_collection = c3.FileSourceCollection.forName("SmartBulbMeasurementSource")
        if measurement_collection:
            c3.SourceFile.syncAll(measurement_collection.inboxUrl(),spec)
    except Exception as e:
        raise


def create_smartbulb_mapping(file_url):
    """
    Reads a CSV file and creates a mapping DataFrame where each unique SN 
    gets assigned a sequential smartBulb ID.
    
    Args:
        file_url: The full URL to the CSV file in the FileSystem
        
    Returns:
        DataFrame with columns: smartBulb (SMBLB1, SMBLB2...), smartid (SBMS_serialNo_SMBLB#)
    """
    # Read the file from FileSystem
    file = c3.FileSystem.openFile(file_url)
    content = file.readString()
    
    # Convert to pandas DataFrame
    df = pd.read_csv(StringIO(content))
    
    # Get unique SN values
    unique_sns = df['SN'].unique()
    
    # Create sequential IDs (SMBLB1, SMBLB2, etc.)
    smartbulb_ids = [f'SMBLB{i+1}' for i in range(len(unique_sns))]
    
    # Create the mapping DataFrame
    result_df = pd.DataFrame({
        'smartBulb': smartbulb_ids,
        'smartid': [f'SBMS_serialNo_{smartbulb_id}' for smartbulb_id in smartbulb_ids]
    })
    
    return result_df
def validate_and_filter_data(df: pd.DataFrame, file_name: str) -> Tuple[pd.DataFrame, List[Dict[str, Any]]]:
    """
    Validate data quality and filter out problematic rows.
    
    Applies the same validation rules used in cleanData.js:
    - Valid timestamp format
    - Status values (0 or 1)
    - Valid numeric fields
    - No missing values
    - Temporal continuity
    
    Args:
        df: Input DataFrame
        file_name: Source file name for issue tracking
    
    Returns:
        tuple: (filtered_df, list of quality issues)
    """
    issues = []
    
    # Create a copy for filtering
    filtered_df = df.copy()
    initial_count = len(filtered_df)
    
    # 1. Check for invalid timestamps
    invalid_timestamps = (
        (filtered_df['timestamp'] == 'invalid_datetime') |
        (filtered_df['end'] == 'invalid_datetime')
    )
    if invalid_timestamps.any():
        issue_count = invalid_timestamps.sum()
        issues.append({
            "file": file_name,
            "issue": "invalid_timestamp",
            "count": int(issue_count),
            "severity": "HIGH"
        })
        filtered_df = filtered_df[~invalid_timestamps]
    
    # 2. Validate timestamp format
    try:
        filtered_df['timestamp'] = pd.to_datetime(filtered_df['timestamp'])
        filtered_df['end'] = pd.to_datetime(filtered_df['end'])
    except Exception as e:
        issues.append({
            "file": file_name,
            "issue": "timestamp_format_error",
            "error": str(e),
            "severity": "HIGH"
        })
    
    # 3. Check Status field (must be 0 or 1)
    invalid_status = ~filtered_df['Status'].isin([0, 1])
    if invalid_status.any():
        issue_count = invalid_status.sum()
        issues.append({
            "file": file_name,
            "issue": "invalid_status",
            "count": int(issue_count),
            "severity": "MEDIUM"
        })
        filtered_df = filtered_df[~invalid_status]
    
    # 4. Validate numeric fields
    numeric_fields = ['Watts', 'Lumens', 'Temp', 'Voltage']
    for field in numeric_fields:
        try:
            # Check for non-numeric values
            filtered_df[field] = pd.to_numeric(filtered_df[field], errors='coerce')
            null_values = filtered_df[field].isnull()
            
            if null_values.any():
                issue_count = null_values.sum()
                issues.append({
                    "file": file_name,
                    "issue": f"invalid_{field.lower()}",
                    "count": int(issue_count),
                    "severity": "MEDIUM"
                })
                filtered_df = filtered_df[~null_values]
        except Exception as e:
            issues.append({
                "file": file_name,
                "issue": f"numeric_conversion_error_{field}",
                "error": str(e),
                "severity": "HIGH"
            })
    
    # 5. Check for missing values
    missing_values = filtered_df.isnull().any(axis=1)
    if missing_values.any():
        issue_count = missing_values.sum()
        issues.append({
            "file": file_name,
            "issue": "missing_values",
            "count": int(issue_count),
            "severity": "HIGH"
        })
        filtered_df = filtered_df[~missing_values]
    
    # 6. Check temporal continuity (timestamp < end)
    if 'timestamp' in filtered_df.columns and 'end' in filtered_df.columns:
        temporal_issues = filtered_df['timestamp'] >= filtered_df['end']
        if temporal_issues.any():
            issue_count = temporal_issues.sum()
            issues.append({
                "file": file_name,
                "issue": "temporal_order_violation",
                "count": int(issue_count),
                "severity": "HIGH"
            })
            filtered_df = filtered_df[~temporal_issues]
    
    final_count = len(filtered_df)
    filtered_count = initial_count - final_count
    
    return filtered_df, issues


def create_final_cleaned_dataframe(df: pd.DataFrame, options) -> pd.DataFrame:
    """
    Create final cleaned DataFrame with additional processing.
    
    Args:
        df: Filtered DataFrame
        options: BatchJobSmartBulbMeasurementOptions
    
    Returns:
        Final cleaned DataFrame
    """
    cleaned_df = df.copy()
    
    # Filter out incremental data - only keep data AFTER 2024-01-14 23:59:59
    # This ensures we don't overlap with historical data
    incremental_cutoff = pd.Timestamp('2024-01-14 23:59:59')
    initial_count = len(cleaned_df)
    cleaned_df = cleaned_df[cleaned_df['timestamp'] > incremental_cutoff]
    filtered_count = initial_count - len(cleaned_df)

    # Sort by device and timestamp
    cleaned_df = cleaned_df.sort_values(['SN', 'timestamp'])
    
    # Remove duplicates based on SN and timestamp
    cleaned_df = cleaned_df.drop_duplicates(subset=['SN', 'timestamp'], keep='first')
    
    # Apply removeDigits option if specified
    if hasattr(options, 'removeDigits') and options.removeDigits:
        # Remove digits from SN field (if needed for anonymization)
        cleaned_df['SN'] = cleaned_df['SN'].str.replace(r'\d', '', regex=True)
    
    # Reset index
    cleaned_df = cleaned_df.reset_index(drop=True)
    
    return cleaned_df


def create_series_source_file(unique_smart_bulbs: List[str], batch_number: int) -> str:
    """
    Create SourceFile for SmartBulbMeasurementSeries.
    
    This creates a CSV file with unique SmartBulb IDs (SMBLB1, SMBLB2, etc.) 
    and uploads it to the appropriate FileSourceCollection inbox.
    
    Args:
        unique_smart_bulbs: List of unique SmartBulb serial numbers from SN column
        batch_number: Batch number for file naming
    
    Returns:
        str: Path to created SourceFile
    """
    # Create sequential SmartBulb IDs (SMBLB1, SMBLB2, etc.)
    smartbulb_ids = [f'SMBLB{i+1}' for i in range(len(unique_smart_bulbs))]
    
    # Create DataFrame with mapping
    series_df = pd.DataFrame({
        'id': [f'SBMS_serialNo_{bulb_id}' for bulb_id in smartbulb_ids],
        'smartBulb': smartbulb_ids
    })
    
    # Convert to CSV
    csv_content = series_df.to_csv(index=False)
    
    # Get inbox url for SmartBulbMeasurementSeries FileSourceCollection 
    series_collection_inboxUrl = c3.FileSourceCollection.forName("SmartBulbMeasurementSeriesSource").inboxUrl()
    
    if not  series_collection_inboxUrl:
        raise Exception("SmartBulbMeasurementSeriesSource FileSourceCollection not found")

    
    # Create file name
    file_name = f"SmartBulbMeasurementSeries_Batch{batch_number}_{datetime.now().strftime('%Y%m%d_%H%M%S')}.csv"
    file_path = f"{series_collection_inboxUrl}{file_name}"
    
    # Write file to FileSystem
    c3.File.make(file_path).writeString(csv_content)
    
    
    return file_path


def create_measurement_source_file(df: pd.DataFrame, batch_number: int) -> str:
    """
    Create SourceFile for SmartBulbMeasurement.
    
    Transforms the cleaned DataFrame to match the SmartBulbMeasurement schema
    and uploads it to the appropriate FileSourceCollection inbox.
    
    Args:
        df: Cleaned DataFrame with measurement data
        batch_number: Batch number for file naming
    
    Returns:
        str: Path to created SourceFile
    """
    # Create SN to SmartBulb ID mapping
    unique_sns = df['SN'].unique()
    sn_to_bulb_id = {sn: f'SMBLB{i+1}' for i, sn in enumerate(unique_sns)}
    
    # Transform DataFrame to match SmartBulbMeasurement schema
    measurement_df = pd.DataFrame({
        'parent': [f"SBMS_serialNo_{sn_to_bulb_id[sn]}" for sn in df['SN']],
        'start': df['timestamp'],
        'end': df['end'],
        'power': df['Watts'],
        'lumens': df['Lumens'],
        'voltage': df['Voltage'],
        'temperature': df['Temp'],
        'status': df['Status']
    })
    
    # Convert to CSV
    csv_content = measurement_df.to_csv(index=False)
    
    # Get FileSourceCollection for SmartBulbMeasurement
    measurement_collection_inboxUrl = c3.FileSourceCollection.forName("SmartBulbMeasurementSource").inboxUrl()
    
    if not measurement_collection_inboxUrl:
        raise Exception("SmartBulbMeasurementSource FileSourceCollection not found")
        
    # Create file name
    file_name = f"SmartBulbMeasurement_Batch{batch_number}_{datetime.now().strftime('%Y%m%d_%H%M%S')}.csv"
    file_path = f"{measurement_collection_inboxUrl}{file_name}"
    
    # Write file to FileSystem
    c3.File.make(file_path).writeString(csv_content)   
    
    return file_path