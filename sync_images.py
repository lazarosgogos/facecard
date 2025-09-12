import requests
from bs4 import BeautifulSoup
from supabase import create_client, Client
import os
import re
from datetime import datetime
from urllib.parse import urljoin, urlparse, parse_qs
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


def get_current_page_from_url(response_url):
    """Extract current page number from redirected URL"""
    parsed = urlparse(response_url)
    query_params = parse_qs(parsed.query)
    page = query_params.get("page", ["1"])[0]
    return int(page)


def fetch_event_photos_from_page(event_id, page):
    """Fetch photos from a specific page of an event"""
    url = f"{EVENTS_BASE}{event_id}?page={page}"

    try:
        response = requests.get(url, timeout=10)
        if response.status_code != 200:
            return None, None

        # Check if we were redirected to page 1 (indicates we've gone beyond available pages)
        current_page = get_current_page_from_url(response.url)
        if page > 1 and current_page == 1:
            return None, True  # Indicates we've reached the end

        soup = BeautifulSoup(response.text, "html.parser")

        # Find all photo divs
        photo_divs = soup.find_all("div", class_="flex-items")
        photo_urls = []

        for div in photo_divs:
            link = div.find("a", class_="gallery")
            if link and link.get("href"):
                photo_url = urljoin(BASE_URL, link["href"])
                photo_urls.append(photo_url)

        return photo_urls, False

    except Exception as e:
        print(f"Error fetching event {event_id} page {page}: {e}")
        return None, None


def fetch_event_data(event_id):
    """Fetch event page and extract all data from all pages"""
    # First, get the title from page 1
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

        # Now collect photos from all pages
        all_photo_urls = []
        page = 1

        while True:
            print(f"  Fetching page {page}...")
            photo_urls, reached_end = fetch_event_photos_from_page(event_id, page)

            if reached_end or photo_urls is None:
                break

            if photo_urls:
                all_photo_urls.extend(photo_urls)
                print(f"  Found {len(photo_urls)} photos on page {page}")

            page += 1
            time.sleep(0.2)  # Rate limiting between pages

        return {
            "event_id": event_id,
            "title": title,
            "department": department,
            "event_date": event_date,
            "photo_urls": all_photo_urls,
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

        except Exception as e:
            print(f"Error storing photo URL {photo_url}: {e}")
            
def store_photo_urls_bulk(event_data):
    """Store photo URLs in the database using a single bulk insert."""
    photos_to_insert = []

    # First, prepare the list of data to be inserted
    for photo_url in event_data["photo_urls"]:
        # Extract filename from URL
        filename = photo_url.split("/")[-1]
        
        # Add the photo's metadata as a dictionary to our list
        photos_to_insert.append(
            {
                "event_id": event_data["event_id"],
                "filename": filename,
                "url": photo_url,
                "processed": False,  # Flag for feature extraction
            }
        )

    # Now, perform a single bulk insert operation
    try:
        # Check if the list is not empty to avoid an unnecessary API call
        if photos_to_insert:
            supabase.table("photos").insert(photos_to_insert).execute()
            print("Successfully performed a bulk insert for all photo URLs.")
        else:
            print("No photo URLs to insert.")

    except Exception as e:
        print(f"Error performing bulk insert for photo URLs: {e}")

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
                    f"Found event: {event_data['title']} ({len(event_data['photo_urls'])} total photos)"
                )

                # Store photo URLs
                store_photo_urls_bulk(event_data) # This should use bulk upload instead of one-by-one

                consecutive_failures = 0

            except Exception as e:
                print(f"Error storing event data: {e}")

        else:
            consecutive_failures += 1
            print(f"No event found at {current_id} (failures: {consecutive_failures})")

        current_id += 1
        time.sleep(1)  # Rate limiting between events

    print("Finished processing events")


if __name__ == "__main__":
    main()
