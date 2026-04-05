#!/bin/bash
cd /root/.openclaw/workspace/vertex-streamlit-app
source ../vertex-streamlit/bin/activate

echo "🎯 Starting VERTEX Nexus Streamlit App..."
echo "🔗 Local: http://localhost:8501"
echo "🌐 Public: http://191.252.179.78:8501"
echo ""

# Kill any existing Streamlit process
pkill -f "streamlit run"

# Start Streamlit
streamlit run vertex_app.py \
  --server.port 8501 \
  --server.address 0.0.0.0 \
  --server.headless true \
  --browser.serverAddress "191.252.179.78" \
  --browser.gatherUsageStats false