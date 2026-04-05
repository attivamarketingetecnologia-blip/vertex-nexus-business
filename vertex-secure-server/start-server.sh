#!/bin/bash
cd /root/.openclaw/workspace/vertex-secure-server
while true; do
    echo "🎯 Starting VERTEX v3.0 Server..."
    node simple-server.js
    echo "⚠️  Server crashed or stopped. Restarting in 5 seconds..."
    sleep 5
done