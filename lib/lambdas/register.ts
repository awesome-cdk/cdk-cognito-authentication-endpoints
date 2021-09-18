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

    const creationResult = await new CognitoIdentityServiceProvider()
        .adminCreateUser({
            UserPoolId: process.env.USER_POOL_ID as string,
            Username: body.username,
        })
        .promise();

    const username = creationResult.User?.Username;

    return {
        statusCode: 200,
        body: JSON.stringify({
            success: true,
        }),
    }
}
