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
    const auth = await cognitoIdentityServiceProvider
        .adminInitiateAuth({
            UserPoolId,
            AuthFlow: "ADMIN_USER_PASSWORD_AUTH",
            AuthParameters: {
                USERNAME: body.username,
                PASSWORD: body.password,
            },
            ClientId,
        })
        .promise();

    if (!auth.AuthenticationResult) {
        return {
            statusCode: 400,
            body: JSON.stringify({
                error: "Failed to authenticate user",
            })
        }
    }

    return {
        statusCode: 200,
        body: JSON.stringify({
            idToken: auth.AuthenticationResult?.IdToken,
            accessToken: auth.AuthenticationResult?.AccessToken,
            refreshToken: auth.AuthenticationResult?.RefreshToken,
            expiresAt: Math.round((new Date().getTime() / 1000) + auth.AuthenticationResult!.ExpiresIn!),
        }),
    }
}
