import * as cdk from '@aws-cdk/core';
import {RestApi} from "@aws-cdk/aws-apigateway";
import {UserPool} from "@aws-cdk/aws-cognito";
import {CognitoAuthEndpoints} from "@awesome-cdk/cdk-cognito-authentication-endpoints";

export class TestStack extends cdk.Stack {
    constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        const apiGateway = new RestApi(this, 'RestApi');

        const userPool = new UserPool(this, 'UserPool');

        const authResource = apiGateway.root.addResource('auth');

        new CognitoAuthEndpoints(this, 'CognitoAuthEndpoints', {
            rootResource: authResource,
            userPool,
        });
    }
}
