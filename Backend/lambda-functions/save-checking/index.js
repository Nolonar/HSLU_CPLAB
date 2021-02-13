const aws = require('aws-sdk');
const db = new aws.DynamoDB({ apiVersion: '2012-08-10' });

exports.handler = async (event) => {
    // console.log('request: ' + JSON.stringify(event))
    const response = {
        statusCode: 500,
        body: '',
    }

    try {
        const payload = Buffer.from(event.body, 'base64').toString();
        console.log('payload: ' + payload);
        const body = JSON.parse(payload);
        const dbParams = {
            TableName: 'checking',
            Item: {
                'ImageId': { S: body.ImageId },
                'Correctness': { BOOL: 'true' === body.Correctness }
            }
        };

        await db.putItem(dbParams, function (err, data) {
            if (err) {
                response.body = 'err: ' + JSON.stringify(err);
            } else {
                response.statusCode = 200;
                response.body = 'data: ' + JSON.stringify(data);
            }
        }).promise();
    } catch (err) {
        response.body = 'err: ' + JSON.stringify(err);
    }
    console.log('response: ' + JSON.stringify(response))
    return response;
};