#!/usr/bin/env tsx

import { intro, outro, spinner, note, confirm, cancel, isCancel } from '@clack/prompts';
import { addDependency, removeDependency, detectPackageManager } from "nypm";
import color from 'picocolors';

intro(color.underline(`@santima10/lazy`));

const packageManager = await detectPackageManager('.')

note(`package manager detected, using: ${packageManager?.name}`)

const shouldInstall = await confirm({
  message: 'Do you want install a dependency?',
});

if (isCancel(shouldInstall)) {
  const s = spinner();
  s.start(`Installing via ${packageManager?.name}`);
  await addDependency('@santima10/jest-chat-reporter', {silent: true})
  s.stop(`Installed via ${packageManager?.name}`);
}

const shouldUninstall = await confirm({
  message: 'Do you want uninstall a dependency?',
});

if (isCancel(shouldUninstall)) {
  const s = spinner();
  s.start(`Uninstalling via ${packageManager?.name}`);
  await removeDependency('@santima10/jest-chat-reporter', {silent: true})
  s.stop(`Uninstalled via ${packageManager?.name}`);
}

outro(`You're all set!`);