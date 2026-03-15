import type { backendInterface } from "./backend";
import { mockBackend } from "./mocks/backend";
import { HttpAgent } from "@icp-sdk/core/agent";
import { StorageClient } from "./lib/StorageClient";

// Stub class for blob handling
class BlobHandler {
  private data: Uint8Array;
  
  constructor(data: Uint8Array) {
    this.data = data;
  }
  
  async getBytes(): Promise<Uint8Array> {
    return this.data;
  }
  
  onProgress?: (progress: number) => void;
  
  static async fromURL(_url: string): Promise<BlobHandler> {
    return new BlobHandler(new Uint8Array());
  }
}

type ExternalBlob = BlobHandler;

const DEFAULT_BUCKET_NAME = "default-bucket";
const DEFAULT_PROJECT_ID = "0000000-0000-0000-0000-00000000000";
const DEFAULT_STORAGE_GATEWAY_URL = "https://blob.caffeine.ai";

interface JsonConfig {
  backend_host: string;
  backend_canister_id: string;
  project_id: string;
  ii_derivation_origin: string;
}

interface Config {
  backend_host?: string;
  backend_canister_id: string;
  storage_gateway_url: string;
  bucket_name: string;
  project_id: string;
  ii_derivation_origin?: string;
}

let configCache: Config | null = null;

export async function loadConfig(): Promise<Config> {
  if (configCache) {
    return configCache;
  }
  const backendCanisterId = process.env.CANISTER_ID_BACKEND;
  const envBaseUrl = process.env.BASE_URL || "/";
  const baseUrl = envBaseUrl.endsWith("/") ? envBaseUrl.slice(0, -1) : envBaseUrl;
  try {
    const response = await fetch(`${baseUrl}/env.json`);
    const config = (await response.json()) as JsonConfig;
    if (!backendCanisterId && config.backend_canister_id === "undefined") {
      // Silenced in production to avoid console noise
    }

    const fullConfig = {
      backend_host:
        config.backend_host === "undefined" ? undefined : config.backend_host,
      backend_canister_id: (config.backend_canister_id === "undefined"
        ? backendCanisterId || "rdmx6-jaaaa-aaaab-qaabq-cai"
        : config.backend_canister_id) as string,
      storage_gateway_url: process.env.STORAGE_GATEWAY_URL ?? DEFAULT_STORAGE_GATEWAY_URL,
      bucket_name: DEFAULT_BUCKET_NAME,
      project_id:
        config.project_id !== "undefined"
          ? config.project_id
          : DEFAULT_PROJECT_ID,
      ii_derivation_origin:
        config.ii_derivation_origin === "undefined"
          ? undefined
          : config.ii_derivation_origin,
    };
    configCache = fullConfig;
    return fullConfig;
  } catch {
    if (!backendCanisterId) {
      // Silenced in production to avoid console noise
    }
    const fallbackConfig = {
      backend_host: "https://cybin-enterprises.com/",
      backend_canister_id: backendCanisterId || "rdmx6-jaaaa-aaaab-qaabq-cai",
      storage_gateway_url: DEFAULT_STORAGE_GATEWAY_URL,
      bucket_name: DEFAULT_BUCKET_NAME,
      project_id: "cybin-enterprises",
      ii_derivation_origin: "https://cybin-enterprises.com/",
    };
    return fallbackConfig;
  }
}

export async function createActorWithConfig(
  _options?: unknown,
): Promise<backendInterface> {
  const config = await loadConfig();
  
  // Return mock for now - real implementation needs proper ICP SDK setup
  return mockBackend;
}