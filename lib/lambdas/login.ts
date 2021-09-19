import {APIGatewayProxyHandler} from "aws-lambda";
import {CognitoIdentityServiceProvider} from "aws-sdk";

export const handler: APIGatewayProxyHandler = async (event) => {
    const body: {
        username: string,
        password: string,
    } = JSON.parse(event.body || "{}");

    if (!body.username || !body.password) {
        return {
            statusCode: 400,
            body: JSON.stringify({
                error: 'Invalid username or password',
            })
        }
    }

    const UserPoolId = process.env.USER_POOL_ID as string;
    const ClientId = process.env.USER_POOL_CLIENT_ID as string;
    const cognitoIdentityServiceProvider = new CognitoIdentityServiceProvider();

    // Create the user in the UserPool
    const creationResult = await cognitoIdentityServiceProvider
        .adminInitiateAuth({
            UserPoolId,
            AuthFlow: "ADMIN_USER_PASSWORD_AUTH",
            AuthParameters: {},
            ClientId: ""
        })
        .promise();

    return {
        statusCode: 200,
        body: JSON.stringify({
            success: true,
        }),
    }
}
