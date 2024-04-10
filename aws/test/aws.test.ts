import { App, Stack } from 'aws-cdk-lib';
import { Match, Template } from 'aws-cdk-lib/assertions';

import { AwsStack } from '../lib/aws-stack';

let app: App;
let stack: Stack;
let template: Template;

beforeAll(() => {
	app = new App();
	stack = new AwsStack(app, 'MyTestStack');
	template = Template.fromStack(stack);
});

describe('Congito User Pool', () => {
	it('Should have a user pool with name store-app-nestjs-v1', () => {
		template.hasResourceProperties(
			'AWS::Cognito::UserPool',
			Match.objectLike({
				UserPoolName: 'store-app-nestjs-v1',
			}),
		);
	});
});
