import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import { decompressSaveGame, recompressSaveGame } from '../src/features/save-editor/core/gvasDecompressor';
import { validateRepackedSaveGame } from '../src/features/save-editor/core/saveValidator';

test.describe('Save Engine Binary Round-Trip Suite', () => {
  test('should decompress, re-chunk, and validate Coral Island save binary in memory', async () => {
    const savePath = path.join(process.env.LOCALAPPDATA || '', 'ProjectCoral', 'Saved', 'SaveGames', 'World_5', 'EndOfDayAutoSave.sav');
    if (!fs.existsSync(savePath)) {
      test.skip();
      return;
    }

    const originalBytes = fs.readFileSync(savePath);
    expect(originalBytes.length).toBeGreaterThan(100000);

    const { outerPrefixBytes, outerTrailingBytes, decompressedBytes } = decompressSaveGame(originalBytes);
    expect(decompressedBytes.length).toBeGreaterThan(1000000);

    const repackedBytes = recompressSaveGame(outerPrefixBytes, decompressedBytes, outerTrailingBytes);
    expect(repackedBytes.length).toBeGreaterThan(100000);

    const report = validateRepackedSaveGame(repackedBytes);
    expect(report.valid).toBe(true);
    expect(report.uncompressedSize).toBe(decompressedBytes.length);
  });
});
