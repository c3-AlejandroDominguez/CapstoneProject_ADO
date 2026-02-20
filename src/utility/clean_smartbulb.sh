#!/bin/bash

# Clean SmartBulb.csv file
# Removes rows with invalid date formats

INPUT_FILE="/Users/alejandrodominguez/Workspaces/capstoneproject/resource/Enhanced_Capstone_Data_Files/SmartBulb.csv"
OUTPUT_FILE="/Users/alejandrodominguez/Workspaces/capstoneproject/resource/Enhanced_Capstone_Data_Files/SmartBulb_cleaned.csv"
PROBLEM_FILE="/Users/alejandrodominguez/Workspaces/capstoneproject/resource/Enhanced_Capstone_Data_Files/SmartBulb_problems.csv"

echo "Starting data cleaning for SmartBulb.csv..."
echo "=========================================="

# Count total rows
TOTAL_ROWS=$(wc -l < "$INPUT_FILE")
echo "Total rows in file: $TOTAL_ROWS"

# Extract header
head -1 "$INPUT_FILE" > "$OUTPUT_FILE"
head -1 "$INPUT_FILE" > "$PROBLEM_FILE"

# Filter: Keep only rows with valid ISO datetime format (YYYY-MM-DDTHH:MM:SS)
# Valid pattern: starts with 4 digits, dash, 2 digits, dash, 2 digits, T, etc.
grep -E '^[^,]+,[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2},' "$INPUT_FILE" | \
  tail -n +2 >> "$OUTPUT_FILE"

# Extract problem rows (those NOT matching the pattern)
grep -vE '^[^,]+,[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2},' "$INPUT_FILE" | \
  grep -v "^ID,STARTDATE" >> "$PROBLEM_FILE"

# Count cleaned rows
CLEAN_ROWS=$(($(wc -l < "$OUTPUT_FILE") - 1))
PROBLEM_ROWS=$(($(wc -l < "$PROBLEM_FILE") - 1))

echo ""
echo "Results:"
echo "--------"
echo "Clean rows: $CLEAN_ROWS"
echo "Problem rows removed: $PROBLEM_ROWS"
echo "Percentage retained: $(awk "BEGIN {printf \"%.2f\", ($CLEAN_ROWS / ($TOTAL_ROWS - 1)) * 100}")%"
echo ""
echo "Output files:"
echo "  Cleaned data: $OUTPUT_FILE"
echo "  Problem rows: $PROBLEM_FILE"
echo ""
echo "Sample of removed rows:"
head -10 "$PROBLEM_FILE"
