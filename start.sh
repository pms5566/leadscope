#!/bin/bash
# ─────────────────────────────────────────────
#  LeadScope One-Click Startup Script
#  Starts: Local Server + ngrok (static domain)
# ─────────────────────────────────────────────

STATIC_DOMAIN="drab-citric-acid.ngrok-free.dev"

echo ""
echo "🚀 Starting LeadScope..."
echo "────────────────────────────────────────"

# Kill any existing processes
kill -9 $(lsof -t -i:3000) 2>/dev/null || true
pkill -f ngrok 2>/dev/null || true
sleep 1

# Keep Mac awake (no sleep while server is running)
caffeinate -i &
CAFFEINATE_PID=$!
echo "☕ Mac kept awake (caffeinate running)"

# Start local server
cd "$(dirname "$0")"
npm start &
SERVER_PID=$!
echo "✅ Local server started at http://localhost:3000"
sleep 2

# Start ngrok with static domain
ngrok http 3000 --domain=$STATIC_DOMAIN &
NGROK_PID=$!
sleep 2

echo ""
echo "════════════════════════════════════════"
echo "  🏠 Local:   http://localhost:3000"
echo "  🌍 Public:  https://$STATIC_DOMAIN"
echo "════════════════════════════════════════"
echo ""
echo "Press Ctrl+C to stop everything."
echo ""

# Wait — on Ctrl+C, kill all
trap "echo ''; echo 'Stopping...'; kill $SERVER_PID $NGROK_PID $CAFFEINATE_PID 2>/dev/null; echo 'Done!'; exit 0" INT
wait
