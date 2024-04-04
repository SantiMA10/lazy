import { PackageInfo } from '../package-info.js';

export interface PackageManager {
	detectPackageManager(): Promise<string>;
	install(packageInfo: PackageInfo, options: { withPeerDependencies: boolean }): Promise<void>;
	isInstalled(packageName: string): Promise<boolean>;
}
