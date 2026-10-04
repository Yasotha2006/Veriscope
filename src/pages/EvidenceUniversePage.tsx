import { useState } from 'react';
import { motion } from 'framer-motion';
import { StarField } from '@/components/StarField';
import { EvidenceUniverseMap } from '@/components/EvidenceUniverseMap';
import { ConfidenceBadge, StatusBadge } from '@/components/Badges';
import type { CaseFile } from '@/types';
import { AlertTriangle, Star, FileText, Eye } from 'lucide-react';

export function EvidenceUniversePage({
  caseFile,
  onSelectDocument,
}: {
  caseFile: CaseFile;
  onSelectDocument?: (docId: string, chunkId: string) => void;
}) {
  const [selectedDocId, setSelectedDocId] = useState<string | undefined>(undefined);
  const [highlightConflict, setHighlightConflict] = useState(false);

  const selectedDoc = selectedDocId ? caseFile.documents.find((d) => d.id === selectedDocId) : null;
  const selectedEvidence = selectedDocId ? caseFile.evidence.filter((e) => e.documentId === selectedDocId) : [];
  const selectedConflicts = selectedDocId
    ? caseFile.conflicts.filter((c) => c.claims.some((cl) => cl.documentId === selectedDocId))
    : [];

  function handleSelectDoc(docId: string) {
    setSelectedDocId(docId === selectedDocId ? undefined : docId);
  }

  return (
    <div className="relative min-h-screen bg-void-950 pt-16">
      <StarField density={40} />

      {/* Header */}
      <div className="border-b border-subtle glass-strong">
        <div className="max-w-[1400px] mx-auto px-6 py-5">
          <div className="flex items-center gap-3">
            <Star size={20} className="text-cyan-glow/60" />
            <div>
              <h1 className="text-xl font-bold text-white tracking-tight">Evidence Universe</h1>
              <p className="text-xs text-gray-400 mt-0.5">
                Documents as planets, evidence as stars, conflicts as cosmic anomalies
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 py-6 grid lg:grid-cols-[1fr_320px] gap-6">
        {/* Galaxy map */}
        <div className="space-y-4">
          <div className="glass-strong rounded-2xl p-2 relative h-[500px] lg:h-[600px] overflow-hidden">
            <EvidenceUniverseMap
              caseFile={caseFile}
              selectedDocId={selectedDocId}
              onSelectDoc={handleSelectDoc}
              highlightConflict={highlightConflict}
            />

            {/* Map legend overlay */}
            <div className="absolute bottom-4 left-4 glass rounded-lg p-3 space-y-1.5">
              <div className="text-[9px] font-mono uppercase tracking-wider text-gray-500 mb-2">Legend</div>
              <div className="flex items-center gap-2 text-[10px] text-gray-400">
                <div className="w-2.5 h-2.5 rounded-full bg-cosmos-400" /> Document Planet
              </div>
              <div className="flex items-center gap-2 text-[10px] text-gray-400">
                <div className="w-2 h-2 rounded-full bg-cyan-glow" /> Evidence Star
              </div>
              <div className="flex items-center gap-2 text-[10px] text-gray-400">
                <div className="w-2 h-2 rounded-full bg-verdict-conflicted" /> Cosmic Anomaly
              </div>
              <div className="flex items-center gap-2 text-[10px] text-gray-400">
                <div className="w-2 h-2 rounded-full bg-cyan-glow ring-2 ring-cyan-glow/30" /> Investigation Core
              </div>
            </div>

            {/* Toggle controls */}
            <div className="absolute top-4 right-4 flex gap-2">
              <button
                onClick={() => setHighlightConflict(!highlightConflict)}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-mono uppercase tracking-wider transition-all ${
                  highlightConflict
                    ? 'bg-verdict-conflicted/15 text-verdict-conflicted border border-verdict-conflicted/30'
                    : 'glass text-gray-400 border border-subtle hover:text-white'
                }`}
              >
                ⚠ Highlight Anomalies
              </button>
            </div>
          </div>

          {/* Document selector buttons */}
          <div className="grid grid-cols-3 gap-3">
            {caseFile.documents.map((doc) => (
              <button
                key={doc.id}
                onClick={() => handleSelectDoc(doc.id)}
                className={`glass rounded-xl p-3 text-left transition-all ${
                  selectedDocId === doc.id ? 'border-cyan-glow/30 glow-cyan' : 'hover:border-cosmos-500/20'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <FileText size={12} className={selectedDocId === doc.id ? 'text-cyan-glow' : 'text-gray-500'} />
                  <span className="text-[10px] font-mono text-gray-500 uppercase">{doc.type}</span>
                </div>
                <div className="text-xs font-medium text-white truncate">{doc.name.replace(/\.[^.]+$/, '')}</div>
                <div className="text-[10px] font-mono text-cyan-glow/60 mt-1">{doc.evidenceCount} evidence</div>
              </button>
            ))}
          </div>
        </div>

        {/* Detail panel */}
        <div className="space-y-4">
          {!selectedDoc ? (
            <div className="glass rounded-xl p-6 text-center">
              <Star size={28} className="mx-auto mb-3 text-gray-700" />
              <p className="text-xs text-gray-500 leading-relaxed">
                Select a document planet to explore its evidence connections. Click on the galaxy map or use the buttons below.
              </p>
            </div>
          ) : (
            <>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="glass-strong rounded-xl p-5"
              >
                <div className="flex items-center gap-2 mb-3">
                  <FileText size={16} className="text-cyan-glow" />
                  <span className="text-sm font-semibold text-white">{selectedDoc.name.replace(/\.[^.]+$/, '')}</span>
                </div>
                <div className="flex flex-wrap gap-2 mb-3">
                  <StatusBadge label={selectedDoc.type} color="cyan" />
                  <StatusBadge label={selectedDoc.extractionStatus} color="green" />
                  <StatusBadge label={selectedDoc.indexingStatus} color="blue" />
                </div>
                <div className="grid grid-cols-2 gap-3 pt-3 border-t border-subtle">
                  <div>
                    <div className="text-lg font-bold font-mono text-white">{selectedDoc.pages}</div>
                    <div className="text-[9px] font-mono uppercase text-gray-500">Pages</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold font-mono text-cyan-glow">{selectedDoc.evidenceCount}</div>
                    <div className="text-[9px] font-mono uppercase text-gray-500">Evidence</div>
                  </div>
                </div>
              </motion.div>

              {/* Conflicts for this document */}
              {selectedConflicts.length > 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="glass rounded-xl p-4 border-verdict-conflicted/20"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <AlertTriangle size={14} className="text-verdict-conflicted/70" />
                    <span className="text-[10px] font-mono uppercase tracking-wider text-verdict-conflicted/70">
                      Cosmic Anomalies
                    </span>
                  </div>
                  {selectedConflicts.map((conflict) => (
                    <div key={conflict.id} className="text-xs text-gray-400 mb-2">
                      <div className="font-medium text-white mb-1">{conflict.topic}</div>
                      {conflict.claims.filter(c => c.documentId === selectedDocId).map((claim, i) => (
                        <div key={i} className="flex items-center justify-between p-2 rounded bg-verdict-conflicted/5 mt-1">
                          <span className="text-gray-400">{claim.section}</span>
                          <span className="font-mono font-bold text-verdict-conflicted">{claim.value}</span>
                        </div>
                      ))}
                    </div>
                  ))}
                </motion.div>
              )}

              {/* Evidence list */}
              <div>
                <div className="text-[10px] font-mono uppercase tracking-wider text-gray-500 mb-2">
                  Evidence Stars ({selectedEvidence.length})
                </div>
                <div className="space-y-2 max-h-[400px] overflow-y-auto">
                  {selectedEvidence.map((ev, i) => (
                    <motion.div
                      key={ev.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="glass rounded-lg p-3 cursor-pointer hover:border-cyan-glow/20 transition-all"
                      onClick={() => selectedDocId && onSelectDocument?.(selectedDocId, ev.chunkId)}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[9px] font-mono text-gray-500">EV #{String(i+1).padStart(2,'0')}</span>
                        <StatusBadge label={ev.strength} color={ev.strength === 'HIGH' ? 'green' : ev.strength === 'MEDIUM' ? 'amber' : 'gray'} />
                      </div>
                      <div className="text-[11px] text-white font-medium truncate">{ev.section}</div>
                      <div className="text-[10px] text-gray-500 mt-1 truncate">"{ev.statement}"</div>
                      <div className="flex items-center gap-1 mt-1.5 text-[10px] text-cyan-glow/60">
                        <Eye size={10} /> View evidence
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
