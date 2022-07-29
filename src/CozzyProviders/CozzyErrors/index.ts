export class CozzyError {
	message: string;
	name: string;
	constructor(message: string) {
		this.message = message;
		this.name = 'Error';
	}
}
