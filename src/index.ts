#!/usr/bin/env tsx

import { cancel, confirm, intro, isCancel, note, outro } from '@clack/prompts';
import color from 'picocolors';

import { AutoPackageManager } from './infrastructure/services/auto-package-manager.js';
import { NpmRegistryRepository } from './infrastructure/services/npm-registry-repository.js';
import { CliSpinnerService } from './infrastructure/services/spinner-service.js';
import { ConfigureLinterAndFormatter } from './tasks/configure-linter-and-formatter.js';
import { InstallLinterAndFormatter } from './tasks/install-linter-and-formatter.js';

intro(`🦥 Welcome to ${color.underline(`@santima10/lazy`)}`);

const packageManager = new AutoPackageManager();
const packageManagerName = await packageManager.detectPackageManager();
const spinnerService = new CliSpinnerService();

note(`package manager detected, using: ${color.underline(packageManagerName)}`);

const askInstallLinterAndFormatter = async () => {
	const shouldInstallLinterAndFormatter = await confirm({
		message: `🎨 Do you want install ${color.underline(`@santima10/eslint-config`)}?`,
	});

	if (isCancel(shouldInstallLinterAndFormatter)) {
		cancel('👋 See you soon!');
		process.exit(0);
	}

	if (shouldInstallLinterAndFormatter) {
		const installLinterAndFormatter = new InstallLinterAndFormatter(
			spinnerService,
			packageManager,
			new NpmRegistryRepository(),
		);

		await installLinterAndFormatter.run();
	}
};

const askConfigureLinterAndFormatter = async () => {
	const shouldConfigureLinterAndFormatter = await confirm({
		message: `🛠️ Do you want configure ${color.underline(`@santima10/eslint-config`)}?`,
	});

	if (isCancel(shouldConfigureLinterAndFormatter)) {
		cancel('👋 See you soon!');
		process.exit(0);
	}

	if (shouldConfigureLinterAndFormatter) {
		const configureLinterAndFormatter = new ConfigureLinterAndFormatter(
			spinnerService,
			packageManager,
		);

		await configureLinterAndFormatter.run();
	}
};

await askInstallLinterAndFormatter();
await askConfigureLinterAndFormatter();

outro(color.bgMagenta('🎉 Happy hacking!'));
