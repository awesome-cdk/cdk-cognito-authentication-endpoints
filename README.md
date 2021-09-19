# CDK Cognito Authentication Endpoints for API Gateway

AWS CDK construct for creating API Gateway endpoints for registration and login, powered by AWS Cognito.

### Usage

```typescript
new CognitoAuthEndpoints(this, 'CognitoAuthEndpoints', {
    rootResource: restApi.root,
    userPool,
});
```

The final result will be, the following API endpoints will be created at the root of your API Gateway:

`POST /register`

```json
{
  "username": "john",
  "password": "StrongPassword!1!"
}
```

`POST /login`

```json
{
  "username": "john",
  "password": "StrongPassword!1!"
}
```
