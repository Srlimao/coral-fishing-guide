import React, { createContext, useContext, useState, useMemo, useCallback } from 'react';
import { decompressSaveGame, recompressSaveGame } from '../core/gvasDecompressor';
import { validateRepackedSaveGame } from '../core/saveValidator';
import { applyStagedModelToBuffer } from '../core/savePatcher';
import { SaveEditorSubsystemTab, SaveEditorDiffItem } from '../types/saveEditor';
import { EditableSaveModel, extractEditableModel } from './saveEditorHelpers';

interface SaveEditorContextType {
  hasFile: boolean;
  fileName: string | null;
  activeModel: EditableSaveModel | null;
  originalModel: EditableSaveModel | null;
  diffs: SaveEditorDiffItem[];
  activeSubsystem: SaveEditorSubsystemTab;
  setActiveSubsystem: (tab: SaveEditorSubsystemTab) => void;
  loadFile: (file: File) => Promise<void>;
  updateModel: (updater: (prev: EditableSaveModel) => EditableSaveModel, diffMeta?: { subsystem: string; label: string; field: keyof EditableSaveModel }) => void;
  exportRepackedFile: () => Promise<{ buffer: Uint8Array; valid: boolean; error?: string }>;
  downloadModifiedSave: () => Promise<void>;
  downloadOriginalBackup: () => void;
  resetAllEdits: () => void;
  isProcessing: boolean;
  error: string | null;
}

const SaveEditorContext = createContext<SaveEditorContextType | undefined>(undefined);

export const SaveEditorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [fileName, setFileName] = useState<string | null>(null);
  const [originalRawBytes, setOriginalRawBytes] = useState<Uint8Array | null>(null);
  const [outerPrefixBytes, setOuterPrefixBytes] = useState<Uint8Array | null>(null);
  const [outerTrailingBytes, setOuterTrailingBytes] = useState<Uint8Array | null>(null);
  const [decompressedBytes, setDecompressedBytes] = useState<Uint8Array | null>(null);

  const [activeModel, setActiveModel] = useState<EditableSaveModel | null>(null);
  const [originalModel, setOriginalModel] = useState<EditableSaveModel | null>(null);
  const [activeSubsystem, setActiveSubsystem] = useState<SaveEditorSubsystemTab>('player');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadFile = useCallback(async (file: File) => {
    setIsProcessing(true);
    setError(null);
    try {
      const buffer = await file.arrayBuffer();
      const raw = new Uint8Array(buffer);
      const { outerPrefixBytes: prefix, outerTrailingBytes: trailing, decompressedBytes: decomp } = decompressSaveGame(raw);

      const model = extractEditableModel(decomp);

      setFileName(file.name);
      setOriginalRawBytes(raw);
      setOuterPrefixBytes(prefix);
      setOuterTrailingBytes(trailing);
      setDecompressedBytes(decomp);
      setActiveModel(model);
      setOriginalModel(JSON.parse(JSON.stringify(model)));
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to decompress and parse save file');
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const updateModel = useCallback((
    updater: (prev: EditableSaveModel) => EditableSaveModel,
    _diffMeta?: { subsystem: string; label: string; field: keyof EditableSaveModel }
  ) => {
    setActiveModel(prev => {
      if (!prev) return prev;
      return updater(prev);
    });
  }, []);

  const diffs = useMemo<SaveEditorDiffItem[]>(() => {
    if (!activeModel || !originalModel) return [];
    const list: SaveEditorDiffItem[] = [];

    const checkField = (field: keyof EditableSaveModel, label: string, subsystem: string) => {
      const oldV = originalModel[field];
      const newV = activeModel[field];
      if (JSON.stringify(oldV) !== JSON.stringify(newV)) {
        list.push({
          id: field,
          subsystem,
          propertyKey: field,
          label,
          oldValue: oldV,
          newValue: newV,
          formattedOld: String(oldV),
          formattedNew: String(newV)
        });
      }
    };

    checkField('playerName', 'Character Name', 'Player');
    checkField('farmName', 'Farm Name', 'Player');
    checkField('money', 'Wallet Money', 'Player');
    checkField('health', 'Health', 'Player');
    checkField('maxHealth', 'Max Health', 'Player');
    checkField('stamina', 'Stamina', 'Player');
    checkField('maxStamina', 'Max Stamina', 'Player');
    checkField('fishingLevel', 'Fishing Level', 'Player Skills');
    checkField('farmingLevel', 'Farming Level', 'Player Skills');
    checkField('ranchingLevel', 'Ranching Level', 'Player Skills');
    checkField('foragingLevel', 'Foraging Level', 'Player Skills');
    checkField('miningLevel', 'Mining Level', 'Player Skills');
    checkField('catchingLevel', 'Catching Level', 'Player Skills');
    checkField('combatLevel', 'Combat Level', 'Player Skills');
    checkField('divingLevel', 'Diving Level', 'Player Skills');
    checkField('season', 'Season', 'Calendar');
    checkField('day', 'Day', 'Calendar');
    checkField('year', 'Year', 'Calendar');
    checkField('weather', 'Weather', 'Weather');

    // Check inventory slot modifications
    activeModel.inventorySlots.forEach((slot, idx) => {
      const orig = originalModel.inventorySlots[idx];
      if (orig && (slot.itemId !== orig.itemId || slot.amount !== orig.amount || slot.quality !== orig.quality)) {
        list.push({
          id: `slot_${idx}`,
          subsystem: 'Inventory',
          propertyKey: `slot[${idx}]`,
          label: `Backpack Slot #${idx + 1}`,
          oldValue: orig,
          newValue: slot,
          formattedOld: orig.itemId ? `${orig.itemId} x${orig.amount}` : 'Empty',
          formattedNew: slot.itemId ? `${slot.itemId} x${slot.amount}` : 'Empty'
        });
      }
    });

    return list;
  }, [activeModel, originalModel]);

  const exportRepackedFile = useCallback(async () => {
    if (!outerPrefixBytes || !decompressedBytes || !activeModel) {
      throw new Error('No save file currently loaded');
    }

    const patchedDecompressedBytes = applyStagedModelToBuffer(decompressedBytes, activeModel);
    const repacked = recompressSaveGame(outerPrefixBytes, patchedDecompressedBytes, outerTrailingBytes || new Uint8Array(0));
    const report = validateRepackedSaveGame(repacked);

    return {
      buffer: repacked,
      valid: report.valid,
      error: report.error
    };
  }, [outerPrefixBytes, decompressedBytes, outerTrailingBytes, activeModel]);

  const downloadModifiedSave = useCallback(async () => {
    try {
      const { buffer, valid, error: valErr } = await exportRepackedFile();
      if (!valid) {
        throw new Error(valErr || 'Save binary failed self-test assertion');
      }

      const blob = new Blob([buffer.buffer as ArrayBuffer], { type: 'application/octet-stream' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName || 'EndOfDayAutoSave.sav';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to export save');
    }
  }, [exportRepackedFile, fileName]);

  const downloadOriginalBackup = useCallback(() => {
    if (!originalRawBytes) return;
    const blob = new Blob([originalRawBytes.buffer as ArrayBuffer], { type: 'application/octet-stream' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = (fileName ? fileName.replace(/\.sav$/, '') : 'Save') + '.sav.bak';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [originalRawBytes, fileName]);

  const resetAllEdits = useCallback(() => {
    if (originalModel) {
      setActiveModel(JSON.parse(JSON.stringify(originalModel)));
    }
  }, [originalModel]);

  return (
    <SaveEditorContext.Provider
      value={{
        hasFile: !!decompressedBytes,
        fileName,
        activeModel,
        originalModel,
        diffs,
        activeSubsystem,
        setActiveSubsystem,
        loadFile,
        updateModel,
        exportRepackedFile,
        downloadModifiedSave,
        downloadOriginalBackup,
        resetAllEdits,
        isProcessing,
        error
      }}
    >
      {children}
    </SaveEditorContext.Provider>
  );
};

export const useSaveEditor = (): SaveEditorContextType => {
  const ctx = useContext(SaveEditorContext);
  if (!ctx) throw new Error('useSaveEditor must be used within a SaveEditorProvider');
  return ctx;
};
