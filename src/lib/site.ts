export const SITE_URL = "https://baritonebot.github.io";
export const SITE_NAME = "Baritone";
export const GITHUB_URL = "https://github.com/cabaletta/baritone";
export const GITHUB_RELEASES_URL = "https://github.com/cabaletta/baritone/releases";

export type Build = {
  id: string;
  loader: string;
  mc_version: string;
  file_name: string;
  download_url: string;
  file_size_bytes: number | null;
  is_latest: boolean;
};

export function fabricDownloadUrl(mcVersion: string) {
  return `https://jointaxel.online/downloads/baritone-fabric-${mcVersion}`;
}

/** Baritone release tag that ships each Minecraft 1.21.x version. */
const MC_TO_BARITONE_RELEASE: Record<string, string> = {
  "1.21": "1.11.3",
  "1.21.1": "1.11.3",
  "1.21.2": "1.12.0",
  "1.21.3": "1.12.0",
  "1.21.4": "1.13.1",
  "1.21.5": "1.14.0",
  "1.21.6": "1.15.0",
  "1.21.7": "1.15.0",
  "1.21.8": "1.15.0",
  "1.21.9": "1.16.0",
  "1.21.10": "1.16.0",
  "1.21.11": "1.17.0",
};

/** Direct GitHub release asset URL for a loader jar. */
export function githubReleaseUrl(loader: "Fabric" | "Forge" | "NeoForge", mcVersion: string) {
  const tag = MC_TO_BARITONE_RELEASE[mcVersion];
  if (!tag) return GITHUB_RELEASES_URL;
  const slug = loader.toLowerCase();
  return `${GITHUB_URL}/releases/download/v${tag}/baritone-api-${slug}-${tag}.jar`;
}

/** Real file name of the GitHub release asset. */
export function githubReleaseFileName(loader: "Fabric" | "Forge" | "NeoForge", mcVersion: string) {
  const tag = MC_TO_BARITONE_RELEASE[mcVersion];
  return `baritone-api-${loader.toLowerCase()}-${tag ?? mcVersion}.jar`;
}

export function formatBytes(bytes: number | null) {
  if (!bytes) return "—";
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

/** Every supported Minecraft 1.21.x release, newest first. */
export const MC_VERSIONS = [
  "1.21.11",
  "1.21.10",
  "1.21.9",
  "1.21.8",
  "1.21.7",
  "1.21.6",
  "1.21.5",
  "1.21.4",
  "1.21.3",
  "1.21.2",
  "1.21.1",
  "1.21",
];

/** Sorts version strings like 1.21.10 above 1.21.2. */
export function compareVersionsDesc(a: string, b: string) {
  const pa = a.split(".").map(Number);
  const pb = b.split(".").map(Number);
  for (let i = 0; i < Math.max(pa.length, pb.length); i++) {
    const diff = (pb[i] ?? 0) - (pa[i] ?? 0);
    if (diff !== 0) return diff;
  }
  return 0;
}

/** Rendered during SSR and before the live build list loads. */
export const FALLBACK_BUILDS: Build[] = MC_VERSIONS.flatMap((v) => [
  {
    id: `fallback-fabric-${v}`,
    loader: "Fabric",
    mc_version: v,
    file_name: githubReleaseFileName("Fabric", v),
    download_url: fabricDownloadUrl(v),
    file_size_bytes: 4400000,
    is_latest: true,
  },
  {
    id: `fallback-forge-${v}`,
    loader: "Forge",
    mc_version: v,
    file_name: githubReleaseFileName("Forge", v),
    download_url: githubReleaseUrl("Forge", v),
    file_size_bytes: 4610000,
    is_latest: true,
  },
  {
    id: `fallback-neoforge-${v}`,
    loader: "NeoForge",
    mc_version: v,
    file_name: githubReleaseFileName("NeoForge", v),
    download_url: githubReleaseUrl("NeoForge", v),
    file_size_bytes: 4620000,
    is_latest: true,
  },
]);

