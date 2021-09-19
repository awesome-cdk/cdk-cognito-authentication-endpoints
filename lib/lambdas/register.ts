import {APIGatewayProxyHandler} from "aws-lambda";
import {CognitoIdentityServiceProvider} from "aws-sdk";

export const handler: APIGatewayProxyHandler = async (event) => {
    const body: {
        username: string,
        password: string,
    } = JSON.parse(event.body || '{}');

    if (!body.username || !body.password) {
        return {
            statusCode: 400,
            body: JSON.stringify({
                error: "Username or password not provided",
            })
        }
    }

    const UserPoolId = process.env.USER_POOL_ID as string;
    const cognitoIdentityServiceProvider = new CognitoIdentityServiceProvider();

    // Create the user in the UserPool
    const creationResult = await cognitoIdentityServiceProvider
        .adminCreateUser({
            UserPoolId,
            Username: body.username,
            MessageAction: "SUPPRESS",
            TemporaryPassword: body.password,
        })
        .promise();

    // Force the password without asking the user to change it on first login
    await cognitoIdentityServiceProvider
        .adminSetUserPassword({
            Username: body.username,
            Password: body.password,
            UserPoolId,
            Permanent: true,
        })
        .promise();

    return {
        statusCode: 200,
        body: JSON.stringify({
            success: true,
        }),
    }
}
