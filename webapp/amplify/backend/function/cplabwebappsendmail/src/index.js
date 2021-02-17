const aws = require('aws-sdk');
const sns = new aws.SNS();
const dynamodb = new aws.DynamoDB({ apiVersion: '2012-08-10' });

exports.handler = async (event) => {
    let tableName = "images";
    console.log('request: ' + JSON.stringify(event));
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

        for (const item of result.Items) {
            if (item.correctness != undefined && item.user != undefined) {
                item.correctness.BOOL ? correctOverall++ : wrongOverall++;
            } else {
                console.log("missig values..." + JSON.stringify(item));
            }
        }
        console.log("correctOverall: " + correctOverall);
        console.log("wrongOverall: " + wrongOverall);

        const mailParams = {
            Message:
                `Dear user

Thanks for using our image classification service.

The summary of our classification are:
correctOverall: ${correctOverall} ✔
wrongOverall: ${wrongOverall} ❌
`,
            Subject: "Daily Statistics",
            TopicArn: "arn:aws:sns:us-east-1:222502850352:StatisticMailTopic"
        };
        console.log(mailParams);
        const sns_result = await sns.publish(mailParams).promise();
        console.log(sns_result);

    } catch (err) {
        // status 200 causes error to be sent back
        console.log("error");
        console.log(err);
    }
};
