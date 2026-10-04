import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { StarField } from '@/components/StarField';
import { StatusBadge } from '@/components/Badges';
import type { CaseFile, CaseDocument, DocumentType } from '@/types';
import { demoCase } from '@/demoData';
import { Upload, FileText, X, Sparkles, Check, Loader2, FolderOpen } from 'lucide-react';

const PROCESSING_STEPS = [
  { label: 'Document Received', icon: '📄' },
  { label: 'Extracting Content', icon: '🔍' },
  { label: 'Identifying Structure', icon: '🧬' },
  { label: 'Indexing Evidence', icon: '⭐' },
  { label: 'Building Knowledge Map', icon: '🌌' },
  { label: 'Ready for Investigation', icon: '✓' },
];

interface UploadedFile {
  id: string;
  name: string;
  type: DocumentType;
  size: number;
  status: 'uploaded' | 'processing' | 'ready';
  step: number;
}

function getFileType(name: string): DocumentType {
  const ext = name.split('.').pop()?.toUpperCase();
  if (ext === 'PDF') return 'PDF';
  if (ext === 'DOCX' || ext === 'DOC') return 'DOCX';
  return 'TXT';
}

export function NewCasePage({
  onStartInvestigation,
}: {
  onStartInvestigation: (caseFile: CaseFile) => void;
}) {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showDemoBanner, setShowDemoBanner] = useState(true);

  const handleFiles = useCallback((fileList: FileList | File[]) => {
    const newFiles: UploadedFile[] = Array.from(fileList).map((f) => ({
      id: `file-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      name: f.name,
      type: getFileType(f.name),
      size: f.size,
      status: 'uploaded',
      step: 0,
    }));
    setFiles((prev) => [...prev, ...newFiles]);
  }, []);

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setIsDragOver(false);
    handleFiles(e.dataTransfer.files);
  }

  function removeFile(id: string) {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  }

  async function processFiles() {
    if (files.length === 0) return;
    setIsProcessing(true);

    // Simulate processing animation for each file
    for (const file of files) {
      for (let step = 0; step < PROCESSING_STEPS.length; step++) {
        setFiles((prev) =>
          prev.map((f) => (f.id === file.id ? { ...f, status: 'processing', step } : f))
        );
        await new Promise((r) => setTimeout(r, 300 + Math.random() * 200));
      }
      setFiles((prev) =>
        prev.map((f) => (f.id === file.id ? { ...f, status: 'ready', step: PROCESSING_STEPS.length } : f))
      );
    }

    setIsProcessing(false);

    // Build case file from uploaded files (demo mode: use demo data structure)
    setTimeout(() => {
      onStartInvestigation(demoCase);
    }, 500);
  }

  function loadDemoCase() {
    onStartInvestigation(demoCase);
  }

  const allReady = files.length > 0 && files.every((f) => f.status === 'ready');

  return (
    <div className="relative min-h-screen bg-void-950 pt-16">
      <StarField density={40} />

      {/* Header */}
      <div className="border-b border-subtle glass-strong">
        <div className="max-w-[1200px] mx-auto px-6 py-5">
          <div className="flex items-center gap-3">
            <FolderOpen size={20} className="text-cyan-glow/60" />
            <div>
              <h1 className="text-xl font-bold text-white tracking-tight">Open New Case</h1>
              <p className="text-xs text-gray-400 mt-0.5">
                Upload your case files to begin investigation
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-6 py-6 space-y-6">
        {/* Demo mode banner */}
        {showDemoBanner && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-strong rounded-2xl p-5 border-cyan-glow/20"
          >
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-cyan-glow/10 border border-cyan-glow/20 flex items-center justify-center flex-shrink-0">
                <Sparkles size={18} className="text-cyan-glow" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-white">Demo Mode Available</span>
                  <StatusBadge label="DEMO MODE" color="cyan" />
                </div>
                <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                  No API keys required. Try the built-in demo case with 3 pre-loaded documents that
                  demonstrate conflict detection, evidence trails, and uncertainty handling.
                </p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={loadDemoCase}
                  className="px-4 py-2 rounded-lg bg-gradient-to-r from-cosmos-500 to-cyan-glow text-xs font-bold uppercase tracking-wider text-white hover:scale-105 transition-transform"
                >
                  Load Demo Case
                </button>
                <button
                  onClick={() => setShowDemoBanner(false)}
                  className="p-1.5 rounded-lg text-gray-500 hover:text-white hover:bg-white/5 transition-colors"
                >
                  <X size={14} />
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Upload area */}
        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={handleDrop}
          className={`relative rounded-2xl border-2 border-dashed transition-all p-12 text-center ${
            isDragOver
              ? 'border-cyan-glow/50 bg-cyan-glow/5 glow-cyan'
              : 'border-subtle glass hover:border-cosmos-500/30'
          }`}
        >
          <motion.div
            animate={isDragOver ? { scale: 1.1 } : { scale: 1 }}
            className="flex flex-col items-center"
          >
            <div className="w-16 h-16 rounded-2xl bg-cosmos-500/10 border border-cosmos-500/20 flex items-center justify-center mb-4">
              <Upload size={28} className="text-cosmos-400" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Drop Your Case Files Here</h3>
            <p className="text-sm text-gray-400 mb-4">PDF, DOCX and TXT • Multiple documents supported</p>

            <label className="px-5 py-2.5 rounded-lg border border-cosmos-500/20 text-xs font-bold uppercase tracking-wider text-cosmos-300 hover:bg-cosmos-500/10 transition-all cursor-pointer">
              Browse Files
              <input
                type="file"
                multiple
                accept=".pdf,.docx,.doc,.txt"
                className="hidden"
                onChange={(e) => e.target.files && handleFiles(e.target.files)}
              />
            </label>
          </motion.div>
        </div>

        {/* Uploaded files */}
        {files.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase tracking-wider text-gray-400">
                Case Files ({files.length})
              </span>
              {allReady && !isProcessing && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  onClick={processFiles}
                  className="px-5 py-2 rounded-lg bg-gradient-to-r from-cosmos-500 to-cyan-glow text-xs font-bold uppercase tracking-wider text-white hover:scale-105 transition-transform"
                >
                  Start Investigation →
                </motion.button>
              )}
              {!allReady && !isProcessing && files.some(f => f.status === 'uploaded') && (
                <button
                  onClick={processFiles}
                  className="px-5 py-2 rounded-lg border border-cyan-glow/20 text-xs font-bold uppercase tracking-wider text-cyan-glow hover:bg-cyan-glow/10 transition-all"
                >
                  Process Files
                </button>
              )}
            </div>

            {files.map((file) => (
              <motion.div
                key={file.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-strong rounded-xl p-4"
              >
                <div className="flex items-center gap-4">
                  {/* File icon */}
                  <div className="flex-shrink-0 w-10 h-12 rounded-md border border-cosmos-500/20 bg-cosmos-500/5 flex items-center justify-center text-[9px] font-mono font-bold text-cosmos-400">
                    {file.type}
                  </div>

                  {/* File info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <FileText size={14} className="text-gray-500" />
                      <span className="text-sm font-medium text-white truncate">{file.name}</span>
                    </div>

                    {/* Processing progress */}
                    {file.status === 'processing' && (
                      <div className="mt-2 space-y-1">
                        <div className="flex items-center gap-2">
                          <Loader2 size={10} className="animate-spin text-cyan-glow" />
                          <span className="text-[10px] font-mono text-cyan-glow/80">
                            {PROCESSING_STEPS[file.step]?.label}
                          </span>
                        </div>
                        <div className="h-1 rounded-full bg-void-900 overflow-hidden">
                          <motion.div
                            animate={{ width: `${((file.step + 1) / PROCESSING_STEPS.length) * 100}%` }}
                            className="h-full bg-gradient-to-r from-cosmos-500 to-cyan-glow"
                          />
                        </div>
                      </div>
                    )}

                    {/* Ready status */}
                    {file.status === 'ready' && (
                      <div className="flex items-center gap-2 mt-2">
                        <Check size={12} className="text-verdict-verified" />
                        <StatusBadge label="EXTRACTED" color="green" />
                        <StatusBadge label="INDEXED" color="blue" />
                      </div>
                    )}

                    {/* Uploaded (not yet processed) */}
                    {file.status === 'uploaded' && (
                      <div className="text-[10px] font-mono text-gray-500 mt-1">
                        {(file.size / 1024).toFixed(1)} KB • Ready to process
                      </div>
                    )}
                  </div>

                  {/* Remove button */}
                  {file.status !== 'processing' && (
                    <button
                      onClick={() => removeFile(file.id)}
                      className="p-1.5 rounded-lg text-gray-500 hover:text-verdict-conflicted hover:bg-verdict-conflicted/5 transition-colors"
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Processing pipeline visualization */}
        {isProcessing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="glass-strong rounded-2xl p-6"
          >
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-cyan-glow animate-pulse" />
              <span className="text-xs font-mono uppercase tracking-wider text-cyan-glow">
                Investigation Pipeline
              </span>
            </div>
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
              {PROCESSING_STEPS.map((step, i) => (
                <div key={i} className="flex items-center gap-2 flex-shrink-0">
                  <div className="flex items-center gap-2 px-3 py-2 rounded-lg border border-subtle bg-void-900/40">
                    <span className="text-sm">{step.icon}</span>
                    <span className="text-[10px] font-mono text-gray-400 whitespace-nowrap">{step.label}</span>
                  </div>
                  {i < PROCESSING_STEPS.length - 1 && (
                    <span className="text-cosmos-500/30 text-xs">→</span>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
