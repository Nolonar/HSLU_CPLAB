

# check installation
aws --version

# create API
aws apigateway create-rest-api --name checking
# returns q77kfpp935

# check success and get resource
aws apigateway get-resources --rest-api-id q77kfpp935
# returns qsjyib1ts1

# create model
# aws apigateway create-model --rest-api-id q77kfpp935 --name 'checking' --content-type 'application/json'  --schema '{"$schema": "http://json-schema.org/draft-04/schema#", "title": "checking", "type": "object","properties": {        "ImageId": {            "type": "string"}, "Correctness": {"type": "boolean" }}, "required": [ "ImageId", "Correctness"]}'

# create POST method
# aws apigateway put-method --rest-api-id q77kfpp935 --resource-id qsjyib1ts1 --http-method POST --authorization-type "NONE" --request-models '{"application/json":"checking"}'

# test checking-api (cmd)
curl -d {\"ImageId\":\"lena.jpg\",\"Correctness\":\"false\"} -X POST https://hb8iy6lthe.execute-api.us-east-1.amazonaws.com/

# test classification-api (cmd)
curl -F upload=@lena.jpg https://ii0up09929.execute-api.us-east-1.amazonaws.com/


