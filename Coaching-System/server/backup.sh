#!/bin/bash

# 1. Variables को परिभाषित करें
# इन मानों को अपनी सेटिंग्स के अनुसार बदलें
DB_NAME="your_database_name"
DB_HOST="localhost:27017" # या आपका रिमोट होस्ट और पोर्ट
BACKUP_DIR="/path/to/your/backup/folder" # जहां बैकअप सेव होगा
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/$DB_NAME-$TIMESTAMP.gz"

# 2. बैकअप फ़ोल्डर बनाएँ (यदि मौजूद न हो)
mkdir -p $BACKUP_DIR

# 3. mongodump का उपयोग करके डेटाबेस का बैकअप लें और उसे कंप्रेस करें
# --uri का उपयोग करना सबसे अच्छा है
echo "Starting backup of $DB_NAME to $BACKUP_FILE..."

mongodump \
    --uri="mongodb://$DB_HOST/$DB_NAME" \
    --gzip \
    --archive="$BACKUP_FILE"

if [ $? -eq 0 ]; then
    echo "Backup successful: $BACKUP_FILE"
else
    echo "Backup FAILED!"
    exit 1
fi

# 4. 7 दिन से पुरानी फ़ाइलों को हटाना (Retention Policy)
echo "Removing backups older than 7 days..."
find $BACKUP_DIR -type f -name "*.gz" -mtime +7 -exec rm {} \;

echo "Cleanup complete."