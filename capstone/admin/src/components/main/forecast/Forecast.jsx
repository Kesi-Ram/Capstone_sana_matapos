
import { useEffect, useState } from "react";
import "./Forecast.css";

export default function Forecast() {

  // Store the predictions returned by PHP.
  const [forecasts, setForecasts] = useState([]);

  // Track loading and errors.
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Load the predictions when the page opens.
  useEffect(() => {

    async function loadForecasts() {

      try {

        const response = await fetch("/api/forecast.php", {
          credentials: "include"
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || "Failed to load forecasts.");
        }

        if (!Array.isArray(result.forecasts)) {
          throw new Error("Invalid forecast data.");
        }

        setForecasts(result.forecasts);

      } catch (error) {

        setError(error.message);

      } finally {

        setLoading(false);

      }
    }

    loadForecasts();

  }, []);

  // Show a loading message.
  if (loading) {
    return <p>Loading facility predictions...</p>;
  }

  // Show an error if the request failed.
  if (error) {
    return <p>{error}</p>;
  }

  // Handle an empty forecast file.
  if (forecasts.length === 0) {
    return <p>No predictions available.</p>;
  }

  // Sort facilities from highest to lowest demand.
  const sortedForecasts = [...forecasts].sort((a, b) => {
    return b.predicted_requests - a.predicted_requests;
  });

  // Calculate the total predicted requests.
  const totalRequests = forecasts.reduce((total, forecast) => {
    return total + Number(forecast.predicted_requests);
  }, 0);

  // Find the highest prediction for our chart.
  const highestRequests = Math.max(
    1,
    ...forecasts.map((forecast) => Number(forecast.predicted_requests))
  );

  // Get the month and year being predicted.
  const firstForecast = forecasts[0];

  const forecastMonth = new Date(
    firstForecast.year,
    firstForecast.month - 1,
    1
  ).toLocaleDateString("en-PH", {
    month: "long",
    year: "numeric"
  });

  
return (
  <div className="forecast-page">

    {/* Page heading */}
    <div className="forecast-heading">
      <h1>Predictive Analytics</h1>
      <p>
        Predicted campus facility reservation demand
        for {` ${forecastMonth}`}.
      </p>
    </div>

    {/* Synthetic data notice */}
    <div className="forecast-notice">
      <strong>Simulation:</strong> These predictions are
      based on synthetic historical reservation data.
    </div>

    {/* Summary cards */}
    <div className="forecast-summary">

      <div className="forecast-summary-card">
        <span>Total Predicted Requests</span>
        <h2>{totalRequests}</h2>
      </div>

      <div className="forecast-summary-card">
        <span>Facilities Analyzed</span>
        <h2>{forecasts.length}</h2>
      </div>

    </div>

    {/* Facility demand */}
    <div className="forecast-section">

      <h2>Predicted Demand by Facility</h2>
      <p>This chart shows the predicted number of reservation requests for each facility in the upcoming month.</p>

      {sortedForecasts.map((forecast) => (

        <div
          className="forecast-item"
          key={`${forecast.facility_id}-${forecast.year}-${forecast.month}`}
        >

          <div className="forecast-item-header">
            <h3>
                {forecast.facility_name || `Facility ID: ${forecast.facility_id}`}
            </h3>

            <span>
              {forecast.predicted_requests} Requests
            </span>
          </div>

          <progress
            className="forecast-progress"
            value={forecast.predicted_requests}
            max={highestRequests}
            aria-label={`Predicted demand for facility ${forecast.facility_id}`}
          />

        </div>

      ))}

        </div>

    </div>
    );
}