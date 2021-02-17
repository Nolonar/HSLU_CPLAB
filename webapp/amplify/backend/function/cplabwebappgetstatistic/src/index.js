const aws = require('aws-sdk');
const dynamodb = new aws.DynamoDB({ apiVersion: '2012-08-10' });

exports.handler = async (event) => {
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

        const scanParams = {
            TableName: tableName
        };
        console.log(scanParams);
        const result = await dynamodb.scan(scanParams).promise();
        let correctOverall = 0;
        let wrongOverall = 0;
        let correctUser = 0;
        let wrongUser = 0;

        const currentUser = event.queryStringParameters == undefined ? "" : event.queryStringParameters.username;
        console.log("currentUser: " + currentUser);

        for (const item of result.Items) {
            if (item.correctness != undefined && item.user != undefined) {
                item.correctness.BOOL ? correctUser++ : wrongUser++;
                if (currentUser === item.user.S) {
                    item.correctness.BOOL ? correctOverall++ : wrongOverall++;
                }
            } else {
                console.log("missig values..." + JSON.stringify(item));
            }

        }
        console.log("correctOverall: " + correctOverall);
        console.log("correctUser: " + correctUser);
        console.log("wrongOverall: " + wrongOverall);
        console.log("wrongUser: " + wrongUser);

        response.body = JSON.stringify({ correctOverall, correctUser, wrongOverall, wrongUser, currentUser });

    } catch (err) {
        // status 200 causes error to be sent back
        console.log("error");
        console.log(err);
        response.body = JSON.stringify(err);
    }
    console.log('response: ' + JSON.stringify(response))
    return response;
};
