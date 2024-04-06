import { CommentArray, CommentObject, parse, stringify } from 'comment-json';
import { readFile, writeFile } from 'fs/promises';
import path from 'path';

import { TypeScriptConfiguration } from '../../domain/service/typescript-configuration.js';

export class LocalTypeScriptConfiguration implements TypeScriptConfiguration {
	async addTypes(...types: string[]): Promise<void> {
		const tsconfigPath = path.join(process.cwd(), 'tsconfig.json');
		const tsconfig = parse(
			await readFile(tsconfigPath, { encoding: 'utf8' }),
			undefined,
			false,
		) as CommentObject;

		if (!tsconfig) {
			return;
		}

		((tsconfig?.compilerOptions as CommentObject)?.types as CommentArray<string>).push(...types);

		await writeFile(tsconfigPath, stringify(tsconfig, null, 2));
	}
}
