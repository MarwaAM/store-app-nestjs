import { CognitoJwtVerifier } from 'aws-jwt-verify';
import { CognitoIdTokenPayload } from 'aws-jwt-verify/jwt-model';
import { Request } from 'express';

import { ROLES } from './roles';

export async function validateRequest(request: Request, roles: string[]): Promise<boolean> {
	if (!request.headers?.authorization) {
		return false;
	}

	const role = roles[0];
	const token = request.headers.authorization.split(' ')[1];

	try {
		const tokenPayload = await verifyToken(token);
		return verifyUser(request, tokenPayload, role);
	} catch {
		return false;
	}
}

export async function validateGqlRequest(
	request: Request,
	args: Record<string, Record<string, string>>,
	roles: string[],
): Promise<boolean> {
	const authorization = request.rawHeaders.indexOf('Authorization');
	const token = request.rawHeaders[authorization + 1].split(' ')[1];
	if (authorization === -1 || !token) {
		return false;
	}
	const role = roles[0];

	try {
		const tokenPayload = await verifyToken(token);
		const username = tokenPayload['cognito:username'];
		const email = tokenPayload.email as string;

		// TODO find a better way to do this!
		const inputUser =
			args['createUserInput']?.username ||
			args['updateUserInput']?.username ||
			args['username'];
		const inputEmail =
			args['createUserInput']?.email || args['updateUserInput']?.email || args['email'];

		return validateRoles(
			inputUser as string,
			inputEmail as string,
			inputUser as string,
			username,
			email,
			role,
		);
	} catch {
		return false;
	}
}

async function verifyToken(token: string) {
	const verifier = CognitoJwtVerifier.create({
		userPoolId: process.env.COGNITO_USER_POOL_ID,
		tokenUse: 'id',
		clientId: process.env.COGNITO_CLIENT_ID,
	});

	try {
		const payload = await verifier.verify(token);

		if (payload && payload.email_verified) {
			return payload;
		}
	} catch (e) {
		throw new Error(e);
	}
}

function verifyUser(request: Request, token: CognitoIdTokenPayload, role: string) {
	const inputUser = request.body.username || '';
	const inputEmail = request.body.email || '';
	const paramUser = request.params.username || '';
	const username = token['cognito:username'];
	const email = token.email as string;

	return validateRoles(inputUser, inputEmail, paramUser, username, email, role);
}

function validateRoles(
	inputUser: string,
	inputEmail: string,
	paramUser: string,
	username: string,
	email: string,
	role: ROLES,
) {
	let rolesValidator = false;

	switch (role) {
		case ROLES.CAN_CREATE:
			rolesValidator = inputUser === username && inputEmail === email;
			break;
		case ROLES.CAN_UPDATE:
			rolesValidator = inputUser === username && paramUser ? paramUser === username : true;
			break;
		case ROLES.CAN_READ:
			rolesValidator = paramUser === username;
			break;
		case ROLES.ADMIN:
			rolesValidator = false;
			break;
		default:
			rolesValidator = false;
			break;
	}

	return rolesValidator;
}
