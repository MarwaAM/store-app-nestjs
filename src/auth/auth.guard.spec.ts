import { Reflector } from '@nestjs/core';

import { AuthGuard } from './auth.guard';

describe('AuthGuard', () => {
	const reflector = new Reflector();

	it('should be defined', () => {
		expect(new AuthGuard(reflector)).toBeDefined();
	});
});
