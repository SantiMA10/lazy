import color from 'picocolors';

import { PackageManager } from '../../../src/domain/package-info/services/package-manager.js';
import { SpinnerService } from '../../../src/domain/service/spinner-service.js';
import { ConfigureDetectUnusedFiles } from '../../../src/tasks/configure-detect-unused-files.js';

describe('ConfigureDetectUnusedFiles', () => {
	let subject: ConfigureDetectUnusedFiles;
	let packageManager: PackageManager;
	let spinner: SpinnerService;

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
			start: vi.fn(),
			end: vi.fn(),
		};

		subject = new ConfigureDetectUnusedFiles(spinner, packageManager);
	});

	it('starts the spinner', async () => {
		await subject.run();

		expect(spinner.start).toHaveBeenCalledWith({
			message: `📝 Creating ${color.underline('knip.json')} configuration file`,
		});
	});

	it('adds the configuration file', async () => {
		await subject.run();

		expect(packageManager.addConfigurationFile).toHaveBeenCalledWith({
			fileName: 'knip.json',
			value: {
				$schema: 'https://unpkg.com/knip@5/schema.json',
				entry: ['src/index.ts'],
				project: ['src/**/*.ts'],
			},
		});
	});

	it('adds script', async () => {
		await subject.run();

		expect(packageManager.addScript).toHaveBeenCalledWith({
			name: 'check:unused',
			script: 'knip',
		});
	});

	it('ends the spinner', async () => {
		await subject.run();

		expect(spinner.end).toHaveBeenCalledWith({
			message: `📝 ${color.underline('knip.json')} configuration file created`,
		});
	});
});
