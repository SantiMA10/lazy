export interface PackageInfo {
  name: string;
  "dist-tags": { latest: string };
  versions: Record<string, { peerDependencies: Record<string, string> }>;
}
