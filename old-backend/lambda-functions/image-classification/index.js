const aws = require('aws-sdk');
const s3 = new aws.S3({ apiVersion: '2006-03-01' });

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
        body: '',
    }
    try {
        const imageObject = unwrapImage(event.body);

        const bucketParams = {
            Bucket: 'classification-image-gallery',
            Key: imageObject.fileName,
            Body: imageObject.body,
            ContentType: imageObject.contentType
        };
        console.log('bucketParams: ' + JSON.stringify(bucketParams));
        await s3.putObject(bucketParams).promise();

    } catch (err) {
        response.body = 'err: ' + JSON.stringify(err);
    }
    console.log('response: ' + JSON.stringify(response))
    return response;
};