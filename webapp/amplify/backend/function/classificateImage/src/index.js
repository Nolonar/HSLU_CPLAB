const aws = require('aws-sdk');
const s3 = new aws.S3({ apiVersion: '2006-03-01', region: 'us-east-1' });
const rekognition = new aws.Rekognition();
const dynamodb = new aws.DynamoDB({ apiVersion: '2012-08-10' });

function unwrapImage(formData) {
    const lines = formData.split(/\r?\n/);
    const parts = lines[3].split(',');
    const typeMatch = parts[0].match(/data:(.*?);/gi);
    const contentType = (0 < typeMatch.length) ? typeMatch[0].slice(5, -1) : "text/plain";
    const user = lines[7];
    const encoded_data = parts[1];
    return { contentType, encoded_data, user, raw: lines[3] }
}

exports.handler = async (event) => {
    let bucketName = 'cplabwebappbucket';
    let tableName = "images";
    console.log('request: ' + JSON.stringify(event));
    const response = {
        statusCode: 200,
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "*"
        },
        body: '',
    }
    try {
        if (process.env.ENV && process.env.ENV !== "NONE") {
            tableName = tableName + '-' + process.env.ENV;
        }

        const bucketResult = await s3.listBuckets().promise()
        for (const bucket of bucketResult.Buckets) {
            if (bucket.Name.startsWith(bucketName)) {
                bucketName = bucket.Name;
                break;
            }
        }

        const imageObject = unwrapImage(event.body);
        const filename = Date.now().toString(36) + "_" + imageObject.user + "." + imageObject.contentType.split("/")[1];

        const decoded_data = Buffer.from(imageObject.encoded_data, 'base64');

        const uploadParams = {
            Bucket: bucketName,
            Key: filename,
            Body: decoded_data,
            ContentType: imageObject.contentType
        };
        console.log(uploadParams);
        await s3.putObject(uploadParams).promise();

        const classificationParams = {
            Image: {
                S3Object: {
                    Bucket: bucketName,
                    Name: filename
                }
            },
            MaxLabels: 10,
            MinConfidence: 0
        };
        console.log(classificationParams);
        const result = await rekognition.detectLabels(classificationParams).promise();
        const category = (0 < result.Labels.length) ? result.Labels[0].Name : "undefined";

        const databaseParams = {
            TableName: tableName,
            Item: {
                'image': { S: filename },
                'user': { S: imageObject.user },
                'category': { S: category }

            }
        };
        console.log(databaseParams);
        await dynamodb.putItem(databaseParams).promise();

        response.body = JSON.stringify({ filename, category });

    } catch (err) {
        // status 200 causes error to be sent back
        console.log("error");
        console.log(err);
        response.body = JSON.stringify(err);
    }
    console.log('response: ' + JSON.stringify(response))
    return response;
};
