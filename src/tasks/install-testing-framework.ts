import color from 'picocolors';

import { PackageManager } from '../domain/package-info/services/package-manager.js';
import { SpinnerService } from '../domain/service/spinner-service.js';

export class InstallTestingFramework {
	constructor(private spinner: SpinnerService, private packageManager: PackageManager) {}

	public async run() {
		this.spinner.start({
			message: `📦 Installing ${color.underline(`vitest`)}`,
		});

		await this.packageManager.installDev(['vitest']);

		this.spinner.end({
			message: `📦 ${color.underline(`vitest`)} installed`,
		});
	}
}
