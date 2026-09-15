#!/usr/bin/env bash
# Copies Firebase client configs into place (if provided) and regenerates native projects.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

IOS_SRC="${1:-}"
ANDROID_SRC="${2:-}"

if [[ -n "$IOS_SRC" ]]; then
  cp "$IOS_SRC" "$ROOT/GoogleService-Info.plist"
  echo "✓ Installed GoogleService-Info.plist"
fi

if [[ -n "$ANDROID_SRC" ]]; then
  cp "$ANDROID_SRC" "$ROOT/google-services.json"
  echo "✓ Installed google-services.json"
fi

missing=0
if [[ ! -f "$ROOT/GoogleService-Info.plist" ]]; then
  echo "✗ Missing $ROOT/GoogleService-Info.plist"
  missing=1
fi
if [[ ! -f "$ROOT/google-services.json" ]]; then
  echo "✗ Missing $ROOT/google-services.json"
  missing=1
fi

if [[ "$missing" -eq 1 ]]; then
  cat <<'EOF'

Download both files from Firebase Console, then either:
  1. Drop them in the project root, or
  2. Run:
       yarn setup:firebase /path/to/GoogleService-Info.plist /path/to/google-services.json

Firebase Console steps:
  1. https://console.firebase.google.com → your Blivap project
  2. Project settings (gear) → Your apps
  3. Add iOS app if needed — Bundle ID: com.miecode.blivap
     → Download GoogleService-Info.plist
  4. Add Android app if needed — Package: com.miecode.blivap
     → Download google-services.json
  5. Cloud Messaging → upload APNs Auth Key (.p8) for iOS delivery

EOF
  exit 1
fi

# Confirm bundle / package match app.json
BUNDLE="$(/usr/libexec/PlistBuddy -c 'Print :BUNDLE_ID' "$ROOT/GoogleService-Info.plist" 2>/dev/null || true)"
PACKAGE="$(node -e "console.log(require('./google-services.json').client?.[0]?.client_info?.android_client_info?.package_name || '')")"

echo "iOS BUNDLE_ID in plist: ${BUNDLE:-unknown}"
echo "Android package in json: ${PACKAGE:-unknown}"
echo "Expected: com.miecode.blivap"

echo "Regenerating native projects with Firebase config..."
npx expo prebuild --platform ios --clean

echo ""
echo "Done. Rebuild the app:"
echo "  yarn ios"
echo ""
echo "Note: full push delivery needs a physical device + APNs key in Firebase Console."
