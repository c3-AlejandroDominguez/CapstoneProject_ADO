"""
Script to fill every hour in a 6-month period with SmartBulb measurements.
Distributes bulbs across all hours so every hour has measurements.
Randomly sets some bulbs to off status (Status=0).
"""

import csv
from datetime import datetime, timedelta
from collections import defaultdict
import random

def fill_hourly_measurements(input_file, output_file, start_date=None, num_months=6, off_probability=0.3):
    """
    Fills every hour in the 6-month period by distributing bulb measurements.
    Each hour will have measurements from different bulbs (rotating).
    Randomly sets some measurements to Status=0 (off).
    
    Args:
        input_file: Path to input CSV file
        output_file: Path to output CSV file
        start_date: Starting datetime (default: 2020-01-01 00:00:00)
        num_months: Number of months to fill (default: 6)
        off_probability: Probability that a bulb is off (default: 0.3 = 30%)
    """
    
    if start_date is None:
        start_date = datetime(2020, 1, 1, 0, 0, 0)
    
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
    
    # Group measurements by SN (smart bulb)
    print("Grouping measurements by bulb...")
    bulb_measurements = defaultdict(list)
    
    for row in rows:
        sn = row['SN']
        # Store the measurement values (not timestamps)
        measurement = {
            'Status': row['Status'],
            'Watts': row['Watts'],
            'Lumens': row['Lumens'],
            'Temp': row['Temp'],
            'Voltage': row['Voltage']
        }
        bulb_measurements[sn].append(measurement)
    
    bulbs = list(bulb_measurements.keys())
    print(f"Found {len(bulbs)} unique smart bulbs")
    
    # Calculate total hours in the period
    end_date = start_date + timedelta(days=30 * num_months)
    total_hours = int((end_date - start_date).total_seconds() / 3600)
    
    print(f"Filling period: {start_date} to {end_date}")
    print(f"Total hours to fill: {total_hours}")
    print(f"Off probability: {off_probability * 100:.0f}%")
    
    # Distribute bulbs across all hours
    # Each hour gets measurements from a rotating subset of bulbs
    print("Generating hourly measurements...")
    new_rows = []
    
    measurements_per_hour = max(1, len(rows) // total_hours)  # Average measurements per hour
    print(f"Target: ~{measurements_per_hour} measurements per hour")
    
    random.seed(42)  # For reproducibility
    
    for hour_offset in range(total_hours):
        # Calculate timestamp for this hour
        timestamp = start_date + timedelta(hours=hour_offset)
        end_timestamp = timestamp + timedelta(hours=1)
        
        # Determine how many bulbs are active this hour
        num_active_bulbs = measurements_per_hour
        
        # Rotate which bulbs are active
        start_bulb_index = (hour_offset * measurements_per_hour) % len(bulbs)
        
        for i in range(num_active_bulbs):
            bulb_index = (start_bulb_index + i) % len(bulbs)
            sn = bulbs[bulb_index]
            measurements = bulb_measurements[sn]
            
            # Pick a measurement value (cycle through)
            measurement_index = hour_offset % len(measurements)
            measurement = measurements[measurement_index].copy()
            
            # Randomly set to off status
            if random.random() < off_probability:
                measurement['Status'] = '0'
                measurement['Watts'] = '0'
                measurement['Lumens'] = '0'
            
            # Create new row
            new_row = {
                'SN': sn,
                'timestamp': timestamp.strftime('%Y-%m-%d %H:%M:%S'),
                'end': end_timestamp.strftime('%Y-%m-%d %H:%M:%S'),
                'Status': measurement['Status'],
                'Watts': measurement['Watts'],
                'Lumens': measurement['Lumens'],
                'Temp': measurement['Temp'],
                'Voltage': measurement['Voltage']
            }
            new_rows.append(new_row)
        
        if (hour_offset + 1) % 500 == 0:
            print(f"  Processed {hour_offset + 1} / {total_hours} hours...")
    
    print(f"Generated {len(new_rows)} total measurements")
    
    # Sort by timestamp and SN for better organization
    print("Sorting measurements...")
    new_rows.sort(key=lambda x: (x['timestamp'], x['SN']))
    
    # Write to output file
    print(f"Writing to {output_file}...")
    with open(output_file, 'w', newline='') as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(new_rows)
    
    # Calculate stats
    off_count = sum(1 for row in new_rows if row['Status'] == '0')
    
    print(f"Done! Wrote {len(new_rows)} rows to {output_file}")
    print(f"Every hour has ~{measurements_per_hour} measurements")
    print(f"Bulbs off: {off_count} ({off_count/len(new_rows)*100:.1f}%)")


# Example usage
if __name__ == "__main__":
    input_file = "../../resource/Enhanced_Capstone_Data_Files/IncrementalData/superclean/SmartBulbMeasurement_2020_6MONTHS_Part4.csv"
    output_file = "../../resource/Enhanced_Capstone_Data_Files/IncrementalData/superclean/SmartBulbMeasurement_2020_PART4_COMPLETE.csv"
    
    fill_hourly_measurements(
        input_file=input_file,
        output_file=output_file,
        start_date=datetime(2020, 1, 1, 0, 0, 0),
        num_months=6
    )
