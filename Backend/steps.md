
# Vorgehen

AWS CLI installieren
"~.aws/config" erstellen
"~.aws/credentials" erstellen

DynamoDB > create Table
- checking
- ImageId as primary key

IAM > Rolle erstellen
- save-dynamo-db-role
- roles:
    - AmazonDynamoDBFullAccess
    - AWSLambdaFullAccess
    - CloudWatchFullAccess

IAM > Rolle erstellen
- api-role
- roles:
    - AmazonAPIGatewayPushToCloudWatchLogs

Lambda erstellen:
- save-checking
- Node.js 1.4x
- existing role: save-dynamo-db-role

API Gateway > HTTP API erstellen
- HTTP API
- checking
- Route: "POST", "/"
- CORS: "*" (adjust)
- -> Attach Authorization
- -> Model?

API Gateway > API > Model erstellen
- gemäss checking.json

API Gateway > API > Method erstellen
- Endpoint = Regional
- api-role
- save-checking

----------------------------------------------------------------

IAM > Rolle erstellen
- image-classification-role
- roles:
    - AmazonRekognitionFullAccess
    - AmazonS3FullAccess
    - AWSLambdaFullAccess
    - CloudWatchFullAccess

s3 > Bucket erstellen
- image-gallery
- Blocking ausschalten (adjust)
- webhosting enablen
- Bucket Policy
- CORS?

Lambda erstellen:
- classification-image-gallery
- Node.js 1.4x
- existing role: image-classification-role

API Gateway > HTTP API erstellen
- HTTP API
- classification
- Route: "POST", "/"
- CORS: "*" (adjust)
- -> Attach Authorization
- -> Model?



