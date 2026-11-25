
import csv
import random
from pathlib import Path

# Makes the random data reproducible.
random.seed(42)

# Facility ID and its usual number of requests per month.
# These are example IDs, not confirmed database IDs.
facilities = {
    1: 12,
    2: 18,
    3: 9,
    4: 7,
    5: 14
}

# Some months have higher or lower demand.
monthly_factors = {
    1: 0.8,
    2: 1.0,
    3: 1.3,
    4: 0.9,
    5: 1.1,
    6: 1.4,
    7: 0.8,
    8: 0.7,
    9: 1.1,
    10: 1.2,
    11: 1.0,
    12: 1.3
}

# An empty list for storing generated records.
records = []

# Loop through the years 2022 to 2026.
for year in range(2022, 2027):

    # Loop through all 12 months.
    for month in range(1, 13):

        # Only include January to October in 2026.
        if year == 2026 and month > 10:
            break

        # Generate records for each facility.
        for facility_id, base_demand in facilities.items():

            seasonal_demand = base_demand * monthly_factors[month]

            # Simulate small annual growth.
            growth = 1 + (year - 2022) * 0.04

            expected_requests = seasonal_demand * growth

            # Add random differences to the counts.
            variation = random.gauss(0, 3)

            # Occasionally simulate unusually high demand.
            if random.random() < 0.04:
                variation += random.randint(4, 9)

            request_count = round(expected_requests + variation)

            # Prevent negative reservation counts.
            if request_count < 0:
                request_count = 0

            # Save this month's record.
            records.append({
                "facility_id": facility_id,
                "year": year,
                "month": month,
                "request_count": request_count
            })

# Find the folder containing this Python file.
ml_folder = Path(__file__).resolve().parent

# Create a folder for storing datasets.
dataset_folder = ml_folder / "datasets"
dataset_folder.mkdir(exist_ok=True)

# Specify the CSV filename.
file_path = dataset_folder / "synthetic_monthly_demand.csv"

# Save the generated records.
with open(file_path, "w", newline="", encoding="utf-8") as file:

    columns = ["facility_id", "year", "month", "request_count"]

    writer = csv.DictWriter(file, fieldnames=columns)

    writer.writeheader()
    writer.writerows(records)

print("Dataset generated successfully!")
print(f"Total records: {len(records)}")
print(f"Saved to: {file_path}")
