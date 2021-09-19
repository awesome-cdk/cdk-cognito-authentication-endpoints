import {Construct} from "@aws-cdk/core";
import {IResource, LambdaIntegration} from "@aws-cdk/aws-apigateway";
import {NodejsFunction} from "@aws-cdk/aws-lambda-nodejs";
import * as path from "path";
import {IUserPool, UserPoolClient} from "@aws-cdk/aws-cognito";
import {Code, Function, Runtime} from "@aws-cdk/aws-lambda";
import {ManagedPolicy} from "@aws-cdk/aws-iam";

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
        lambda.role?.addManagedPolicy(
            ManagedPolicy.fromAwsManagedPolicyName("AmazonCognitoPowerUser")
        );
        lambda.addEnvironment('USER_POOL_ID', this.props.userPool.userPoolId);

        // Create a Cognito userpool client
        const userPoolClient = new UserPoolClient(this, 'UserPoolClient', {
            userPool: this.props.userPool,
            authFlows: {
                adminUserPassword: true,
            },
        });
        lambda.addEnvironment('USER_POOL_CLIENT_ID', userPoolClient.userPoolClientId);

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
        lambda.role?.addManagedPolicy(
            ManagedPolicy.fromAwsManagedPolicyName("AmazonCognitoPowerUser")
        );
        lambda.addEnvironment('USER_POOL_ID', this.props.userPool.userPoolId);
        this.props.rootResource
            .addResource('register')
            .addMethod('POST', new LambdaIntegration(lambda));
    }
}
