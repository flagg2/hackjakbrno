#!/bin/bash


RESPONSE=$(curl -X POST "http://localhost:8000/upload-zip" \
  -H "accept: application/json" \
  -H "Content-Type: multipart/form-data" \
  -F "file=@IT 30 ENG.zip")

FILE_ID=$(echo $RESPONSE | jq -r '.file_id')

echo "File ID: $FILE_ID"

curl -X POST "http://localhost:8000/insert-patient-embedding?file_id=$FILE_ID" \
  -H "accept: application/json"
