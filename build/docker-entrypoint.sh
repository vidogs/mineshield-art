#!/usr/bin/env sh
set -e

TEMPLATE="/usr/share/nginx/html/config.tpl.js"
TARGET="/usr/share/nginx/html/config.js"

echo "Starting container..."

if [ -f "$TEMPLATE" ]; then
  echo "Generating config.js from config.tpl.js using envsubst..."

  envsubst < "$TEMPLATE" > "$TARGET"
else
  echo "Template $TEMPLATE not found, skipping envsubst."
fi

echo "Starting nginx..."
exec nginx -g 'daemon off;'
