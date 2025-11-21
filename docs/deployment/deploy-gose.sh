#!/bin/bash
# Deployment script for gose.kz
# This script runs on the server to deploy new releases

set -e

PROJECT_ROOT="/var/www/gose"
RELEASES_DIR="$PROJECT_ROOT/releases"
CURRENT_LINK="$PROJECT_ROOT/current"
SHARED_DIR="$PROJECT_ROOT/shared"
BUILD_ARCHIVE="/tmp/gose-build.tar.gz"

VERSION="${1:-$(date +%Y-%m-%d_%H-%M-%S)}"
RELEASE_DIR="$RELEASES_DIR/$VERSION"

echo "🚀 Starting deployment of gose.kz"
echo "=================================="
echo "Version: $VERSION"
echo "Release directory: $RELEASE_DIR"
echo ""

# Create directories if they don't exist
echo "📁 Ensuring directory structure exists..."
mkdir -p "$RELEASES_DIR"
mkdir -p "$SHARED_DIR/logs"

# Create release directory
echo "📦 Creating release directory..."
mkdir -p "$RELEASE_DIR"

# Extract build
echo "📂 Extracting build archive..."
if [ ! -f "$BUILD_ARCHIVE" ]; then
    echo "❌ ERROR: Build archive not found at $BUILD_ARCHIVE"
    exit 1
fi

tar -xzf "$BUILD_ARCHIVE" -C "$RELEASE_DIR"
echo "✅ Build extracted to $RELEASE_DIR"

# Verify extraction
FILE_COUNT=$(find "$RELEASE_DIR" -type f | wc -l)
echo "📊 Extracted $FILE_COUNT files"

if [ "$FILE_COUNT" -lt 1 ]; then
    echo "❌ ERROR: Build appears to be empty!"
    exit 1
fi

# Create logs symlink
if [ -d "$SHARED_DIR/logs" ]; then
    ln -sfn "$SHARED_DIR/logs" "$RELEASE_DIR/logs"
fi

# Atomic symlink swap (zero-downtime deployment)
echo "🔗 Switching current symlink to new release..."
ln -sfn "$RELEASE_DIR" "$CURRENT_LINK.tmp"
mv -Tf "$CURRENT_LINK.tmp" "$CURRENT_LINK"

echo "✅ Current symlink points to: $(readlink $CURRENT_LINK)"

# Cleanup old releases (keep last 5)
echo "🧹 Cleaning up old releases (keeping last 5)..."
cd "$RELEASES_DIR"
ls -t | tail -n +6 | xargs -r rm -rf
REMAINING=$(ls -1 | wc -l)
echo "📊 Releases remaining: $REMAINING"

# Verify Nginx can access files
echo "🔍 Verifying file permissions..."
chmod -R 755 "$RELEASE_DIR"

# Remove build archive
echo "🗑️  Removing temporary build archive..."
rm -f "$BUILD_ARCHIVE"

echo ""
echo "🎉 =================================="
echo "🎉 Deployment successful!"
echo "🎉 =================================="
echo ""
echo "✅ Version deployed: $VERSION"
echo "✅ Site location: $CURRENT_LINK"
echo "✅ Rollback available: ~/rollback-gose.sh"
echo ""
echo "📋 Current releases:"
ls -lt "$RELEASES_DIR" | head -n 6
echo ""
echo "🌐 Site should be live at: https://gose.kz"
