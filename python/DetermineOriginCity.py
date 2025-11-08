import requests
from datetime import datetime, timezone, timedelta

API_KEY = "gROBeD6MpfawMAbCR2qgKf29wqDdqgcn"

# Time window in UTC
start_time = "2025-10-30T22:00:00Z"  # after Oct 30, 5 PM local
end_time = "2025-10-31T22:10:00Z"    # before Oct 31, 5:10 PM local

# Endpoint for arrivals at Cedar Rapids (CID)
url = "https://aeroapi.flightaware.com/aeroapi/airports/KCID/flights/arrivals"

headers = {"x-apikey": API_KEY}
params = {
    "start": start_time,
    "end": end_time,
}

# Function to convert UTC to Central Time (CST/CDT)
def to_central_time(utc_str):
    if not utc_str:
        return "Unknown"
    try:
        utc_dt = datetime.fromisoformat(utc_str.replace("Z", "+00:00"))
        central_offset = timedelta(hours=-6)  # adjust for CST (UTC-6); use -5 for CDT
        central_dt = utc_dt + central_offset
        return central_dt.strftime("%Y-%m-%d %I:%M %p CT")
    except Exception:
        return "Invalid time"

response = requests.get(url, headers=headers, params=params)

def get_KCID_flights():
    num_flights = len(response.json()["arrivals"])
    for i in range(num_flights):
        actual_off = response.json()["arrivals"][i]["actual_off"]
        if ((actual_off >= start_time) and (actual_off < end_time)):
            #FIXME: Convert the Strings actual_off, start_time, actual_off, and end_time to datetime and compare
            print("actual_off is " + actual_off)
            print("start time is " + start_time)
            print("end time is " + end_time)
            print("success")
        print(response.json()["arrivals"][i]["ident"])
        print(response.json()["arrivals"][i]["flight_number"])
        print(response.json()["arrivals"][i]["blocked"])
        print(response.json()["arrivals"][i]["diverted"])
        print(response.json()["arrivals"][i]["cancelled"])
        print(response.json()["arrivals"][i]["origin"]["city"])
        print(response.json()["arrivals"][i]["origin"]["name"])
        print(response.json()["arrivals"][i]["origin"]["code_icao"])
        print(response.json()["arrivals"][i]["actual_on"])
        print(response.json()["arrivals"][i]["actual_off"])
        print(response.json()["arrivals"][i]["actual_in"])
        print("\n")

# Fetch flight data

if response.ok:
    get_KCID_flights()
    # flights = response.json().get("flights", [])
    # print(f"Found {len(flights)} flights arriving in Cedar Rapids during your window:\n")

    # for f in flights:
    #     ident = f.get("ident", "N/A")
    #     origin = f.get("origin", {})

    #     origin_code = origin.get("code", "Unknown")
    #     origin_city = origin.get("city", "Unknown City")
    #     origin_name = origin.get("name", "Unknown Airport")

    #     arrival_time_utc = f.get("arrival_time", {}).get("actual")
    #     arrival_ct = to_central_time(arrival_time_utc)

    #     print(f"✈️ Flight {ident} from {origin_city} ({origin_code}) — {origin_name}")
    #     print(f"   Arrived at: {arrival_ct}\n")
else:
    print("Error:", response.status_code, response.text)
