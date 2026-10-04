import { motion, AnimatePresence } from 'framer-motion';
import { X, FileText, Eye } from 'lucide-react';
import type { CaseFile, CaseDocument } from '@/types';
import { StatusBadge } from '@/components/Badges';

export function DocumentViewerModal({
  caseFile,
  documentId,
  chunkId,
  onClose,
}: {
  caseFile: CaseFile;
  documentId: string | null;
  chunkId: string | null;
  onClose: () => void;
}) {
  if (!documentId) return null;

  const doc: CaseDocument | undefined = caseFile.documents.find((d) => d.id === documentId);
  if (!doc) return null;

  const highlightChunkId = chunkId;
  const highlightChunk = doc.chunks.find((c) => c.id === highlightChunkId);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-void-950/80 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="glass-strong rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-subtle">
            <div className="flex items-center gap-3">
              <FileText size={20} className="text-cyan-glow/60" />
              <div>
                <div className="text-sm font-semibold text-white">{doc.name}</div>
                <div className="flex items-center gap-2 mt-1">
                  <StatusBadge label={doc.type} color="cyan" />
                  <span className="text-[10px] font-mono text-gray-500">{doc.pages} pages</span>
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-white/5 text-gray-400 hover:text-white transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          {/* Body - document chunks */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {doc.chunks.map((chunk, i) => {
              const isHighlighted = chunk.id === highlightChunkId;
              return (
                <motion.div
                  key={chunk.id}
                  initial={isHighlighted ? { backgroundColor: 'rgba(34, 211, 238, 0.15)' } : false}
                  animate={isHighlighted ? { backgroundColor: 'rgba(34, 211, 238, 0.05)' } : {}}
                  transition={{ duration: 1.5 }}
                  className={`rounded-xl p-4 border ${
                    isHighlighted
                      ? 'border-cyan-glow/30 glow-cyan'
                      : 'border-subtle bg-void-900/30'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-gray-500">
                      Page {chunk.pageNumber} — {chunk.section}
                    </span>
                    {isHighlighted && (
                      <span className="flex items-center gap-1 text-[10px] font-mono text-cyan-glow">
                        <Eye size={10} /> Evidence Highlighted
                      </span>
                    )}
                  </div>
                  <p className={`text-sm leading-relaxed ${isHighlighted ? 'text-white' : 'text-gray-400'}`}>
                    {chunk.text}
                  </p>
                </motion.div>
              );
            })}
          </div>

          {/* Footer */}
          {highlightChunk && (
            <div className="p-4 border-t border-subtle bg-void-900/30">
              <div className="text-[10px] font-mono uppercase tracking-wider text-cyan-glow/70 mb-1">
                Evidence Reference
              </div>
              <div className="text-xs text-gray-400">
                {doc.name} — Page {highlightChunk.pageNumber} — {highlightChunk.section}
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
