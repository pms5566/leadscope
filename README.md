# Local Business Lead Scanner (LeadScope)

LeadScope is a powerful developer utility and web dashboard designed to identify local businesses globally that do not currently have a registered website, and automatically enrich them with direct social media profiles (Facebook, Instagram, LinkedIn, WhatsApp) and contact emails.

## Features

- **Double Interface**: Full-featured Terminal CLI tool + Premium Web Dashboard.
- **Smart Filtering**: Automatically filters out any businesses that already have a website.
- **Social Media & Contact Discovery**: Uses search API queries to locate social profiles and public email mentions.
- **Two Execution Modes**:
  - **Live Mode**: Queries Google Places API (New) and Google Custom Search JSON API.
  - **Demo/Mock Mode**: Simulates operations with a robust local data generator, allowing full testing of the UI and CSV/JSON export features without needing API credentials.
- **Exporting**: Download compiled leads as CSV or JSON in one click.

---

## Installation & Setup

1. **Navigate to the project directory** (recommending setting this as your active workspace):
   ```bash
   cd /Users/parmeetsingh/.gemini/antigravity/scratch/local-lead-scanner
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Copy `.env.example` to `.env` and fill in your API credentials:
   ```bash
   cp .env.example .env
   ```

---

## How to Get Google API Keys (For Live Mode)

### 1. Google Places API Key
1. Go to the [Google Cloud Console](https://console.cloud.google.com/).
2. Create a new project or select an existing one.
3. Enable the **Places API (New)**.
4. Go to **APIs & Services > Credentials** and create an API Key.
5. Add this key to `GOOGLE_PLACES_API_KEY` in `.env`.

### 2. Google Custom Search JSON API & Search Engine ID (CX)
1. Enable the **Custom Search API** in your Google Cloud Console.
2. Generate an API Key and add it to `GOOGLE_SEARCH_API_KEY` in `.env`.
3. Go to the [Programmable Search Engine Console](https://cse.google.com/).
4. Create a new search engine. Under **What to search**, select "Search the entire web" (and turn on "Search the entire web" switch).
5. Copy the **Search Engine ID (CX)** and add it to `GOOGLE_SEARCH_ENGINE_ID` in `.env`.

---

## Usage Guide

### 1. Running the Terminal CLI
Use the CLI to search, filter, and export leads directly from your terminal.

```bash
# Basic Mock Scan (demonstrating execution without API keys)
node cli.js --niche "bakery" --location "Paris" --mock

# Run Live Scan and save results to a CSV file (requires .env configuration)
node cli.js --niche "dentist" --location "New York" --output my_leads.csv
```

**Options**:
- `-n, --niche <niche>`: The type of business (e.g. bakery, coffee, dentist, gym) [Required]
- `-l, --location <location>`: City or geographic area (e.g. Paris, London, Tokyo) [Required]
- `-o, --output <output>`: Save results directly to a CSV file.
- `-m, --mock`: Force mock search even if live API credentials are configured.

### 2. Running the Web Application
Launch the backend server and open the web dashboard:

```bash
npm start
# Or run: node server.js
```

Once started, open your web browser and navigate to:
```
http://localhost:3000
```

From the dashboard, you can:
- Perform local scans using the input fields.
- Toggle between live search and demo mode using the switch.
- Read real-time step notifications as queries are processed.
- View total leads, social links found, and active WhatsApp numbers.
- Instantly export your lead tables to CSV or JSON formats.
