import { spinner } from '@clack/prompts';

import { SpinnerService } from '../../domain/service/spinner-service.js';

export class CliSpinnerService implements SpinnerService {
	constructor(private cliSpinner = spinner()) {}

	start(options: { message: string }): void {
		this.cliSpinner.start(options.message);
	}

	end(options: { message: string }): void {
		this.cliSpinner.stop(options.message);
	}
}
