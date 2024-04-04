import { PackageInfo } from "../../domain/package-info/package-info.js";
import { RegistryRepository } from "../../domain/package-info/services/registry-repository.js";

export class NpmRegistryRepository implements RegistryRepository {
  async findBy({ name }: { name: string }): Promise<PackageInfo> {
    const response = await fetch(
      `https://registry.npmjs.org/${name.replace("/", "%2F")}`
    );
    return (await response.json()) as PackageInfo;
  }
}
