import pandas as pd
import re
from datetime import datetime

# Read the CSV file
df = pd.read_csv('/Users/alejandrodominguez/Workspaces/capstoneproject/resource/Enhanced_Capstone_Data_Files/SmartBulb.csv')

print("=== DATA QUALITY ANALYSIS FOR SmartBulb.csv ===\n")
print(f"Total rows: {len(df)}")
print(f"Columns: {list(df.columns)}\n")

# 1. ANALYZE STARTDATE COLUMN
print("=" * 60)
print("1. STARTDATE ANALYSIS")
print("=" * 60)

# Check for invalid datetime formats
def is_valid_iso_datetime(date_str):
    """Check if date matches YYYY-MM-DDTHH:MM:SS format"""
    try:
        if pd.isna(date_str):
            return False
        pattern = r'^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$'
        return bool(re.match(pattern, str(date_str)))
    except:
        return False

invalid_dates = df[~df['STARTDATE'].apply(is_valid_iso_datetime)]
print(f"Rows with invalid STARTDATE format: {len(invalid_dates)}")
if len(invalid_dates) > 0:
    print("\nSample invalid dates (first 20):")
    print(invalid_dates[['ID', 'STARTDATE']].head(20))
    print(f"\nUnique invalid date patterns:")
    print(invalid_dates['STARTDATE'].value_counts().head(10))

# 2. ANALYZE BULBTYPE COLUMN
print("\n" + "=" * 60)
print("2. BULBTYPE ANALYSIS")
print("=" * 60)

valid_bulbtypes = ['LED', 'CFL', 'INCAN']
print(f"Expected values: {valid_bulbtypes}")
print(f"\nActual unique values:")
print(df['BULBTYPE'].value_counts())

invalid_bulbtypes = df[~df['BULBTYPE'].isin(valid_bulbtypes)]
print(f"\nRows with invalid BULBTYPE: {len(invalid_bulbtypes)}")
if len(invalid_bulbtypes) > 0:
    print(invalid_bulbtypes[['ID', 'BULBTYPE']].head(20))

# 3. ANALYZE WATTAGE COLUMN
print("\n" + "=" * 60)
print("3. WATTAGE ANALYSIS")
print("=" * 60)

# Check for non-numeric values
try:
    df['WATTAGE_NUMERIC'] = pd.to_numeric(df['WATTAGE'], errors='coerce')
    invalid_wattage = df[df['WATTAGE_NUMERIC'].isna()]
    print(f"Rows with non-numeric WATTAGE: {len(invalid_wattage)}")
    if len(invalid_wattage) > 0:
        print(invalid_wattage[['ID', 'WATTAGE']].head(20))
    
    # Check for reasonable range
    valid_wattage = df[df['WATTAGE_NUMERIC'].notna()]
    print(f"\nWattage statistics:")
    print(f"  Min: {valid_wattage['WATTAGE_NUMERIC'].min()}")
    print(f"  Max: {valid_wattage['WATTAGE_NUMERIC'].max()}")
    print(f"  Mean: {valid_wattage['WATTAGE_NUMERIC'].mean():.2f}")
    
    # Check for outliers (e.g., negative or extremely high values)
    outliers = valid_wattage[(valid_wattage['WATTAGE_NUMERIC'] < 0) | (valid_wattage['WATTAGE_NUMERIC'] > 200)]
    print(f"\nRows with outlier WATTAGE (< 0 or > 200): {len(outliers)}")
    if len(outliers) > 0:
        print(outliers[['ID', 'WATTAGE']].head(20))
except Exception as e:
    print(f"Error analyzing WATTAGE: {e}")

# 4. ANALYZE MANUFACTURER COLUMN
print("\n" + "=" * 60)
print("4. MANUFACTURER ANALYSIS")
print("=" * 60)

print("Unique manufacturers:")
print(df['MANUFACTURER'].value_counts())

# Check for empty or invalid values
invalid_manufacturer = df[df['MANUFACTURER'].isna() | (df['MANUFACTURER'] == '')]
print(f"\nRows with missing MANUFACTURER: {len(invalid_manufacturer)}")

# 5. ANALYZE ID COLUMN
print("\n" + "=" * 60)
print("5. ID ANALYSIS")
print("=" * 60)

# Check for duplicates
duplicate_ids = df[df.duplicated(subset=['ID'], keep=False)]
print(f"Duplicate IDs: {len(duplicate_ids)}")
if len(duplicate_ids) > 0:
    print(duplicate_ids[['ID']].head(20))

# Check for missing IDs
missing_ids = df[df['ID'].isna() | (df['ID'] == '')]
print(f"Rows with missing ID: {len(missing_ids)}")

# 6. SUMMARY OF PROBLEMATIC ROWS
print("\n" + "=" * 60)
print("6. SUMMARY - ROWS TO REMOVE")
print("=" * 60)

# Combine all problematic rows
problematic_mask = (
    ~df['STARTDATE'].apply(is_valid_iso_datetime) |
    ~df['BULBTYPE'].isin(valid_bulbtypes) |
    df['WATTAGE_NUMERIC'].isna() |
    (df['WATTAGE_NUMERIC'] < 0) |
    (df['WATTAGE_NUMERIC'] > 200) |
    df['MANUFACTURER'].isna() |
    (df['MANUFACTURER'] == '') |
    df['ID'].isna() |
    (df['ID'] == '') |
    df.duplicated(subset=['ID'], keep=False)
)

problematic_rows = df[problematic_mask]
print(f"Total problematic rows: {len(problematic_rows)}")
print(f"Percentage of data: {len(problematic_rows)/len(df)*100:.2f}%")

# Create cleaned dataset
clean_df = df[~problematic_mask]
print(f"\nClean rows: {len(clean_df)}")
print(f"Percentage of data: {len(clean_df)/len(df)*100:.2f}%")

# Save cleaned data
output_path = '/Users/alejandrodominguez/Workspaces/capstoneproject/resource/Enhanced_Capstone_Data_Files/SmartBulb_cleaned.csv'
clean_df[['ID', 'STARTDATE', 'BULBTYPE', 'WATTAGE', 'MANUFACTURER']].to_csv(output_path, index=False)
print(f"\nCleaned data saved to: {output_path}")

# Save problematic rows for review
problem_output_path = '/Users/alejandrodominguez/Workspaces/capstoneproject/resource/Enhanced_Capstone_Data_Files/SmartBulb_problematic_rows.csv'
problematic_rows.to_csv(problem_output_path, index=False)
print(f"Problematic rows saved to: {problem_output_path}")
