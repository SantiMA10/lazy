#!/usr/bin/env tsx

import { cancel, confirm, intro, isCancel, note, outro } from '@clack/prompts';
import color from 'picocolors';

import { AutoPackageManager } from './infrastructure/services/auto-package-manager.js';
import { NpmRegistryRepository } from './infrastructure/services/npm-registry-repository.js';
import { CliSpinnerService } from './infrastructure/services/spinner-service.js';
import { ConfigureDetectUnusedFiles } from './tasks/configure-detect-unused-files.js';
import { ConfigureLinterAndFormatter } from './tasks/configure-linter-and-formatter.js';
import { InstallDetectUnusedFiles } from './tasks/install-detect-unused-files.js';
import { InstallLinterAndFormatter } from './tasks/install-linter-and-formatter.js';
import { InstallTestingFramework } from './tasks/install-testing-framework.js';

intro(`🦥 Welcome to ${color.underline(`@santima10/lazy`)}`);

const packageManager = new AutoPackageManager();
const packageManagerName = await packageManager.detectPackageManager();
const spinnerService = new CliSpinnerService();

note(`package manager detected, using: ${color.underline(packageManagerName)}`);

const askInstallLinterAndFormatter = async () => {
	const shouldInstallLinterAndFormatter = await confirm({
		message: `🎨 Do you want to install ${color.underline(`@santima10/eslint-config`)}?`,
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
		message: `🛠️ Do you want to configure ${color.underline(`@santima10/eslint-config`)}?`,
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

const askConfigureDetectUnusedFiles = async () => {
	const shouldConfigureDetectUnusedFiles = await confirm({
		message: `🛠️ Do you want to configure ${color.underline(`knip`)} to detect unused files?`,
	});

	if (isCancel(shouldConfigureDetectUnusedFiles)) {
		cancel('👋 See you soon!');
		process.exit(0);
	}

	if (shouldConfigureDetectUnusedFiles) {
		const configureDetectUnusedFiles = new ConfigureDetectUnusedFiles(
			spinnerService,
			packageManager,
		);

		await configureDetectUnusedFiles.run();
	}
};

const askInstallDetectUnusedFiles = async () => {
	const shouldInstallDetectUnusedFiles = await confirm({
		message: `🎨 Do you want to install ${color.underline(`knip`)} to detect unused files?`,
	});

	if (isCancel(shouldInstallDetectUnusedFiles)) {
		cancel('👋 See you soon!');
		process.exit(0);
	}

	if (shouldInstallDetectUnusedFiles) {
		const installDetectUnusedFiles = new InstallDetectUnusedFiles(spinnerService, packageManager);

		await installDetectUnusedFiles.run();
	}
};

const askInstallTestingFramework = async () => {
	const shouldInstallTestingFramework = await confirm({
		message: `🎨 Do you want to install ${color.underline(`vitest`)} as testing framework?`,
	});

	if (isCancel(shouldInstallTestingFramework)) {
		cancel('👋 See you soon!');
		process.exit(0);
	}

	if (shouldInstallTestingFramework) {
		const installTestingFramework = new InstallTestingFramework(spinnerService, packageManager);

		await installTestingFramework.run();
	}
};

await askInstallLinterAndFormatter();
await askConfigureLinterAndFormatter();
await askInstallDetectUnusedFiles();
await askConfigureDetectUnusedFiles();
await askInstallTestingFramework();

outro(color.bgMagenta('🎉 Happy hacking!'));
