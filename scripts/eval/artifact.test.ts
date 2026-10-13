import { describe, expect, it } from 'bun:test';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { writeArtifact } from './artifact';

describe('eval artifacts on a fresh runner', () => {
  it('creates missing nested output directories and preserves diagnostic JSON', async () => {
    const dir = await mkdtemp(join(tmpdir(), 'folio-artifact-'));
    try {
      const path = join(dir, 'artifacts', 'nested', 'eval-full.json');
      const payload = { preflight: { ok: false }, experiment: null, exitCode: 2, message: '数据源未配置' };
      await writeArtifact(path, payload);
      expect(JSON.parse(await readFile(path, 'utf8'))).toEqual(payload);
      await writeArtifact(path, { exitCode: 0 });
      expect(JSON.parse(await readFile(path, 'utf8'))).toEqual({ exitCode: 0 });
    } finally {
      await rm(dir, { recursive: true, force: true });
    }
  });

  it('does nothing when an artifact was not requested', async () => {
    await expect(writeArtifact(undefined, {})).resolves.toBeUndefined();
  });
});
