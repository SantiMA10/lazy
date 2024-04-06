import color from 'picocolors';

import { PackageManager } from '../domain/package-info/services/package-manager.js';
import { SpinnerService } from '../domain/service/spinner-service.js';

export class InstallDetectUnusedFiles {
	constructor(private spinner: SpinnerService, private packageManager: PackageManager) {}

	public async run() {
		this.spinner.start({
			message: `📦 Installing ${color.underline(`knip`)}`,
		});

		await this.packageManager.installDev(['knip', 'typescript', '@types/node']);

		this.spinner.end({
			message: `📦 ${color.underline(`knip`)} installed`,
		});
	}
}
