import { CozzyError } from '.';

export class UserAlreadyInTeamError extends CozzyError {
	constructor(message: string) {
		super(message);
		this.name = 'UserAlreadyInTeamError';
	}
}
