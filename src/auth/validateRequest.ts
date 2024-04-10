import { CognitoJwtVerifier } from 'aws-jwt-verify';
import { Request } from 'express';

export async function validateRequest(request: Request): Promise<boolean> {
  if (!request.headers?.authorization) {
    return false;
  }
  const token = request.headers.authorization.split(' ')[1];
  return verifyToken(token);
}

export async function validateGqlRequest(
  rawHeaders: string[],
): Promise<boolean> {
  const authorization = rawHeaders.indexOf('Authorization');
  const token = rawHeaders[authorization + 1].split(' ')[1];
  if (authorization === -1 || !token) {
    return false;
  }

  return verifyToken(token);
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
      return true;
    }
  } catch {}

  return false;
}
