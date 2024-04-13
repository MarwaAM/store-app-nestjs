import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Observable } from 'rxjs';

import { Roles } from './roles.decorator';
import { validateGqlRequest, validateRequest } from './validateRequest';

@Injectable()
export class AuthGuard implements CanActivate {
	constructor(private reflector: Reflector) {}

	canActivate(
		context: ExecutionContext | GqlExecutionContext,
	): boolean | Promise<boolean> | Observable<boolean> {
		const roles = this.reflector.get(Roles, context.getHandler());

		if (context.getType() !== 'http') {
			const ctx = GqlExecutionContext.create(context);
			return validateGqlRequest(ctx.getContext().req, ctx.getArgs(), roles);
		} else {
			const request = context.switchToHttp().getRequest();
			return validateRequest(request, roles);
		}
	}
}
