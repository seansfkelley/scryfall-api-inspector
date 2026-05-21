#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"
zip -r scryfall-api-inspector.zip manifest.json content.js content.css icon.svg
echo "Created scryfall-api-inspector.zip"
