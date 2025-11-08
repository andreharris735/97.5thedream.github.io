from datetime import datetime
import requests
API_KEY = "NZwWg0a6maLfecEXeptumW9bopVjr9xp"

# Time window in UTC
START_TIME = "2025-10-30T22:00:00Z"  # after Oct 30, 5 PM local
END_TIME = "2025-10-31T22:10:00Z"    # before Oct 31, 5:10 PM local

# Endpoint for arrivals at Cedar Rapids (CID)
url = "https://aeroapi.flightaware.com/aeroapi/airports/KCID/flights/arrivals"

headers = {"x-apikey": API_KEY}
params = {
    "start": START_TIME,
    "end": END_TIME,
}

data_payload = {"flights": []}

response = requests.get(url, headers=headers, params=params)

def get_flights():
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

        if start_datetime <= actual_off and actual_on <= end_datetime: # flights with a departure time between start and end time
            if not arrival["diverted"] and not arrival["cancelled"]:
                load_json_data(arrival["ident"], arrival["flight_number"], arrival["blocked"],
                               arrival["diverted"], arrival["cancelled"], arrival["origin"]["city"],
                               arrival["origin"]["name"], arrival["origin"]["code_icao"],
                               arrival["actual_on"], arrival["actual_off"], arrival["actual_in"])

def load_json_data(ident, flight_number, blocked, diverted, cancelled, city, name, code_icao, actual_on, actual_off, actual_in):
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


if response.ok:
    get_flights()
    print(data_payload)
    data_payload.clear()
else:
    print("Error:", response.status_code, response.text)
