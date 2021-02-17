const aws = require('aws-sdk');
const s3 = new aws.S3({ apiVersion: '2006-03-01', region: 'us-east-1' });
const rekognition = new aws.Rekognition();
const bucketName = 'classification-image-gallery';

function unwrapImage(formData) {
    const lines = formData.split(/\r?\n/);
    const parts = lines[3].split(',');
    const typeMatch = parts[0].match(/data:(.*?);/gi);
    const contentType = (0 < typeMatch.length) ? typeMatch[0].slice(5, -1) : "text/plain";
    const fileName = Date.now().toString(36) + "_" + lines[7] + "." + contentType.split("/")[1];
    const decoded_data = Buffer.from(parts[1], 'base64');

    return { fileName, contentType, decoded_data }
}

exports.handler = async (event) => {
    // console.log('request: ' + JSON.stringify(event))
    const response = {
        statusCode: 500,
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "*"
        },
        body: '',
    }
    try {
        const imageObject = unwrapImage(event.body);
        const filename = imageObject.fileName;

        const savingParams = {
            Bucket: bucketName,
            Key: filename,
            Body: imageObject.decoded_data,
            ContentType: imageObject.contentType
        };
        console.log('bucketParams: ' + JSON.stringify(savingParams));
        await s3.putObject(savingParams).promise();

        const classificationParams = {
            Image: {
                S3Object: {
                    Bucket: bucketName,
                    Name: filename
                }
            },
            MaxLabels: 1,
            MinConfidence: 50
        };
        const result = await rekognition.detectLabels(classificationParams).promise();
        const category = (0 < result.Labels.length) ? result.Labels[0].Name : "undefined";

        response.statusCode = 200;
        response.body = { filename, category };

    } catch (err) {
        response.body = { err };
    }
    console.log('response: ' + JSON.stringify(response))
    return response;
};
