import requests
from bs4 import BeautifulSoup
from supabase import create_client, Client
import os
import re
from datetime import datetime
from urllib.parse import urljoin
import time

# Supabase setup
url = os.environ.get("SUPABASE_URL")
key = os.environ.get("SUPABASE_UPDATE_DB_KEY")
supabase: Client = create_client(url, key)

BASE_URL = "https://www.fotomada.gr"
EVENTS_BASE = "https://www.fotomada.gr/events/view/"


def get_latest_event_id():
    """Get the highest event_id from database, or start from 3000"""
    try:
        result = (
            supabase.table("events")
            .select("event_id")
            .order("event_id", desc=True)
            .limit(1)
            .execute()
        )
        if result.data:
            return result.data[0]["event_id"] + 1
        return 3000
    except:
        return 3000


def parse_title(title):
    """Parse title to extract department and date"""
    parts = title.split(" - ")
    if len(parts) >= 2:
        department = parts[0].strip()
        date_str = parts[1].strip()

        # Extract date in DD/MM/YYYY format
        date_match = re.search(r"(\d{2}/\d{2}/\d{4})", date_str)
        if date_match:
            try:
                date_obj = datetime.strptime(date_match.group(1), "%d/%m/%Y")
                return department, date_obj.isoformat()
            except:
                pass

    return title.strip(), None


def fetch_event_data(event_id):
    """Fetch event page and extract data"""
    url = f"{EVENTS_BASE}{event_id}"

    try:
        response = requests.get(url, timeout=10)
        if response.status_code != 200:
            return None

        soup = BeautifulSoup(response.text, "html.parser")

        # Find title with class "heading row"
        title_elem = soup.find("h1", class_="heading row")
        if not title_elem:
            return None

        title = title_elem.get_text().strip()
        department, event_date = parse_title(title)

        # Find all photo divs
        photo_divs = soup.find_all("div", class_="flex-items")
        photo_urls = []

        for div in photo_divs:
            link = div.find("a", class_="gallery")
            if link and link.get("href"):
                photo_url = urljoin(BASE_URL, link["href"])
                photo_urls.append(photo_url)

        return {
            "event_id": event_id,
            "title": title,
            "department": department,
            "event_date": event_date,
            "photo_urls": photo_urls,
        }

    except Exception as e:
        print(f"Error fetching event {event_id}: {e}")
        return None


def store_photo_urls(event_data):
    """Store photo URLs in database"""
    for photo_url in event_data["photo_urls"]:
        try:
            # Extract filename from URL
            filename = photo_url.split("/")[-1]

            # Store photo metadata in database
            supabase.table("photos").insert(
                {
                    "event_id": event_data["event_id"],
                    "filename": filename,
                    "url": photo_url,
                    "processed": False,  # Flag for feature extraction
                }
            ).execute()

            print(f"Stored URL: {filename}")

        except Exception as e:
            print(f"Error storing photo URL {photo_url}: {e}")


def main():
    start_id = get_latest_event_id()
    current_id = start_id
    consecutive_failures = 0

    print(f"Starting from event ID: {start_id}")

    while consecutive_failures < 5:  # Stop after 5 consecutive failures
        print(f"Processing event {current_id}...")

        event_data = fetch_event_data(current_id)

        if event_data:
            # Store event metadata
            try:
                supabase.table("events").insert(
                    {
                        "event_id": event_data["event_id"],
                        "title": event_data["title"],
                        "department": event_data["department"],
                        "event_date": event_data["event_date"],
                        "photo_count": len(event_data["photo_urls"]),
                    }
                ).execute()

                print(
                    f"Found event: {event_data['title']} ({len(event_data['photo_urls'])} photos)"
                )

                # Store photo URLs
                store_photo_urls(event_data)

                consecutive_failures = 0

            except Exception as e:
                print(f"Error storing event data: {e}")

        else:
            consecutive_failures += 1
            print(f"No event found at {current_id} (failures: {consecutive_failures})")

        current_id += 1
        time.sleep(1)  # Rate limiting

    print("Finished processing events")


if __name__ == "__main__":
    main()
