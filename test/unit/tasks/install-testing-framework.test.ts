import color from 'picocolors';

import { PackageManager } from '../../../src/domain/package-info/services/package-manager.js';
import { SpinnerService } from '../../../src/domain/service/spinner-service.js';
import { InstallTestingFramework } from '../../../src/tasks/install-testing-framework.js';

describe('InstallTestingFramework', () => {
	let subject: InstallTestingFramework;
	let spinner: SpinnerService;
	let packageManager: PackageManager;

	beforeEach(() => {
		packageManager = {
			detectPackageManager: vi.fn(),
			installDev: vi.fn(),
			isInstalled: vi.fn(),
			addConfiguration: vi.fn(),
			addConfigurationFile: vi.fn(),
			addScript: vi.fn(),
		};
		spinner = {
			end: vi.fn(),
			start: vi.fn(),
		};

		subject = new InstallTestingFramework(spinner, packageManager);
	});

	it('starts the spinner', async () => {
		await subject.run();

		expect(spinner.start).toHaveBeenCalledWith({
			message: `📦 Installing ${color.underline(`vitest`)}`,
		});
	});

	it('installs the vitest', async () => {
		await subject.run();

		expect(packageManager.installDev).toHaveBeenCalledWith(['vitest']);
	});

	it('ends the spinner', async () => {
		await subject.run();

		expect(spinner.end).toHaveBeenCalledWith({
			message: `📦 ${color.underline(`vitest`)} installed`,
		});
	});
});
