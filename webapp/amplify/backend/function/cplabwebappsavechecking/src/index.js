const aws = require('aws-sdk');
const dynamodb = new aws.DynamoDB({ apiVersion: '2012-08-10' });
let tableName = "images";

exports.handler = async (event) => {
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

        const databaseParams = {
            TableName: tableName,
            Key: {
                'image': { S: body.ImageId }
            },
            UpdateExpression: "set correctness = :c",
            ExpressionAttributeValues: {
                ":c": 'true' === body.Correctness
            },
        };
        console.log(databaseParams);
        const result = await dynamodb.updateItem(databaseParams).promise();
        console.log(result);
        response.body = JSON.stringify({ result: "success" });

    } catch (err) {
        // status 200 causes error to be sent back
        console.log("error");
        console.log(err);
        response.body = JSON.stringify(err);
    }
    console.log('response: ' + JSON.stringify(response))
    return response;
};
