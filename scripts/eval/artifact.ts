import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';

/** Persist the requested evaluation result, including preflight failures. */
export async function writeArtifact(path: string | undefined, payload: unknown): Promise<void> {
  if (!path) return;
  await mkdir(dirname(resolve(path)), { recursive: true });
  await writeFile(path, JSON.stringify(payload, null, 2));
  console.log(`Artifact written to ${resolve(path)}`);
}
