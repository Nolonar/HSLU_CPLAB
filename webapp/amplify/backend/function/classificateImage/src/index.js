

exports.handler = async (event) => {
    // TODO implement
    console.log('Event: ' + JSON.stringify(event));
    const response = {
        statusCode: 200,
        //  Uncomment below to enable CORS requests
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "*"
        },
        body: 'Event: ' + JSON.stringify(event)
    };
    return response;
};
