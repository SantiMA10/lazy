import { PackageInfo } from '../package-info.js';

export interface PackageManager {
	detectPackageManager(): Promise<string>;
	installDev(
		packageInfo: PackageInfo | string[],
		options?: { withPeerDependencies: boolean },
	): Promise<void>;
	isInstalled(packageName: string): Promise<boolean>;
	addScript(options: { name: string; script: string }): Promise<void>;
	addConfiguration(options: { name: string; value: string }): Promise<void>;
	addConfigurationFile(options: {
		fileName: string;
		value: Record<string, unknown>;
	}): Promise<void>;
}
