#!/bin/bash
# Rollback script for gose.kz
# This script allows quick rollback to a previous release

set -e

PROJECT_ROOT="/var/www/gose"
RELEASES_DIR="$PROJECT_ROOT/releases"
CURRENT_LINK="$PROJECT_ROOT/current"

echo "🔄 GOSE.KZ Rollback Tool"
echo "========================="
echo ""

# Check if releases directory exists
if [ ! -d "$RELEASES_DIR" ]; then
    echo "❌ ERROR: Releases directory not found: $RELEASES_DIR"
    exit 1
fi

# Get current release
CURRENT_RELEASE=$(readlink "$CURRENT_LINK" 2>/dev/null || echo "none")
if [ "$CURRENT_RELEASE" != "none" ]; then
    CURRENT_VERSION=$(basename "$CURRENT_RELEASE")
    echo "📍 Current version: $CURRENT_VERSION"
else
    echo "⚠️  No current deployment found"
fi

echo ""
echo "📦 Available releases:"
echo "======================"

# List all releases with numbers
releases=($(ls -t "$RELEASES_DIR"))
count=0

for release in "${releases[@]}"; do
    count=$((count + 1))
    if [ "$RELEASES_DIR/$release" == "$CURRENT_RELEASE" ]; then
        echo "  $count) $release ⭐ (current)"
    else
        echo "  $count) $release"
    fi
done

if [ ${#releases[@]} -eq 0 ]; then
    echo "❌ No releases found!"
    exit 1
fi

echo ""
echo "======================"

# If argument provided, use it; otherwise prompt user
if [ -n "$1" ]; then
    choice="$1"
else
    echo ""
    read -p "Enter release number to rollback to (1-$count, or 'q' to quit): " choice
fi

# Handle quit
if [ "$choice" == "q" ] || [ "$choice" == "Q" ]; then
    echo "👋 Rollback cancelled"
    exit 0
fi

# Validate input
if ! [[ "$choice" =~ ^[0-9]+$ ]] || [ "$choice" -lt 1 ] || [ "$choice" -gt "$count" ]; then
    echo "❌ Invalid choice: $choice"
    exit 1
fi

# Get selected release
TARGET_RELEASE="${releases[$((choice - 1))]}"
TARGET_PATH="$RELEASES_DIR/$TARGET_RELEASE"

echo ""
echo "🎯 Rolling back to: $TARGET_RELEASE"
echo "=================================="

# Check if target is already current
if [ "$TARGET_PATH" == "$CURRENT_RELEASE" ]; then
    echo "⚠️  This release is already active!"
    exit 0
fi

# Perform rollback (atomic symlink swap)
echo "🔗 Switching current symlink..."
ln -sfn "$TARGET_PATH" "$CURRENT_LINK.tmp"
mv -Tf "$CURRENT_LINK.tmp" "$CURRENT_LINK"

echo "✅ Current symlink points to: $(readlink $CURRENT_LINK)"

echo ""
echo "🎉 =================================="
echo "🎉 Rollback successful!"
echo "🎉 =================================="
echo ""
echo "✅ Active version: $TARGET_RELEASE"
echo "✅ Site location: $CURRENT_LINK"
echo ""
echo "🌐 Site should be live at: https://gose.kz"
echo ""
echo "💡 To rollback again, run: ~/rollback-gose.sh"
echo "💡 To deploy new version, run: ~/deploy-gose.sh [VERSION]"
echo ""
