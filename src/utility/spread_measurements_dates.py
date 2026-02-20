"""
Script to spread SmartBulbMeasurement data across 6 months starting from 2020.
Redistributes all measurements evenly throughout the time period.
"""

import csv
from datetime import datetime, timedelta
import os

def spread_measurements_across_months(input_file, output_file, start_year=2020, num_months=6):
    """
    Spreads SmartBulbMeasurement data evenly across specified number of months.
    Maintains exact hour boundaries (no minute/second shifts).
    
    Args:
        input_file: Path to input CSV file
        output_file: Path to output CSV file
        start_year: Year to start the data (default: 2020)
        num_months: Number of months to spread data across (default: 6)
    """
    
    # Read the input CSV
    print(f"Reading {input_file}...")
    with open(input_file, 'r') as f:
        reader = csv.DictReader(f)
        rows = list(reader)
        fieldnames = reader.fieldnames
    
    print(f"Found {len(rows)} rows")
    
    if len(rows) == 0:
        print("No data to process!")
        return
    
    # Parse original date range
    print("Parsing dates...")
    dates = []
    for row in rows:
        try:
            timestamp_str = row['timestamp'].replace('Z', '').replace('T', ' ').strip()
            start_date = datetime.strptime(timestamp_str, '%Y-%m-%d %H:%M:%S')
            dates.append(start_date)
        except:
            pass
    
    if not dates:
        print("No valid dates found!")
        return
    
    original_start = min(dates)
    original_end = max(dates)
    original_duration_hours = (original_end - original_start).total_seconds() / 3600
    
    print(f"Original date range: {original_start} to {original_end}")
    print(f"Original duration: {original_duration_hours:.1f} hours")
    
    # Define new date range (6 months starting from 2020)
    new_start = datetime(start_year, 1, 1, 0, 0, 0)
    new_duration_hours = num_months * 30 * 24  # Approximate hours in num_months months
    
    print(f"New start date: {new_start}")
    print(f"New duration: {new_duration_hours} hours ({num_months} months)")
    
    # Calculate scaling factor
    if original_duration_hours > 0:
        scale_factor = new_duration_hours / original_duration_hours
    else:
        scale_factor = 1.0
    
    print(f"Time scale factor: {scale_factor:.4f}")
    
    # Process each row
    print("Redistributing dates...")
    for i, row in enumerate(rows):
        try:
            # Parse timestamp datetime
            timestamp_str = row['timestamp'].replace('Z', '').replace('T', ' ').strip()
            start_dt = datetime.strptime(timestamp_str, '%Y-%m-%d %H:%M:%S')
            
            # Parse end datetime
            end_str = row['end'].replace('Z', '').replace('T', ' ').strip()
            end_dt = datetime.strptime(end_str, '%Y-%m-%d %H:%M:%S')
            
            # Calculate measurement duration
            measurement_duration_hours = (end_dt - start_dt).total_seconds() / 3600
            
            # Calculate offset from original start in hours
            offset_hours = (start_dt - original_start).total_seconds() / 3600
            
            # Scale the offset and round to nearest hour to avoid minute shifts
            new_offset_hours = round(offset_hours * scale_factor)
            
            # Calculate new start time
            new_start_dt = new_start + timedelta(hours=new_offset_hours)
            
            # Calculate new end time (maintain same duration, rounded to hours)
            new_end_dt = new_start_dt + timedelta(hours=round(measurement_duration_hours))
            
            # Update the row - use space separator, not 'T'
            row['timestamp'] = new_start_dt.strftime('%Y-%m-%d %H:%M:%S')
            row['end'] = new_end_dt.strftime('%Y-%m-%d %H:%M:%S')
            
            if (i + 1) % 1000 == 0:
                print(f"Processed {i + 1} / {len(rows)} rows...")
        
        except Exception as e:
            print(f"Error processing row {i}: {e}")
            print(f"  timestamp: {row.get('timestamp')}")
            print(f"  end: {row.get('end')}")
            continue
    
    # Write to output file
    print(f"Writing to {output_file}...")
    with open(output_file, 'w', newline='') as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(rows)
    
    print(f"Done! Wrote {len(rows)} rows to {output_file}")
    print(f"Data now spans {num_months} months starting from {start_year}")


def process_all_clean_files(input_dir, output_dir, start_year=2020, num_months=6):
    """
    Process all *_CLEAN.csv files in a directory.
    
    Args:
        input_dir: Directory containing input CSV files
        output_dir: Directory for output CSV files
        start_year: Year to start the data
        num_months: Number of months to spread data across
    """
    
    # Create output directory if it doesn't exist
    os.makedirs(output_dir, exist_ok=True)
    
    # Find all CLEAN.csv files
    clean_files = [f for f in os.listdir(input_dir) if f.endswith('_CLEAN.csv')]
    
    print(f"Found {len(clean_files)} files to process")
    
    for filename in clean_files:
        input_path = os.path.join(input_dir, filename)
        output_filename = filename.replace('_CLEAN.csv', '_2020_6MONTHS.csv')
        output_path = os.path.join(output_dir, output_filename)
        
        print(f"\n{'='*60}")
        print(f"Processing: {filename}")
        print(f"{'='*60}")
        
        spread_measurements_across_months(input_path, output_path, start_year, num_months)


# Example usage
if __name__ == "__main__":
    # Process single file
    input_file = "/Users/alejandrodominguez/Workspaces/capstoneproject/resource/Enhanced_Capstone_Data_Files/IncrementalData/clean/SmartBulbMeasurement_2024-01_Part4_CLEAN.csv"
    output_file = "/Users/alejandrodominguez/Workspaces/capstoneproject/resource/Enhanced_Capstone_Data_Files/IncrementalData/superclean/SmartBulbMeasurement_2020_6MONTHS_Part4.csv"
    
    spread_measurements_across_months(input_file, output_file, start_year=2020, num_months=6)
    
    # Or process all clean files in a directory
    # input_dir = "capstoneproject/resource/Enhanced_Capstone_Data_Files/IncrementalData/clean"
    # output_dir = "capstoneproject/resource/Enhanced_Capstone_Data_Files/IncrementalData/redistributed"
    # process_all_clean_files(input_dir, output_dir, start_year=2020, num_months=6)
