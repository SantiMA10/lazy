import color from 'picocolors';

import { PackageManager } from '../../../src/domain/package-info/services/package-manager.js';
import { SpinnerService } from '../../../src/domain/service/spinner-service.js';
import { InstallDetectUnusedFiles } from '../../../src/tasks/install-detect-unused-files.js';

describe('InstallDetectUnusedFiles', () => {
	let subject: InstallDetectUnusedFiles;
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

		subject = new InstallDetectUnusedFiles(spinner, packageManager);
	});

	it('starts the spinner', async () => {
		await subject.run();

		expect(spinner.start).toHaveBeenCalledWith({
			message: `📦 Installing ${color.underline(`knip`)}`,
		});
	});

	it('installs the knip and related dependencies', async () => {
		await subject.run();

		expect(packageManager.installDev).toHaveBeenCalledWith(['knip', 'typescript', '@types/node']);
	});

	it('ends the spinner', async () => {
		await subject.run();

		expect(spinner.end).toHaveBeenCalledWith({
			message: `📦 ${color.underline(`knip`)} installed`,
		});
	});
});
