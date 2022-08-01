import { CozzyError } from '.';

export class TeamNotFound extends CozzyError {
	constructor(message: string) {
		super(message);
		this.name = 'TeamNotFound';
	}
}
