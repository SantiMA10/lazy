#!/usr/bin/env tsx

import {
  cancel,
  confirm,
  intro,
  isCancel,
  note,
  outro,
  spinner,
} from "@clack/prompts";
import { writeFile } from "fs/promises";
import path from "path";
import color from "picocolors";

import { AutoPackageManager } from "./infrastructure/services/auto-package-manager.js";
import { NpmRegistryRepository } from "./infrastructure/services/npm-registry-repository.js";

intro(`🦥 Welcome to ${color.underline(`@santima10/lazy`)}`);

const manager = new AutoPackageManager();
const packageManagerName = await manager.detectPackageManager();

note(`package manager detected, using: ${color.underline(packageManagerName)}`);

const configureEsLint = async () => {
  const shouldInstall = await confirm({
    message: `🎨 Do you want install ${color.underline(
      `@santima10/eslint-config`
    )}?`,
  });

  if (isCancel(shouldInstall)) {
    cancel("👋 See you soon!");
    process.exit(0);
  }

  if (shouldInstall) {
    const isNextJsInstalled = await manager.isInstalled("next");

    const s = spinner();
    try {
      s.start(
        `📦 Installing ${color.underline(
          `@santima10/eslint-config`
        )} using ${color.underline(packageManagerName)}`
      );

      const npm = new NpmRegistryRepository();
      const packageInfo = await npm.findBy({
        name: "@santima10/eslint-config",
      });

      if (!isNextJsInstalled) {
        const lastVersion = packageInfo["dist-tags"]["latest"];
        delete packageInfo?.["versions"]?.[lastVersion]?.["peerDependencies"][
          "@next/eslint-plugin-next"
        ];
      }

      await manager.install(packageInfo, { withPeerDependencies: true });

      s.stop(
        `📦 Installed ${color.underline(
          `@santima10/eslint-config`
        )} using ${color.underline(packageManagerName)}`
      );
    } catch (error) {
      s.stop(color.red(`❌ ${error}`));
    }

    s.start(
      `📝 Creating ${color.underline("eslint & prettier")} configuration files`
    );
    let eslintPath = "@santima10/eslint-config";
    if (isNextJsInstalled) {
      eslintPath = "@santima10/eslint-config/nextjs";
    }

    const eslintrc = {
      extends: [eslintPath],
      env: {
        node: true,
      },
    };
    await writeFile(
      path.join(process.cwd(), ".eslintrc"),
      JSON.stringify(eslintrc, null, 2)
    );
    let { default: packageJson } = await import(
      path.join(process.cwd(), "package.json"),
      { assert: { type: "json" } }
    );
    if (!packageJson["prettier"]) {
      const newPackageJson = {
        ...packageJson,
        prettier: "@santima10/eslint-config/.prettierrc.json",
      };
      await writeFile(
        path.join(process.cwd(), "package.json"),
        JSON.stringify(newPackageJson, null, 2)
      );
    }
    ({ default: packageJson } = await import(
      path.join(process.cwd(), "package.json"),
      { assert: { type: "json" } }
    ));
    if (!packageJson["scripts"]["lint"]) {
      const newPackageJson = {
        ...packageJson,
        scripts: {
          ...packageJson["scripts"],
          lint: "eslint . --ignore-path .gitignore",
        },
      };
      await writeFile(
        path.join(process.cwd(), "package.json"),
        JSON.stringify(newPackageJson, null, 2)
      );
    }
    s.stop(
      `📝 ${color.underline("eslint & prettier")} configuration files created`
    );
  }
};

await configureEsLint();

outro(color.bgMagenta("🎉 Happy hacking!"));
