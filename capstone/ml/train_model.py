
import pandas as pd
import joblib

from pathlib import Path
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error

# STEP 1: Locate our ML folder.
ml_folder = Path(__file__).resolve().parent

# Locate the historical dataset.
dataset_path = ml_folder / "datasets" / "synthetic_monthly_demand.csv"

# Read our CSV file.
data = pd.read_csv(dataset_path)

# STEP 2: Arrange records by facility and date.
data = data.sort_values(["facility_id", "year", "month"])

# Get the request count from the previous month.
data["previous_month"] = (
    data.groupby("facility_id")["request_count"].shift(1)
)

# Get the request count from the same month last year.
data["same_month_last_year"] = (
    data.groupby("facility_id")["request_count"].shift(12)
)

# Remove records without enough historical information.
data = data.dropna().copy()

# STEP 3: Choose the data that the model will study.
features = [
    "facility_id",
    "year",
    "month",
    "previous_month",
    "same_month_last_year"
]

# This is the value we want the model to predict.
target = "request_count"

# STEP 4: Separate training data from testing data.
training_data = data[data["year"] <= 2025]
testing_data = data[data["year"] == 2026]

X_train = training_data[features]
y_train = training_data[target]

X_test = testing_data[features]
y_test = testing_data[target]

# STEP 5: Create the Machine Learning model.
model = RandomForestRegressor(
    n_estimators=100,
    random_state=42
)

# Train the model using the historical records.
model.fit(X_train, y_train)

print("Model training completed!")

# STEP 6: Test the trained model.
predictions = model.predict(X_test)

# Calculate the model's average prediction error.
error = mean_absolute_error(y_test, predictions)

# Compare against a simple historical forecast.
baseline_error = mean_absolute_error(
    y_test,
    testing_data["same_month_last_year"]
)

print(f"ML Mean Absolute Error: {error:.2f} requests")
print(f"Baseline Mean Absolute Error: {baseline_error:.2f} requests")

# STEP 7: Train again using all available records.
model.fit(data[features], data[target])

# Create a folder for our trained model.
model_folder = ml_folder / "models"
model_folder.mkdir(exist_ok=True)

# Save the trained model.
model_path = model_folder / "facility_demand_model.joblib"

joblib.dump(model, model_path)

print("Model saved successfully!")
print(f"Saved to: {model_path}")
