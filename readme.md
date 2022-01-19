# Alarm Manager
A quick proof of concept for a lambda function which raises alarms as tickets in Jira using the Atlassian API instead of emails.

## TODO
- [x] Create basic Lambda function using docker image
- [x] Create CloudFormation template to deploy to AWS
- [x] Create Postman collection for Atlassian API endpoints
- [x] Create Jira user and grant token
- [x] Test creating Jira tickets from Lambda
- [x] Add TypeScript
- [x] Create a ticket builder
- [x] Create ticket based on a mock CloudWatch event

## Atlassian API
Atlassian recommends using basic auth for personal scripts, bots, and ad-hoc execution of the REST APIs.

To authenticate with the API using basic auth:
1. Generate an API token for Jira using your Atlassian Account.
2. Build a string of the form useremail:api_token.
3. BASE64 encode the string
    ```sh
    echo -n user@example.com:api_token_string | base64
    ```
4. Supply an Authorization header with content Basic followed by the encoded string.
    ```sh
    curl -D- \
    -X GET \
    -H "Authorization: Basic ZnJlZDpmcmVk" \
    -H "Content-Type: application/json" \
    "https://your-domain.atlassian.net/rest/api/2/issue/QA-31"
    ```

See documentation for [ad-hoc-api-calls](https://developer.atlassian.com/cloud/jira/platform/rest/v3/intro/#ad-hoc-api-calls) for more information.

## Atlassian Document Format
The Atlassian Document Format (ADF) represents rich text stored in Atlassian products. For example, in Jira Cloud platform, the text in issue comments and in textarea custom fields is stored as ADF.

An Atlassian Document Format document is a JSON object:

http://go.atlassian.com/adf-json-schema.

There is a javascript library for building ADF objects:

https://atlaskit.atlassian.com/packages/editor/adf-utils

## Run locally

1. Build the container image:
    ```sh
    docker build -t poc-alarms-manager .
    ```

2. Run container:
    ```sh
    docker run \
    -p 9000:8080 \
    -e JIRA_URL=https://team-123456.atlassian.net/rest/api/3 \
    -e JIRA_TOKEN=<JIRA_TOKEN> \
    poc-alarms-manager 
    ```

3. Test function:
    ```sh
    curl -XPOST "http://localhost:9000/2015-03-31/functions/function/invocations" \
    -d '{
        "message": "Error on people-service",
        "date": "2021-12-02",
        "service": "lender-dashboard",
        "level": "error"
    }'
    ```

## Run in AWS
1. Log into ECR:
    ```sh
    aws ecr get-login-password \
    --region eu-west-2 | docker login \
    --username AWS \
    --password-stdin <ACCOUNT_ID>.dkr.ecr.eu-west-2.amazonaws.com
    ```

2. Tag the container image:
    ```sh
    docker tag poc-alarms-manager:latest <ACCOUNT_ID>.dkr.ecr.eu-west-2.amazonaws.com/poc-alarms-manager:latest
    ```

3. Push the iamge to ECR:
    ```sh
    docker push <ACCOUNT_ID>.dkr.ecr.eu-west-2.amazonaws.com/poc-alarms-manager:latest
    ```

4. Deploy the CloudFormation stack:
    ```sh
    aws cloudformation deploy \
    --template-file lambda.yml \
    --stack-name AlarmsManagerStack \
    --capabilities CAPABILITY_NAMED_IAM \
    --parameter-overrides JiraURL=https://team-123456.atlassian.net/rest/api/3 JiraToken=<JIRA_TOKEN>
    ```

5. Test the Lamda function via the AWS console.