import color from 'picocolors';

import { PackageManager } from '../domain/package-info/services/package-manager.js';
import { SpinnerService } from '../domain/service/spinner-service.js';

export class ConfigureLinterAndFormatter {
	constructor(private spinner: SpinnerService, private packageManager: PackageManager) {}

	public async run() {
		this.spinner.start({
			message: `📝 Creating ${color.underline('eslint & prettier')} configuration files`,
		});

		await this.addPrettierConfiguration();
		await this.addEslintConfiguration();
		await this.addLintScript();

		this.spinner.end({
			message: `📝 ${color.underline('eslint & prettier')} configuration files created`,
		});
	}

	private async addLintScript() {
		await this.packageManager.addScript({
			name: 'lint',
			script: 'eslint . --ignore-path .gitignore',
		});
	}

	private async addEslintConfiguration() {
		const isNextJsInstalled = await this.packageManager.isInstalled('next');
		if (isNextJsInstalled) {
			await this.packageManager.addConfigurationFile({
				fileName: '.eslintrc',
				value: {
					extends: ['@santima10/eslint-config/nextjs'],
					env: {
						node: true,
					},
				},
			});

			return;
		}

		await this.packageManager.addConfigurationFile({
			fileName: '.eslintrc',
			value: {
				extends: ['@santima10/eslint-config'],
				env: {
					node: true,
				},
			},
		});
	}

	private async addPrettierConfiguration() {
		await this.packageManager.addConfiguration({
			name: 'prettier',
			value: '@santima10/eslint-config/.prettierrc.json',
		});
	}
}
