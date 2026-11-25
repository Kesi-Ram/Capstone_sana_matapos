
import pandas as pd
import joblib
from pathlib import Path

# STEP 1: Find our existing dataset and trained model.
ml_folder = Path(__file__).resolve().parent

dataset_path = ml_folder / "datasets" / "synthetic_monthly_demand.csv"
model_path = ml_folder / "models" / "facility_demand_model.joblib"

# Read the historical reservation records.
data = pd.read_csv(dataset_path)

# Load the trained Machine Learning model.
model = joblib.load(model_path)

# Store our future predictions here.
predictions = []

# STEP 2: Go through every facility in the dataset.
for facility_id in sorted(data["facility_id"].unique()):

    # Get historical records for this facility only.
    facility_data = data[data["facility_id"] == facility_id]

    # Arrange records from oldest to newest.
    facility_data = facility_data.sort_values(["year", "month"])

    # Get the most recent month's record.
    latest_record = facility_data.iloc[-1]

    latest_year = int(latest_record["year"])
    latest_month = int(latest_record["month"])

    # STEP 3: Determine the next month to predict.
    if latest_month == 12:
        prediction_year = latest_year + 1
        prediction_month = 1
    else:
        prediction_year = latest_year
        prediction_month = latest_month + 1

    # Get the number of requests from the previous month.
    previous_month = int(latest_record["request_count"])

    # Find the request count from the same month last year.
    last_year_data = facility_data[
        (facility_data["year"] == prediction_year - 1) &
        (facility_data["month"] == prediction_month)
    ]

    if last_year_data.empty:
        print(f"Missing historical data for facility {facility_id}")
        continue

    same_month_last_year = int(
        last_year_data.iloc[0]["request_count"]
    )

    # STEP 4: Prepare the information for our ML model.
    input_data = pd.DataFrame([{
        "facility_id": int(facility_id),
        "year": prediction_year,
        "month": prediction_month,
        "previous_month": previous_month,
        "same_month_last_year": same_month_last_year
    }])

    # STEP 5: Ask the model to predict reservation demand.
    predicted_requests = model.predict(input_data)[0]

    # Convert the result into a nonnegative whole number.
    predicted_requests = max(0, round(predicted_requests))

    # Store the prediction.
    predictions.append({
        "facility_id": int(facility_id),
        "year": prediction_year,
        "month": prediction_month,
        "predicted_requests": predicted_requests
    })

    print(
        f"Facility {facility_id}: "
        f"{predicted_requests} predicted requests "
        f"for {prediction_year}-{prediction_month:02d}"
    )

# STEP 6: Save the predictions to a CSV file.
if predictions:

    forecast_folder = ml_folder / "forecasts"
    forecast_folder.mkdir(exist_ok=True)

    forecast_path = forecast_folder / "monthly_demand_forecast.csv"

    forecast_data = pd.DataFrame(predictions)
    forecast_data.to_csv(forecast_path, index=False)

    print("\nPredictions saved successfully!")
    print(f"Saved to: {forecast_path}")
