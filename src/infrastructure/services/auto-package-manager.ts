import { readFile, writeFile } from 'fs/promises';
import { addDevDependency, detectPackageManager } from 'nypm';
import path from 'path';

import { PackageInfo } from '../../domain/package-info/package-info.js';
import { PackageManager } from '../../domain/package-info/services/package-manager.js';

export class AutoPackageManager implements PackageManager {
	public async addScript(options: { name: string; script: string }): Promise<void> {
		const packageJson = JSON.parse(
			await readFile(path.join(process.cwd(), 'package.json'), { encoding: 'utf8' }),
		);

		const newPackageJson = {
			...packageJson,
			scripts: {
				...packageJson.scripts,
				[options.name]: options.script,
			},
		};

		await writeFile(
			path.join(process.cwd(), 'package.json'),
			JSON.stringify(newPackageJson, null, 2),
		);
	}

	public async addConfiguration(options: { name: string; value: string }): Promise<void> {
		const packageJson = JSON.parse(
			await readFile(path.join(process.cwd(), 'package.json'), { encoding: 'utf8' }),
		);

		const newPackageJson = {
			...packageJson,
			[options.name]: options.value,
		};

		await writeFile(
			path.join(process.cwd(), 'package.json'),
			JSON.stringify(newPackageJson, null, 2),
		);
	}

	public async addConfigurationFile(options: {
		fileName: string;
		value: Record<string, unknown>;
	}): Promise<void> {
		await writeFile(
			path.join(process.cwd(), options.fileName),
			JSON.stringify(options.value, null, 2),
		);
	}

	async detectPackageManager(): Promise<string> {
		const packageManager = await detectPackageManager(process.cwd());

		if (!packageManager?.name) {
			throw new Error('Unable to detect package manager');
		}

		return packageManager.name;
	}

	async installDev(
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
		await addDevDependency(dependencies, { silent: true });
	}

	async isInstalled(packageName: string): Promise<boolean> {
		const packageJson = JSON.parse(
			await readFile(path.join(process.cwd(), 'package.json'), 'utf-8'),
		);
		return !!packageJson.dependencies[packageName];
	}
}
