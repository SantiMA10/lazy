import color from 'picocolors';

import { PackageManager } from '../../../src/domain/package-info/services/package-manager.js';
import { SpinnerService } from '../../../src/domain/service/spinner-service.js';
import { TypeScriptConfiguration } from '../../../src/domain/service/typescript-configuration.js';
import { ConfigureTestingFramework } from '../../../src/tasks/configure-testing-framework.js';

describe('ConfigureTestingFramework', () => {
	let subject: ConfigureTestingFramework;
	let packageManager: PackageManager;
	let spinner: SpinnerService;
	let typeScriptConfiguration: TypeScriptConfiguration;

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
		typeScriptConfiguration = {
			addTypes: vi.fn(),
		};

		subject = new ConfigureTestingFramework(spinner, packageManager, typeScriptConfiguration);
	});

	it('starts the spinner', async () => {
		await subject.run();

		expect(spinner.start).toHaveBeenCalledWith({
			message: `📝 Creating ${color.underline('vite.config.ts')} configuration file`,
		});
	});

	it('adds the configuration file', async () => {
		await subject.run();

		expect(packageManager.addConfigurationFile).toHaveBeenCalledWith({
			fileName: 'vite.config.ts',
			value: `/// <reference types="vitest" />

// Configure Vitest (https://vitest.dev/config/)

import { defineConfig } from 'vitest/config';

export default defineConfig({
	test: {
		globals: true,
	},
});`,
		});
	});

	it('adds the vitest types to TypeScript configuration', async () => {
		await subject.run();

		expect(typeScriptConfiguration.addTypes).toHaveBeenCalledWith('vitest/globals');
	});

	it('adds "test" script', async () => {
		await subject.run();

		expect(packageManager.addScript).toHaveBeenCalledWith({
			name: 'test',
			script: 'vitest',
		});
	});

	it('adds "test:watch" script', async () => {
		await subject.run();

		expect(packageManager.addScript).toHaveBeenCalledWith({
			name: 'test:watch',
			script: 'vitest --watch',
		});
	});

	it('ends the spinner', async () => {
		await subject.run();

		expect(spinner.end).toHaveBeenCalledWith({
			message: `📝 ${color.underline('vite.config.ts')} configuration file created`,
		});
	});
});
