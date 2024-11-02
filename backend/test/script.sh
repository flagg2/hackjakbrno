#!/bin/bash


RESPONSE=$(curl -X POST "http://localhost:8000/upload-zip" \
  -H "accept: application/json" \
  -H "Content-Type: multipart/form-data" \
  -F "file=@IT 30 ENG.zip")

FILE_ID=$(echo $RESPONSE | jq -r '.file_id')

echo "File ID: $FILE_ID"

# Example datetime values (adjust according to your data)
FROM_DATE="2020-01-01T00:00:00"
TO_DATE="2025-01-02T00:00:00"
STEP=120

curl -X GET "http://localhost:8000/get-glycemia?file_id=$FILE_ID&from_datetime=$FROM_DATE&to_datetime=$TO_DATE&step_in_minutes=$STEP" \
  -H "accept: application/json"

curl -X GET "http://localhost:8000/get-basal-insulin?file_id=$FILE_ID&from_datetime=$FROM_DATE&to_datetime=$TO_DATE&step_in_minutes=$STEP" \
  -H "accept: application/json"

curl -X GET "http://localhost:8000/get-bolus-insulin?file_id=$FILE_ID&from_datetime=$FROM_DATE&to_datetime=$TO_DATE&step_in_minutes=$STEP&dose=all" \
  -H "accept: application/json"

curl -X GET "http://localhost:8000/get-dosage-distribution?file_id=$FILE_ID&from_datetime=$FROM_DATE&to_datetime=$TO_DATE&step_in_minutes=$STEP" \
  -H "accept: application/json"
