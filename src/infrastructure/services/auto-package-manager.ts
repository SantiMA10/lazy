import { readFile } from 'fs/promises';
import { addDependency, detectPackageManager } from 'nypm';
import path from 'path';

import { PackageInfo } from '../../domain/package-info/package-info.js';
import { PackageManager } from '../../domain/package-info/services/package-manager.js';

export class AutoPackageManager implements PackageManager {
	async detectPackageManager(): Promise<string> {
		const packageManager = await detectPackageManager(process.cwd());

		if (!packageManager?.name) {
			throw new Error('Unable to detect package manager');
		}

		return packageManager.name;
	}

	async install(
		packageInfo: PackageInfo,
		options: { withPeerDependencies: boolean },
	): Promise<void> {
		const dependencies = [packageInfo.name];
		if (options.withPeerDependencies) {
			const lastVersion = packageInfo['dist-tags']['latest'];
			if (!lastVersion) {
				throw new Error('Last version unavailable');
			}
			const peerDependenciesMap = packageInfo?.['versions']?.[lastVersion]?.['peerDependencies'];
			if (!peerDependenciesMap) {
				throw new Error(`Cannot find peerDependencies for ${packageInfo.name}`);
			}
			const peerDependencies = Object.keys(peerDependenciesMap).map((peerDependency) => {
				return `${peerDependency}@${peerDependenciesMap[peerDependency]}`;
			});

			dependencies.push(...peerDependencies);
		}
		await addDependency(dependencies, { silent: true });
	}

	async isInstalled(packageName: string): Promise<boolean> {
		const packageJson = JSON.parse(
			await readFile(path.join(process.cwd(), 'package.json'), 'utf-8'),
		);
		return !!packageJson.dependencies[packageName];
	}
}
