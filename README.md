# Frame Grouping Tool

A lightweight browser-based utility for grouping **door frames from structural openings** allowing for set tolerances.

---

## Overview

The **Frame Grouping Tool** lets you upload an Excel file of structural openings (with height and width values) and automatically groups them into compatible frame sets based on standard and maximum tolerance values.

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
   - S/O Height
   - S/O Width
4. Upload your Excel file.
5. The tool will:
   - Sort all structural openings
   - Group those within your defined tolerances
   - Display recommended frame groupings with sizes and matching openings

## Excel File Example

| #   | A   | B          | C         | D   |
| --- | --- | ---------- | --------- | --- |
| 1   | Id  | S/O Height | S/O Width |     |
| 2   | ID1 | 2098       | 900       |     |
| 3   | ID2 | 2090       | 910       |     |
| 4   | ID3 | 2095       | 912       |     |
| 5   | ID4 | 2091       | 913       |     |
| 6   |     |            |           |     |

## Example output:

```text
----------------------------------------
Group 1
 Frame Size: 2080 × 910
 Structural Openings:
   - ID1 (2090 × 910)
   - ID2 (2085 × 915)
----------------------------------------
Group 2
 Frame Size: 2070 × 1010
 Structural Openings:
   - ID3 (2080 × 1015)
   - ID4 (2075 × 1012)
----------------------------------------
```
