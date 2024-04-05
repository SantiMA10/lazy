import { PackageInfo } from '../../src/domain/package-info/package-info.js';

export class PackageInfoBuilder {
	private peerDependencies: Record<string, string> = {};

	public addPeerDependency(options: { name: string; version: string }) {
		this.peerDependencies[options.name] = options.version;

		return this;
	}

	public build(): PackageInfo {
		return {
			'name': '@santima10/test',
			'dist-tags': { latest: '1.0.0' },
			'versions': {
				'1.0.0': { peerDependencies: this.peerDependencies },
			},
		};
	}
}
