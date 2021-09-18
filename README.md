# CDK Cognito Authentication Endpoints for API Gateway

AWS CDK construct for creating API Gateway endpoints for registration and login, powered by AWS Cognito.

### Usage

```typescript
new CognitoAuthEndpoints(this, 'CognitoAuthEndpoints', {
    rootResource: api.root,
    userPool,
});
```
