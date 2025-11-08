import os, json
from datetime import datetime
from dotenv import load_dotenv
import requests

# Load env vars from .env
load_dotenv()

# Time window in UTC
START_TIME = "2025-10-30T22:00:00Z"  # after Oct 30, 5 PM local
END_TIME = "2025-10-31T22:10:00Z"    # before Oct 31, 5:10 PM local
TARGET_ICAO = "KCID"
# Endpoint for arrivals at Cedar Rapids (CID)
URL = f"https://aeroapi.flightaware.com/aeroapi/airports/{TARGET_ICAO}/flights/arrivals"

headers = {"x-apikey": os.getenv("API_KEY")}
params = {
    "start": START_TIME,
    "end": END_TIME,
}

data_payload = {"flights": []}

response = requests.get(URL, headers=headers, params=params)

def get_flights():
    """
    Fetches flight arrival data from the FlightAware AeroAPI and filters it
    based on actual departure and arrival times.
    Flights are excluded if:
    - They never left the runway (no `actual_off` timestamp).
    - Their departure time is before START_TIME or arrival time is after END_TIME.
    Returns:
        None
    """
    data = response.json()

    for arrival in data["arrivals"]:
        actual_off_str = arrival.get("actual_off")
        actual_on_str = arrival.get("actual_on")
        if not actual_off_str:
            continue
        actual_off = datetime.fromisoformat(actual_off_str.replace("Z", "+00:00"))
        actual_on = datetime.fromisoformat(actual_on_str.replace("Z", "+00:00"))
        start_datetime = datetime.fromisoformat(START_TIME.replace("Z", "+00:00"))
        end_datetime = datetime.fromisoformat(END_TIME.replace("Z", "+00:00"))

        # flights with a departure time between start and end time
        if start_datetime <= actual_off and actual_on <= end_datetime:
            if not arrival["diverted"] and not arrival["cancelled"]:
                load_json_data(arrival["ident"], arrival["flight_number"], arrival["blocked"],
                               arrival["diverted"], arrival["cancelled"], arrival["origin"]["city"],
                               arrival["origin"]["name"], arrival["origin"]["code_icao"],
                               arrival["actual_on"], arrival["actual_off"], arrival["actual_in"])

def load_json_data(ident, flight_number, blocked, diverted, cancelled, city, name, code_icao, actual_on, actual_off, actual_in):
    """
    Appends flight information as a JSON-compatible dictionary to the global data payload.
    Args:
        ident (str): The flight identifier (e.g., "ENY4318").
        flight_number (str): The airline's flight number.
        blocked (bool): Whether the flight information is blocked.
        diverted (bool): Whether the flight was diverted.
        cancelled (bool): Whether the flight was cancelled.
        city (str): The origin city of the flight.
        name (str): The name of the origin airport.
        code_icao (str): The ICAO code of the origin airport.
        actual_on (str): Timestamp when the flight landed (runway on).
        actual_off (str): Timestamp when the flight took off (runway off).
        actual_in (str): Timestamp when the flight arrived at the gate.
    Returns:
        None
    """
    data_payload["flights"].append({
        "ident": ident,
        "flight_number": flight_number,
        "blocked": blocked,
        "diverted": diverted,
        "cancelled": cancelled,
        "origin_city": city,
        "origin_airport_name": name,
        "code_icao": code_icao,
        "runway_arrival": actual_on,
        "runway_departure": actual_off,
        "gate_arrival": actual_in
    })

def write_json():
    """
    Writes the contents of the flight data dictionary to a JSON file
    """
    with open("python/app/frontend_payload.json", "w") as f:
        json.dump(data_payload, f, indent=4)

if response.ok:
    get_flights()
    write_json()
    data_payload.clear()
else:
    print("Error:", response.status_code, response.text)
