import color from 'picocolors';

import { PackageManager } from '../domain/package-info/services/package-manager.js';
import { RegistryRepository } from '../domain/package-info/services/registry-repository.js';
import { SpinnerService } from '../domain/service/spinner-service.js';

const eslintConfigPackageName = '@santima10/eslint-config';

export class InstallLinterAndFormatter {
	constructor(
		private spinner: SpinnerService,
		private packageManager: PackageManager,
		private registryRepository: RegistryRepository,
	) {}

	async run() {
		try {
			const packageManagerName = await this.packageManager.detectPackageManager();

			this.spinner.start({
				message: `📦 Installing ${color.underline(eslintConfigPackageName)} using ${color.underline(
					packageManagerName,
				)}`,
			});

			const eslintConfig = await this.registryRepository.findBy({ name: eslintConfigPackageName });
			const isNextJsInstalled = await this.packageManager.isInstalled('next');

			if (!isNextJsInstalled) {
				const lastVersion = eslintConfig['dist-tags']['latest'];
				delete eslintConfig?.['versions']?.[lastVersion]?.['peerDependencies'][
					'@next/eslint-plugin-next'
				];
			}

			await this.packageManager.installDev(eslintConfig, { withPeerDependencies: true });

			this.spinner.end({
				message: `📦 Installed ${color.underline(eslintConfigPackageName)} using ${color.underline(
					packageManagerName,
				)}`,
			});
		} catch (error) {
			this.spinner.end({ message: `❌ ${error}` });
		}
	}
}
