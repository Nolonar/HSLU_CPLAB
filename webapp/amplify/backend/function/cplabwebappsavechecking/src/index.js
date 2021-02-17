const aws = require('aws-sdk');
const dynamodb = new aws.DynamoDB({ apiVersion: '2012-08-10' });

function unwrapParameter(formData) {
    const lines = formData.split(/\r?\n/);
    for (let i = 0; i < lines.length; i++) {
        console.log("Line" + i + ":" + lines[i]);
    }
    return { image: lines[3], user: lines[7], correctness: lines[11] }
}

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
        let tableName = "images";
        if (process.env.ENV && process.env.ENV !== "NONE") {
            tableName = tableName + '-' + process.env.ENV;
        }

        const parameterObject = unwrapParameter(event.body);
        console.log(parameterObject);
        const databaseParams = {
            TableName: tableName,
            Key: {
                "image": { S: parameterObject.image }
            },
            UpdateExpression: "SET correctness = :c",
            ExpressionAttributeValues: {
                ":c": { BOOL: "true" === parameterObject.correctness }
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
