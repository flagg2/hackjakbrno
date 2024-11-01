#!/bin/bash


RESPONSE=$(curl -X POST "http://localhost:8000/upload-zip" \
  -H "accept: application/json" \
  -H "Content-Type: multipart/form-data" \
  -F "file=@IT 30 ENG.zip")

# Extract file_id from the response using jq
# You might need to install jq: sudo apt-get install jq (Ubuntu) or brew install jq (Mac)
echo $RESPONSE

FILE_ID=$(echo $RESPONSE | jq -r '.file_id')

echo "File ID: $FILE_ID"

# Example datetime values (adjust according to your data)
FROM_DATE="2020-01-01T00:00:00"
TO_DATE="2025-01-02T00:00:00"
STEP=60

# Call the get-glycemia endpoint
curl -X GET "http://localhost:8000/get-glycemia?file_id=$FILE_ID&from_datetime=$FROM_DATE&to_datetime=$TO_DATE&step=$STEP" \
  -H "accept: application/json"

