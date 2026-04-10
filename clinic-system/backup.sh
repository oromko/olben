#!/bin/bash

# Family Medium Clinic System - Backup Script
# Creates backups of the database

set -e

echo "🏥 Family Medium Clinic System - Database Backup"
echo "================================================"

# Configuration
BACKUP_DIR="./backups"
DATE=$(date +%Y%m%d_%H%M%S)
DB_NAME="${DB_NAME:-family_clinic}"
DB_USER="${DB_USER:-root}"
DB_PASSWORD="${DB_PASSWORD:-clinic123}"
DB_HOST="${DB_HOST:-localhost}"

# Create backup directory
mkdir -p "$BACKUP_DIR"

# Generate backup filename
BACKUP_FILE="$BACKUP_DIR/backup_${DB_NAME}_${DATE}.sql"

echo "Creating backup: $BACKUP_FILE"

# Create backup using mysqldump
mysqldump -h"$DB_HOST" -u"$DB_USER" -p"$DB_PASSWORD" "$DB_NAME" > "$BACKUP_FILE"

# Compress the backup
gzip "$BACKUP_FILE"

echo "✅ Backup created successfully: ${BACKUP_FILE}.gz"

# List recent backups
echo ""
echo "Recent backups:"
ls -lh "$BACKUP_DIR"/*.sql.gz 2>/dev/null | tail -5 || echo "No backups found"

echo ""
echo "To restore: ./restore.sh <backup_file.sql.gz>"
