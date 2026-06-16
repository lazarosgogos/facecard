# Facecard

Facecard is an Expo React Native app for browsing event photo collections and helping users find photos from a selected event. The app uses Supabase for authentication, event/photo metadata, and avatar storage.

The project is built around a simple flow:

1. Users sign in with an email magic link.
2. Authenticated users select an event year and month.
3. The app lists matching events from Supabase.
4. Users open an event to view a grid of event photos.
5. Users upload a selfie/avatar that is intended to be used for photo matching.

## What It Does

- Provides a mobile-first event photo browser using Expo Router.
- Protects app screens behind Supabase authentication.
- Persists sessions locally with AsyncStorage.
- Fetches available event years and months from Supabase RPC functions.
- Reads event records from a Supabase `events` table.
- Reads photo URLs from a Supabase `photos` table and displays them in a 3-column grid.
- Uploads a user avatar to the Supabase Storage `avatars` bucket.
- Supports automatic light/dark theming from the device color scheme.

## Data Sync Script

The repository also includes `sync_images.py`, a Python script that populates Supabase with event and photo metadata from Fotomada event pages.

The script:

- Starts from the latest stored `event_id`.
- Scrapes event title, department, date, and photo URLs.
- Handles paginated event photo pages.
- Inserts event metadata into `events`.
- Bulk inserts photo metadata into `photos`.
- Stops after several consecutive missing event IDs.

It expects these environment variables:

```bash
SUPABASE_URL=your-supabase-url
SUPABASE_UPDATE_DB_KEY=your-service-or-update-key
```

## Tech Stack

- Expo 54
- React 19
- React Native 0.81
- Expo Router
- Supabase Auth, Database, and Storage
- AsyncStorage
- Expo Image Picker
- Python, Requests, BeautifulSoup, and Supabase Python client for data syncing

## Project Structure

```text
src/app/                     Expo Router screens
src/components/              Reusable React Native components
src/components/initial-page/ Event year/month picker and event list
src/components/selected-event/ Selected event image grid and upload flow
lib/supabase.js              Supabase client configuration
sync_images.py               Event/photo metadata sync script
android/                     Native Android project
ios/                         Native iOS project
```

## Supabase Expectations

The app expects a Supabase project with:

- Email magic-link authentication enabled.
- An `events` table containing event metadata such as `event_id`, `title`, `department`, `event_date`, and `photo_count`.
- A `photos` table containing image metadata such as `id`, `event_id`, `filename`, `url`, and `processed`.
- RPC functions named `get_unique_event_years` and `get_unique_event_months`.
- A Storage bucket named `avatars` for user-uploaded avatar images.

## Getting Started

Install dependencies:

```bash
pnpm install
```

Start the Expo development client:

```bash
pnpm start
```

Run on Android:

```bash
pnpm android
```

Run on iOS:

```bash
pnpm ios
```

Run on web:

```bash
pnpm web
```

## Current Status

Facecard currently supports authentication, event browsing, selected-event image viewing, and avatar upload. The selected event screen includes a "Begin search" action that is prepared for the future photo-matching workflow, but the matching action itself is not implemented yet.
