"""
Foreign Key Validation Script for SmartBulbToFixtureRelation
Task B: Identify and report invalid foreign key references
"""

import csv
from collections import defaultdict


def load_valid_ids(csv_path, id_column, skip_header=True):
    """
    Load all valid IDs from a CSV file.
    
    Args:
        csv_path: Path to CSV file
        id_column: Column name or index for the ID field
        skip_header: Whether to skip the first row
    
    Returns:
        Set of valid IDs
    """
    valid_ids = set()
    with open(csv_path, 'r') as f:
        reader = csv.DictReader(f) if isinstance(id_column, str) else csv.reader(f)
        
        if not skip_header and not isinstance(id_column, str):
            next(reader)  # Skip header manually if using index
        
        for row in reader:
            if isinstance(id_column, str):
                valid_ids.add(row[id_column])
            else:
                valid_ids.add(row[id_column])
    
    return valid_ids


def validate_foreign_keys(relation_csv, bulb_csv, fixture_csv):
    """
    Validate foreign key references in SmartBulbToFixtureRelation.csv
    
    Args:
        relation_csv: Path to SmartBulbToFixtureRelation.csv
        bulb_csv: Path to SmartBulb.csv
        fixture_csv: Path to Fixture.csv
    
    Returns:
        Dictionary with validation results
    """
    print("Loading valid SmartBulb IDs...")
    valid_bulb_ids = load_valid_ids(bulb_csv, 'ID')
    print(f"  ✓ Found {len(valid_bulb_ids):,} valid SmartBulb IDs")
    
    print("\nLoading valid Fixture IDs...")
    valid_fixture_ids = load_valid_ids(fixture_csv, 'id')
    print(f"  ✓ Found {len(valid_fixture_ids):,} valid Fixture IDs")
    
    print("\nValidating SmartBulbToFixtureRelation foreign keys...")
    
    invalid_bulb_refs = []
    invalid_fixture_refs = []
    total_rows = 0
    
    with open(relation_csv, 'r') as f:
        reader = csv.DictReader(f)
        
        for row in reader:
            total_rows += 1
            bulb_id = row['FROM']
            fixture_id = row['TO']
            
            # Check SmartBulb foreign key
            if bulb_id not in valid_bulb_ids:
                invalid_bulb_refs.append({
                    'relation_id': row['ID'],
                    'invalid_bulb_id': bulb_id,
                    'fixture_id': fixture_id,
                    'start': row['START'],
                    'end': row['END'],
                    'issue': f"SmartBulb '{bulb_id}' does not exist"
                })
            
            # Check Fixture foreign key
            if fixture_id not in valid_fixture_ids:
                invalid_fixture_refs.append({
                    'relation_id': row['ID'],
                    'bulb_id': bulb_id,
                    'invalid_fixture_id': fixture_id,
                    'start': row['START'],
                    'end': row['END'],
                    'issue': f"Fixture '{fixture_id}' does not exist"
                })
    
    print(f"  ✓ Validated {total_rows:,} relation records\n")
    
    return {
        'total_rows': total_rows,
        'valid_bulb_ids_count': len(valid_bulb_ids),
        'valid_fixture_ids_count': len(valid_fixture_ids),
        'invalid_bulb_refs': invalid_bulb_refs,
        'invalid_fixture_refs': invalid_fixture_refs,
        'invalid_bulb_count': len(invalid_bulb_refs),
        'invalid_fixture_count': len(invalid_fixture_refs)
    }


def print_validation_report(results):
    """
    Print a formatted validation report.
    
    Args:
        results: Dictionary returned from validate_foreign_keys()
    """
    print("=" * 80)
    print("FOREIGN KEY VALIDATION REPORT")
    print("=" * 80)
    print(f"\nTotal Relations Checked:     {results['total_rows']:,}")
    print(f"Valid SmartBulb IDs:         {results['valid_bulb_ids_count']:,}")
    print(f"Valid Fixture IDs:           {results['valid_fixture_ids_count']:,}")
    print(f"\n{'─' * 80}")
    
    if results['invalid_bulb_count'] == 0 and results['invalid_fixture_count'] == 0:
        print("\n✓ ALL FOREIGN KEYS ARE VALID!")
        print("  No invalid references found.")
    else:
        print(f"\n⚠️  INVALID FOREIGN KEYS DETECTED")
        print(f"\n  Invalid SmartBulb References:  {results['invalid_bulb_count']}")
        print(f"  Invalid Fixture References:    {results['invalid_fixture_count']}")
        print(f"  Total Invalid Rows:            {results['invalid_bulb_count'] + results['invalid_fixture_count']}")
    
    print("=" * 80)
    
    # Print detailed issues
    if results['invalid_bulb_refs']:
        print(f"\n📋 INVALID SMARTBULB REFERENCES ({len(results['invalid_bulb_refs'])} rows):")
        print("-" * 80)
        for i, issue in enumerate(results['invalid_bulb_refs'][:10], 1):
            print(f"\n{i}. Relation ID: {issue['relation_id']}")
            print(f"   ❌ Invalid Bulb: {issue['invalid_bulb_id']}")
            print(f"   Fixture: {issue['fixture_id']}")
            print(f"   Period: {issue['start']} to {issue['end']}")
        
        if len(results['invalid_bulb_refs']) > 10:
            print(f"\n   ... and {len(results['invalid_bulb_refs']) - 10} more")
    
    if results['invalid_fixture_refs']:
        print(f"\n📋 INVALID FIXTURE REFERENCES ({len(results['invalid_fixture_refs'])} rows):")
        print("-" * 80)
        for i, issue in enumerate(results['invalid_fixture_refs'][:10], 1):
            print(f"\n{i}. Relation ID: {issue['relation_id']}")
            print(f"   SmartBulb: {issue['bulb_id']}")
            print(f"   ❌ Invalid Fixture: {issue['invalid_fixture_id']}")
            print(f"   Period: {issue['start']} to {issue['end']}")
        
        if len(results['invalid_fixture_refs']) > 10:
            print(f"\n   ... and {len(results['invalid_fixture_refs']) - 10} more")
    
    print("\n" + "=" * 80)


def export_invalid_rows_to_csv(results, output_path):
    """
    Export all invalid rows to a CSV file for review.
    
    Args:
        results: Dictionary returned from validate_foreign_keys()
        output_path: Path to save the CSV file
    """
    all_issues = []
    
    # Add bulb reference issues
    for issue in results['invalid_bulb_refs']:
        all_issues.append({
            'relation_id': issue['relation_id'],
            'issue_type': 'INVALID_SMARTBULB_FK',
            'invalid_id': issue['invalid_bulb_id'],
            'valid_id': issue['fixture_id'],
            'start': issue['start'],
            'end': issue['end'],
            'description': issue['issue']
        })
    
    # Add fixture reference issues
    for issue in results['invalid_fixture_refs']:
        all_issues.append({
            'relation_id': issue['relation_id'],
            'issue_type': 'INVALID_FIXTURE_FK',
            'invalid_id': issue['invalid_fixture_id'],
            'valid_id': issue['bulb_id'],
            'start': issue['start'],
            'end': issue['end'],
            'description': issue['issue']
        })
    
    if all_issues:
        with open(output_path, 'w', newline='') as f:
            fieldnames = ['relation_id', 'issue_type', 'invalid_id', 'valid_id', 
                         'start', 'end', 'description']
            writer = csv.DictWriter(f, fieldnames=fieldnames)
            writer.writeheader()
            writer.writerows(all_issues)
        
        print(f"\n✓ Exported {len(all_issues)} invalid rows to: {output_path}")
    else:
        print("\n✓ No invalid rows to export")


def get_removal_commands(results):
    """
    Generate C3 commands to remove invalid rows.
    
    Args:
        results: Dictionary returned from validate_foreign_keys()
    
    Returns:
        List of C3 removal commands
    """
    commands = []
    
    # Get all invalid relation IDs
    invalid_ids = set()
    
    for issue in results['invalid_bulb_refs']:
        invalid_ids.add(issue['relation_id'])
    
    for issue in results['invalid_fixture_refs']:
        invalid_ids.add(issue['relation_id'])
    
    if invalid_ids:
        print(f"\n📝 C3 REMOVAL COMMANDS")
        print("=" * 80)
        print(f"\nTo remove {len(invalid_ids)} rows with invalid foreign keys, use:\n")
        
        # Option 1: Remove by ID
        print("Option 1: Remove specific IDs (for small datasets)")
        print("-" * 80)
        id_list = '", "'.join(sorted(list(invalid_ids)[:5]))
        print(f'SmartBulbToFixtureRelation.remove_all({{')
        print(f'    "filter": "id == \\"{invalid_ids.pop()}\\"')
        print(f'}})')
        print(f'\n# For multiple IDs:')
        print(f'invalid_ids = ["{id_list}", ...]')
        print(f'for rel_id in invalid_ids:')
        print(f'    SmartBulbToFixtureRelation.get(rel_id).remove()')
        
        # Option 2: Remove by filter
        print("\n\nOption 2: Remove by filter (RECOMMENDED)")
        print("-" * 80)
        print('SmartBulbToFixtureRelation.remove_all({')
        print('    "filter": "!exists(to)"  # Removes invalid Fixture references')
        print('})')
        print(f'\n# This will remove {results["invalid_fixture_count"]} rows')
        
        print("\n" + "=" * 80)
    
    return list(invalid_ids)


if __name__ == "__main__":
    # File paths
    BASE_PATH = "/Users/alejandrodominguez/Workspaces/capstoneproject/resource/Enhanced_Capstone_Data_Files"
    
    relation_csv = f"{BASE_PATH}/SmartBulbToFixtureRelation.csv"
    bulb_csv = f"{BASE_PATH}/SmartBulb.csv"
    fixture_csv = f"{BASE_PATH}/Fixture.csv"
    output_csv = f"{BASE_PATH}/invalid_foreign_keys_report.csv"
    
    # Run validation
    results = validate_foreign_keys(relation_csv, bulb_csv, fixture_csv)
    
    # Print report
    print_validation_report(results)
    
    # Export invalid rows
    export_invalid_rows_to_csv(results, output_csv)
    
    # Generate removal commands
    invalid_ids = get_removal_commands(results)
