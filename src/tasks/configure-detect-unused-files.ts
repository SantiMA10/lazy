import color from 'picocolors';

import { PackageManager } from '../domain/package-info/services/package-manager.js';
import { SpinnerService } from '../domain/service/spinner-service.js';

export class ConfigureDetectUnusedFiles {
	constructor(private spinner: SpinnerService, private packageManager: PackageManager) {}

	public async run() {
		this.spinner.start({
			message: `📝 Creating ${color.underline('knip.json')} configuration file`,
		});

		await this.packageManager.addConfigurationFile({
			fileName: 'knip.json',
			value: {
				$schema: 'https://unpkg.com/knip@5/schema.json',
				entry: ['src/index.ts'],
				project: ['src/**/*.ts'],
			},
		});

		this.spinner.end({
			message: `📝 ${color.underline('knip.json')} configuration file created`,
		});
	}
}
