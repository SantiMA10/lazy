import color from 'picocolors';

import { PackageManager } from '../domain/package-info/services/package-manager.js';
import { SpinnerService } from '../domain/service/spinner-service.js';
import { TypeScriptConfiguration } from '../domain/service/typescript-configuration.js';

export class ConfigureTestingFramework {
	constructor(
		private spinner: SpinnerService,
		private packageManager: PackageManager,
		private typeScriptConfiguration: TypeScriptConfiguration,
	) {}

	public async run() {
		this.spinner.start({
			message: `📝 Creating ${color.underline('vite.config.ts')} configuration file`,
		});

		await this.packageManager.addScript({
			name: 'test',
			script: 'vitest',
		});

		await this.packageManager.addScript({
			name: 'test:watch',
			script: 'vitest --watch',
		});

		await this.typeScriptConfiguration.addTypes('vitest/globals');

		await this.packageManager.addConfigurationFile({
			fileName: 'vite.config.ts',
			value: `/// <reference types="vitest" />

// Configure Vitest (https://vitest.dev/config/)

import { defineConfig } from 'vitest/config';

export default defineConfig({
	test: {
		globals: true,
	},
});`,
		});

		this.spinner.end({
			message: `📝 ${color.underline('vite.config.ts')} configuration file created`,
		});
	}
}
