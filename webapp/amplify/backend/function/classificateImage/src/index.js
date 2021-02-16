const aws = require('aws-sdk');
const s3 = new aws.S3({ apiVersion: '2006-03-01', region: 'us-east-1' });

function unwrapImage(formData) {
    const lines = formData.split(/\r?\n/);
    for (let i = 0; i < lines.length; i++) {
        console.log("line" + i + ": " + lines[i]);
    }

    const fileName = Date.now().toString(36) + "_" + lines[7];
    const body = lines[3];
    const typeMatch = body.match(/data:(.*?);/gi);
    const contentType = (0 < typeMatch.length) ? typeMatch[0].slice(5, -1) : "text/plain";

    return { fileName, contentType, body }
}

exports.handler = async(event) => {
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

        const decoded = Buffer.from(imageObject.body.split(',')[1], 'base64');

        const bucketParams = {
            Bucket: 'classification-image-gallery',
            Key: imageObject.fileName,
            Body: decoded,
            ContentType: imageObject.contentType
        };
        console.log('bucketParams: ' + JSON.stringify(bucketParams));
        await s3.putObject(bucketParams).promise();
        response.statusCode = 200;
        response.body = "success";

    } catch (err) {
        response.body = 'err: ' + JSON.stringify(err);
    }
    console.log('response: ' + JSON.stringify(response))
    return response;
};