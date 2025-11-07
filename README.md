# Frame Grouping Tool

A lightweight browser-based utility for grouping **door frames from structural openings** allowing for set tolerances.

---

## Overview

The **Frame Grouping Tool** lets you upload an Excel file of structural openings (with height, width, and depth, and fire rating values) and automatically groups them into compatible frame sets based on standard and maximum tolerance values.

This tool is designed to assist with creating take-offs from architectural door set schedules for buildings.

All processing happens **locally in the browser** — no data is stored.

---

## Features

- Upload Excel (`.xlsx` / `.xls`) files directly
- Adjustable **standard** and **maximum** tolerance values
- Define which Excel columns contain IDs, Heights, and Widths
- Automatic grouping of openings by size range
- Results displayed instantly, with clear grouped output

---

## How It Works

1. Open the app in your browser.
2. Enter your standard and maximum tolerance values.
3. Specify which columns in your Excel sheet correspond to:
   - ID (or reference)
   - Fire Rating
   - Type
   - S/O Height
   - S/O Width
4. Upload your Excel file.
5. The tool will:
   - Sort all structural openings
   - Group those within your defined tolerances
   - Display recommended frame groupings with sizes and matching openings

## Excel File Example

Example Door Set Schedule.xls https://docs.google.com/spreadsheets/d/1umKlonYScEA-Pu4Jj47CbZo81hQjJvFo/edit?usp=sharing&ouid=101664862541048145425&rtpof=true&sd=true

- If using the example the column indexes are ID = 1, Fire Rate = 3, Type = 6, Height = 11, Width = 10, and Depth = 12

| #   | A   | B          | C         | D         | C   |
| --- | --- | ---------- | --------- | --------- | --- |
| 1   | Id  | S/O Height | S/O Width | S/O depth |     |
| 2   | ID1 | 2090       | 910       | 122       |     |
| 3   | ID2 | 2085       | 915       | 122       |     |
| 4   | ID3 | 2080       | 1015      | 115       |     |
| 5   | ID4 | 2075       | 1012      | 115       |     |
| 6   |     |            |           |           |     |

## Example output:

```text
Total Frames: 4 | Number of sizes: 2
----------------------------------------
Group 1
 Frame Size: 2080 × 910 - 2 No.
 Structural Openings:
   - ID1 (2090 × 910 x 122)
   - ID2 (2085 × 915 x 122)
----------------------------------------
Group 2
 Frame Size: 2070 × 1010 - 2 No.
 Structural Openings:
   - ID3 (2080 × 1015 x 115)
   - ID4 (2075 × 1012 x 115)
----------------------------------------
```
