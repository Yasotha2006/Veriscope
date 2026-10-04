import { motion } from 'framer-motion';
import { StarField } from '@/components/StarField';
import { ConfidenceBadge, StatusBadge } from '@/components/Badges';
import { EvidenceUniverseMap } from '@/components/EvidenceUniverseMap';
import type { CaseFile } from '@/types';
import { AlertTriangle, ArrowRight, ArrowLeftRight, Scale } from 'lucide-react';

export function ConflictAnalysisPage({
  caseFile,
  onNavigate,
}: {
  caseFile: CaseFile;
  onNavigate: (page: any) => void;
}) {
  const conflicts = caseFile.conflicts;

  return (
    <div className="relative min-h-screen bg-void-950 pt-16">
      <StarField density={40} />

      {/* Header */}
      <div className="border-b border-subtle glass-strong">
        <div className="max-w-[1400px] mx-auto px-6 py-5">
          <div className="flex items-center gap-3">
            <AlertTriangle size={20} className="text-verdict-conflicted/70" />
            <div>
              <h1 className="text-xl font-bold text-white tracking-tight">Conflict Analysis</h1>
              <p className="text-xs text-gray-400 mt-0.5">
                Cosmic anomalies — where reliable sources disagree
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 py-6 space-y-6">
        {conflicts.length === 0 ? (
          <div className="glass rounded-2xl p-12 text-center">
            <Scale size={40} className="mx-auto mb-4 text-verdict-verified/40" />
            <h3 className="text-lg font-semibold text-white mb-2">No Anomalies Detected</h3>
            <p className="text-sm text-gray-400 max-w-md mx-auto">
              All evidence across the case files is consistent. No conflicting requirements or contradictory values were found.
            </p>
          </div>
        ) : (
          <>
            {/* Warning banner */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-strong rounded-2xl p-5 border-verdict-conflicted/20 glow-conflict"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-verdict-conflicted/10 border border-verdict-conflicted/20 flex items-center justify-center">
                  <AlertTriangle size={20} className="text-verdict-conflicted" />
                </div>
                <div>
                  <div className="text-sm font-bold text-verdict-conflicted uppercase tracking-wider">
                    ⚠ Cosmic Anomaly Detected
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    {conflicts.length} conflict{conflicts.length !== 1 ? 's' : ''} found across the case files. VeriScope will not select one value without sufficient evidence.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Conflict cards */}
            {conflicts.map((conflict, idx) => (
              <motion.div
                key={conflict.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="glass-strong rounded-2xl p-6"
              >
                {/* Conflict header */}
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] font-mono tracking-wider text-gray-500 uppercase">Anomaly #{String(idx + 1).padStart(2, '0')}</span>
                      <StatusBadge label={conflict.status} color="red" icon="⚠" />
                    </div>
                    <h3 className="text-lg font-bold text-white mt-2">{conflict.topic}</h3>
                  </div>
                </div>

                {/* Claims comparison */}
                <div className="grid md:grid-cols-3 gap-3 mb-5">
                  {conflict.claims.map((claim, i) => (
                    <div key={i} className="rounded-xl p-4 bg-void-900/50 border border-verdict-conflicted/15">
                      <div className="text-[10px] font-mono text-gray-500 uppercase mb-2">Source {String(i + 1).padStart(2, '0')}</div>
                      <div className="text-sm font-medium text-white mb-2">{claim.source}</div>
                      <div className="text-[10px] font-mono text-gray-500 mb-3">{claim.section} • p.{claim.pageNumber}</div>
                      <div className="flex items-baseline gap-2 pt-3 border-t border-subtle">
                        <span className="text-[10px] font-mono text-gray-600 uppercase">Value:</span>
                        <span className="text-2xl font-bold font-mono text-verdict-conflicted">{claim.value}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Difference */}
                <div className="flex items-center gap-3 p-4 rounded-xl bg-amber-glow/5 border border-amber-glow/15 mb-5">
                  <ArrowLeftRight size={16} className="text-amber-glow/70" />
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-amber-glow/70">Difference: </span>
                    <span className="text-sm text-gray-300">{conflict.difference}</span>
                  </div>
                </div>

                {/* Description */}
                <div className="rounded-xl p-4 bg-void-900/40 border border-subtle">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-4 h-4 rounded-full bg-gradient-to-br from-cosmos-500 to-cyan-glow flex items-center justify-center text-[8px] text-white font-bold">V</div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-glow/80">VeriScope Analysis</span>
                  </div>
                  <p className="text-sm text-gray-300 leading-relaxed">{conflict.description}</p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3 mt-5 pt-4 border-t border-subtle">
                  <button
                    onClick={() => onNavigate('compare')}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg border border-cosmos-500/20 text-xs font-medium text-cosmos-300 hover:bg-cosmos-500/10 transition-all"
                  >
                    <ArrowLeftRight size={14} />
                    Compare Evidence
                  </button>
                  <button
                    onClick={() => onNavigate('evidence')}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg border border-cyan-glow/20 text-xs font-medium text-cyan-glow hover:bg-cyan-glow/10 transition-all"
                  >
                    View Evidence Universe
                    <ArrowRight size={14} />
                  </button>
                </div>
              </motion.div>
            ))}

            {/* Galaxy map with conflict highlighting */}
            <div className="glass-strong rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-1.5 h-1.5 rounded-full bg-verdict-conflicted animate-pulse" />
                <span className="text-[10px] font-mono uppercase tracking-wider text-gray-400">
                  Anomaly Visualization — Evidence Universe
                </span>
              </div>
              <div className="h-[400px] rounded-xl overflow-hidden">
                <EvidenceUniverseMap caseFile={caseFile} highlightConflict={true} />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
