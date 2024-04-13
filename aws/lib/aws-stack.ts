import * as cdk from 'aws-cdk-lib';
import {
	AccountRecovery,
	OAuthScope,
	UserPool,
	UserPoolClientIdentityProvider,
	UserPoolEmail,
} from 'aws-cdk-lib/aws-cognito';
import { CfnRole, OpenIdConnectProvider } from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';

export class AwsStack extends cdk.Stack {
	constructor(scope: Construct, id: string, props?: cdk.StackProps) {
		super(scope, id, props);

		// TODO add pre-sign up trigger lambda to validate
		// user input (esp birthdate!)
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

		// TODO delete the domain after you create front end
		// we will handle sign up and sign in from frontend client
		// AWS SDK signin command
		const domain = userPool.addDomain('userpool-domain', {
			cognitoDomain: {
				domainPrefix: 'store-app-signup-v1',
			},
		});

		domain.signInUrl(client, {
			redirectUri: 'http://localhost',
		});

		const iamIdp = new OpenIdConnectProvider(this, 'githubIdentityProvider', {
			url: 'https://token.actions.githubusercontent.com',
			clientIds: ['sts.amazonaws.com'],
		});

		new CfnRole(this, 'githubIdpRole', {
			assumeRolePolicyDocument: getTrustPolicyDoc(iamIdp.openIdConnectProviderArn),
			roleName: 'githubIdpRole',
			policies: [
				{
					policyName: 'cdkAssumePolicy',
					policyDocument: getCdkAssumePolicy(),
				},
				{
					policyName: 'githubCdkDeployPolicy',
					policyDocument: getGithubCdkDeployPolicy(),
				},
			],
		});
	}
}

function getTrustPolicyDoc(openIdArn: string) {
	return {
		Version: '2012-10-17',
		Statement: [
			{
				Effect: 'Allow',
				Principal: {
					Federated: openIdArn,
				},
				Action: 'sts:AssumeRoleWithWebIdentity',
				Condition: {
					StringEquals: {
						'token.actions.githubusercontent.com:aud': 'sts.amazonaws.com',
					},
					StringLike: {
						'token.actions.githubusercontent.com:sub':
							'repo:MarwaAM/store-app-nestjs:*',
					},
				},
			},
		],
	};
}

function getCdkAssumePolicy() {
	return {
		Version: '2012-10-17',
		Statement: [
			{
				Sid: 'assumerole',
				Effect: 'Allow',
				Action: ['sts:AssumeRole', 'iam:PassRole'],
				Resource: [
					'arn:aws:iam::755477715813:role/cdk-hnb659fds-deploy-role-755477715813-us-east-1',
					'arn:aws:iam::755477715813:role/cdk-hnb659fds-file-publishing-role-755477715813-us-east-1',
					'arn:aws:iam::755477715813:role/cdk-hnb659fds-lookup-role-755477715813-us-east-1',
					'arn:aws:iam::755477715813:role/cdk-hnb659fds-cfn-exec-role-755477715813-us-east-1',
				],
			},
		],
	};
}

function getGithubCdkDeployPolicy() {
	return {
		Version: '2012-10-17',
		Statement: [
			{
				Action: [
					'cloudformation:CreateChangeSet',
					'cloudformation:DeleteChangeSet',
					'cloudformation:DescribeChangeSet',
					'cloudformation:DescribeStacks',
					'cloudformation:ExecuteChangeSet',
					'cloudformation:CreateStack',
					'cloudformation:UpdateStack',
					'cloudformation:DescribeStackEvents',
					'cloudformation:GetTemplate',
					'cloudformation:DeleteStack',
					'cloudformation:UpdateTerminationProtection',
					'sts:GetCallerIdentity',
					'cloudformation:GetTemplateSummary',
				],
				Resource: '*',
				Effect: 'Allow',
				Sid: 'CloudFormationPermissions',
			},
		],
	};
}
