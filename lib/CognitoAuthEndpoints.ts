import {Construct} from "@aws-cdk/core";
import {IResource, LambdaIntegration} from "@aws-cdk/aws-apigateway";
import {NodejsFunction} from "@aws-cdk/aws-lambda-nodejs";
import * as path from "path";
import {IUserPool} from "@aws-cdk/aws-cognito";
import {Code, Function, Runtime} from "@aws-cdk/aws-lambda";

export class CognitoAuthEndpoints extends Construct {

    constructor(scope: Construct, id: string, private props: {
        rootResource: IResource,
        userPool: IUserPool,
    }) {
        super(scope, id);

        this.createLoginEndpoint();
        this.createRegisterEndpoint()
    }

    private createLoginEndpoint() {
        const lambda = new Function(this, 'fn-login', {
            code: Code.fromAsset(path.resolve(__dirname, './lambdas')),
            runtime: Runtime.NODEJS_14_X,
            handler: "login.handler",
        });
        lambda.addEnvironment('USER_POOL_ID', this.props.userPool.userPoolId);
        this.props.rootResource
            .addResource('login')
            .addMethod('POST', new LambdaIntegration(lambda))
    }

    private createRegisterEndpoint() {
        const lambda = new Function(this, 'fn-register', {
            code: Code.fromAsset(path.resolve(__dirname, './lambdas')),
            runtime: Runtime.NODEJS_14_X,
            handler: "register.handler",
        });
        lambda.addEnvironment('USER_POOL_ID', this.props.userPool.userPoolId);
        this.props.rootResource
            .addResource('register')
            .addMethod('POST', new LambdaIntegration(lambda));
    }
}
