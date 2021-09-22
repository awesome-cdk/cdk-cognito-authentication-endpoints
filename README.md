# CDK Cognito Authentication Endpoints for API Gateway

AWS CDK construct for creating API Gateway endpoints for registration and login, powered by AWS Cognito.

### Usage

```typescript
const apiGateway = new apiGateway.RestApi(this, 'RestApi');

const userPool = new cognito.UserPool(this, 'UserPool');

const authResource = apiGateway.root.addResource('auth');

new CognitoAuthEndpoints(this, 'CognitoAuthEndpoints', {
    rootResource: authResource,
    userPool,
});
```

The final result will be, the following API endpoints will be created at the root of your API Gateway:

```POST [apigatway_url]/auth/register```

```json
{
  "username": "john",
  "password": "StrongPassword!1!"
}
```

```POST [apigatway_url]/auth/login```

```json
{
  "username": "john",
  "password": "StrongPassword!1!"
}
```

### Why not work with Cognito directly?

* By having a standard layer of REST APIs before your authentication provider (Cognito) you get the added benefit of
  being able to enforce extra middleware or afterware logic. For example, you can throttle requests or implement
  advanced antispam protection (reCaptcha, etc). Also, having the auth endpoints as standard REST APIs (like APIs for
  any other feature within your app), makes them much easier to consume by end users, instead of forcing those users to
  deal with the complexity of Cognito.
* Provides slightly better security than exposing the UserPool for public access
* No vendor lock-in. You can replace the underlaying Cognito auth service with something else and keep the REST APIs and
  the rest of your app's codebase intact.

### Future plans:

* [ ] Support for email OR username as the user's primary identification method
* [ ] Forgot password. Can only work if the primary identification method is email
* [ ] Push to EventBridge default bus of the account, so the rest of your application can react asynchronously to
  Registration or Login events (e.g. write newly registered users to a DynamoDB table or send them a Welcome email or
  keep track of login count)
