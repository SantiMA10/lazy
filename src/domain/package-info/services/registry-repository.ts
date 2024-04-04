import { PackageInfo } from "../package-info.js";

export interface RegistryRepository {
  findBy(options: { name: string }): Promise<PackageInfo>;
}
