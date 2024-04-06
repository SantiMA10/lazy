export interface TypeScriptConfiguration {
	addTypes(...types: string[]): Promise<void>;
}
