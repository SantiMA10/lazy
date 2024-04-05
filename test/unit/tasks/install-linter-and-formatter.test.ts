import color from 'picocolors';

import { PackageManager } from '../../../src/domain/package-info/services/package-manager.js';
import { RegistryRepository } from '../../../src/domain/package-info/services/registry-repository.js';
import { SpinnerService } from '../../../src/domain/service/spinner-service.js';
import { InstallLinterAndFormatter } from '../../../src/tasks/install-linter-and-formatter.js';
import { PackageInfoBuilder } from '../../builders/package-info-builder.js';

describe('InstallLinterAndFormatter', () => {
	let subject: InstallLinterAndFormatter;
	let spinner: SpinnerService;
	let packageManager: PackageManager;
	let registryRepository: RegistryRepository;

	beforeEach(() => {
		packageManager = {
			detectPackageManager: vi.fn(),
			install: vi.fn(),
			isInstalled: vi.fn(),
			addConfiguration: vi.fn(),
			addConfigurationFile: vi.fn(),
			addScript: vi.fn(),
		};
		spinner = {
			end: vi.fn(),
			start: vi.fn(),
		};
		registryRepository = {
			findBy: vi.fn(),
		};

		subject = new InstallLinterAndFormatter(spinner, packageManager, registryRepository);
	});

	it('starts the spinner to let the user know that the dependencies are being installed', async () => {
		vi.spyOn(packageManager, 'detectPackageManager').mockResolvedValue('sma');
		vi.spyOn(registryRepository, 'findBy').mockResolvedValue(new PackageInfoBuilder().build());

		await subject.run();

		expect(spinner.start).toHaveBeenCalledWith({
			message: `📦 Installing ${color.underline(
				`@santima10/eslint-config`,
			)} using ${color.underline('sma')}`,
		});
	});

	it('install all the dependencies if next is detected in the project', async () => {
		vi.spyOn(packageManager, 'detectPackageManager').mockResolvedValue('sma');
		vi.spyOn(packageManager, 'isInstalled').mockResolvedValue(true);
		const eslintConfigPackage = new PackageInfoBuilder().build();
		vi.spyOn(registryRepository, 'findBy').mockResolvedValue(eslintConfigPackage);

		await subject.run();

		expect(packageManager.install).toHaveBeenCalledWith(eslintConfigPackage, {
			withPeerDependencies: true,
		});
	});

	it('does not install the next related dependencies if next is not detected', async () => {
		vi.spyOn(packageManager, 'detectPackageManager').mockResolvedValue('sma');
		vi.spyOn(packageManager, 'isInstalled').mockResolvedValue(false);
		const eslintConfigPackage = new PackageInfoBuilder()
			.addPeerDependency({ name: '@next/eslint-plugin-next', version: '1.0.0' })
			.addPeerDependency({ name: 'eslint-plugin-jest', version: '1.0.0' })
			.build();
		vi.spyOn(registryRepository, 'findBy').mockResolvedValue(eslintConfigPackage);

		await subject.run();

		const eslintConfigPackageWithoutNext = new PackageInfoBuilder()
			.addPeerDependency({ name: 'eslint-plugin-jest', version: '1.0.0' })
			.build();
		expect(packageManager.install).toHaveBeenCalledWith(eslintConfigPackageWithoutNext, {
			withPeerDependencies: true,
		});
	});

	it('ends spinner when the dependencies has been installed', async () => {
		vi.spyOn(packageManager, 'detectPackageManager').mockResolvedValue('sma');
		vi.spyOn(packageManager, 'isInstalled').mockResolvedValue(false);
		const eslintConfigPackage = new PackageInfoBuilder().build();
		vi.spyOn(registryRepository, 'findBy').mockResolvedValue(eslintConfigPackage);
		vi.spyOn(packageManager, 'install').mockResolvedValue();

		await subject.run();

		expect(spinner.end).toHaveBeenCalledWith({
			message: `📦 Installed ${color.underline(`@santima10/eslint-config`)} using ${color.underline(
				'sma',
			)}`,
		});
	});

	it('ends spinner when something fail in the installation', async () => {
		vi.spyOn(packageManager, 'detectPackageManager').mockResolvedValue('sma');
		vi.spyOn(packageManager, 'isInstalled').mockResolvedValue(false);
		const eslintConfigPackage = new PackageInfoBuilder().build();
		vi.spyOn(registryRepository, 'findBy').mockResolvedValue(eslintConfigPackage);
		vi.spyOn(packageManager, 'install').mockRejectedValue(new Error('Boom!'));

		await subject.run();

		expect(spinner.end).toHaveBeenCalledWith({
			message: `❌ Error: Boom!`,
		});
	});
});
