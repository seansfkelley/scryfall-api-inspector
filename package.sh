#!/usr/bin/env bash

set -euo pipefail

cd "$(dirname "$0")"

FILENAME="extension.zip"

rm -f "$FILENAME"
zip -r "$FILENAME" manifest.json content.js content.css icon.svg

echo "Created $FILENAME"
