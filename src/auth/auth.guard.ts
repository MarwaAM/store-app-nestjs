import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { validateRequest, validateGqlRequest } from './validateRequest';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext | GqlExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    if (context.getType() !== 'http') {
      const ctx = GqlExecutionContext.create(context).getContext();
      return validateGqlRequest(ctx.req.rawHeaders);
    } else {
      const request = context.switchToHttp().getRequest();
      return validateRequest(request);
    }
  }
}
