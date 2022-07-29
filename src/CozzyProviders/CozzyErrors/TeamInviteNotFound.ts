import { CozzyError } from '.';

export class TeamInviteNotFound extends CozzyError {
	constructor(message: string) {
		super(message);
		this.name = 'TeamInviteNotFound';
	}
}
