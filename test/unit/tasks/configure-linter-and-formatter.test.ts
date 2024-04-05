import color from 'picocolors';

import { PackageManager } from '../../../src/domain/package-info/services/package-manager.js';
import { SpinnerService } from '../../../src/domain/service/spinner-service.js';
import { ConfigureLinterAndFormatter } from '../../../src/tasks/configure-linter-and-formatter.js';

describe('ConfigureLinterAndFormatter', () => {
	let subject: ConfigureLinterAndFormatter;
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

		subject = new ConfigureLinterAndFormatter(spinner, packageManager);
	});

	it('starts the spinner to let the user know that configuration is being applied', async () => {
		await subject.run();

		expect(spinner.start).toHaveBeenCalledWith({
			message: `📝 Creating ${color.underline('eslint & prettier')} configuration files`,
		});
	});

	it('adds the prettier configuration', async () => {
		await subject.run();

		expect(packageManager.addConfiguration).toHaveBeenCalledWith({
			name: 'prettier',
			value: '@santima10/eslint-config/.prettierrc.json',
		});
	});

	it('adds the eslint configuration if nextjs is not installed', async () => {
		vi.spyOn(packageManager, 'isInstalled').mockResolvedValue(false);

		await subject.run();

		expect(packageManager.addConfigurationFile).toHaveBeenCalledWith({
			fileName: '.eslintrc',
			value: {
				extends: ['@santima10/eslint-config'],
				env: {
					node: true,
				},
			},
		});
	});

	it('adds the nextjs eslint configuration if nextjs is installed', async () => {
		vi.spyOn(packageManager, 'isInstalled').mockResolvedValue(true);

		await subject.run();

		expect(packageManager.addConfigurationFile).toHaveBeenCalledWith({
			fileName: '.eslintrc',
			value: {
				extends: ['@santima10/eslint-config/nextjs'],
				env: {
					node: true,
				},
			},
		});
	});

	it('adds the lint script', async () => {
		await subject.run();

		expect(packageManager.addScript).toHaveBeenCalledWith({
			name: 'lint',
			script: 'eslint . --ignore-path .gitignore',
		});
	});

	it('ends the spinner the configuration is completed', async () => {
		await subject.run();

		expect(spinner.end).toHaveBeenCalledWith({
			message: `📝 ${color.underline('eslint & prettier')} configuration files created`,
		});
	});
});
