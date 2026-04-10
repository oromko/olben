#!/bin/bash

# Family Medium Clinic System - Restore Script
# Restores database from a backup file

set -e

echo "🏥 Family Medium Clinic System - Database Restore"
echo "================================================="

# Check if backup file is provided
if [ -z "$1" ]; then
    echo "❌ Error: No backup file specified"
    echo "Usage: ./restore.sh <backup_file.sql.gz>"
    echo ""
    echo "Available backups:"
    ls -lh ./backups/*.sql.gz 2>/dev/null || echo "No backups found in ./backups/"
    exit 1
fi

BACKUP_FILE="$1"

# Check if backup file exists
if [ ! -f "$BACKUP_FILE" ]; then
    echo "❌ Error: Backup file not found: $BACKUP_FILE"
    exit 1
fi

# Configuration
DB_NAME="${DB_NAME:-family_clinic}"
DB_USER="${DB_USER:-root}"
DB_PASSWORD="${DB_PASSWORD:-clinic123}"
DB_HOST="${DB_HOST:-localhost}"

echo "Restoring from: $BACKUP_FILE"
echo "Database: $DB_NAME"
echo ""

# Warn user
read -p "⚠️  WARNING: This will overwrite the current database. Continue? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Restore cancelled."
    exit 0
fi

# Decompress if needed
if [[ "$BACKUP_FILE" == *.gz ]]; then
    echo "Decompressing backup..."
    gunzip -c "$BACKUP_FILE" > /tmp/restore_temp.sql
    BACKUP_FILE="/tmp/restore_temp.sql"
fi

# Restore database
echo "Restoring database..."
mysql -h"$DB_HOST" -u"$DB_USER" -p"$DB_PASSWORD" "$DB_NAME" < "$BACKUP_FILE"

# Cleanup temp file
if [ -f /tmp/restore_temp.sql ]; then
    rm /tmp/restore_temp.sql
fi

echo ""
echo "✅ Database restored successfully!"
