import * as cdk from 'aws-cdk-lib';
import {
	AccountRecovery,
	OAuthScope,
	UserPool,
	UserPoolClientIdentityProvider,
	UserPoolEmail,
} from 'aws-cdk-lib/aws-cognito';
import { Construct } from 'constructs';

export class AwsStack extends cdk.Stack {
	constructor(scope: Construct, id: string, props?: cdk.StackProps) {
		super(scope, id, props);

		const userPool = new UserPool(this, 'store-app-nestjs', {
			userPoolName: 'store-app-nestjs-v1',
			selfSignUpEnabled: true,
			signInAliases: {
				username: true,
				email: true,
			},
			autoVerify: {
				email: true,
			},
			standardAttributes: {
				birthdate: {
					required: true,
				},
				email: {
					required: true,
				},
				gender: {
					required: true,
				},
				fullname: {},
			},
			email: UserPoolEmail.withCognito(),
			signInCaseSensitive: false,
			accountRecovery: AccountRecovery.EMAIL_ONLY,
			removalPolicy: cdk.RemovalPolicy.DESTROY,
		});

		const client = userPool.addClient('store-app-client', {
			userPoolClientName: 'store-app-client',
			authFlows: {
				userPassword: true,
				adminUserPassword: true,
			},
			preventUserExistenceErrors: true,
			supportedIdentityProviders: [UserPoolClientIdentityProvider.COGNITO],
			oAuth: {
				flows: {
					authorizationCodeGrant: true,
					implicitCodeGrant: true,
				},
				callbackUrls: [
					'http://localhost',
					'http://localhost:3000',
					'http://localhost:4000',
					// to add more once frontend is created
				],
				scopes: [OAuthScope.OPENID, OAuthScope.EMAIL],
			},
		});
		const domain = userPool.addDomain('userpool-domain', {
			cognitoDomain: {
				domainPrefix: 'store-app-signup-v1',
			},
		});

		domain.signInUrl(client, {
			redirectUri: 'http://localhost',
		});
	}
}
