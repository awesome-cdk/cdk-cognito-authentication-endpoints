import {APIGatewayProxyHandler} from "aws-lambda";
import {CognitoIdentityServiceProvider} from "aws-sdk";

async function userExists(cognitoIdentityServiceProvider: CognitoIdentityServiceProvider, UserPoolId: string, username: string): Promise<boolean> {
    try {
        const existingUser = await cognitoIdentityServiceProvider.adminGetUser({
            UserPoolId,
            Username: username,
        }).promise();
        return !!existingUser.UserCreateDate;
    } catch (e: any) {
        if ((<any>e).code === 'UserNotFoundException') {
            return false;
        }
        throw e;
    }
}

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

    const exists = await userExists(cognitoIdentityServiceProvider, UserPoolId, body.username);

    if (exists) {
        return {
            statusCode: 400,
            body: JSON.stringify({
                error: "This username already exists",
            }),
        };
    }

    // Create the user in the UserPool
    await cognitoIdentityServiceProvider
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
