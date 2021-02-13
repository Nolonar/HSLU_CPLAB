const aws = require('aws-sdk');
const s3 = new aws.S3({ apiVersion: '2006-03-01' });

exports.handler = async (event) => {
    // console.log('request: ' + JSON.stringify(event))
    const response = {
        statusCode: 500,
        body: '',
    }
    try {
        const payload = Buffer.from(event.body, 'base64').toString();

        console.log('request: ' + payload.substr(40, 100));

        const randName = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5);
        console.log(randName)

        const bucketParams = {
            Bucket: 'classification-image-gallery',
            Key: randName,
            Body: payload,
            ContentType: "image"
        };

        await s3.putObject(bucketParams).promise();

    } catch (err) {
        response.body = 'err: ' + JSON.stringify(err);
    }
    console.log('response: ' + JSON.stringify(response))
    return response;
};