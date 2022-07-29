import { CozzyError } from '.';

export class UserNotFoundError extends CozzyError {
	constructor(message: string) {
		super(message);
		this.name = 'UserNotFoundError';
	}
}
