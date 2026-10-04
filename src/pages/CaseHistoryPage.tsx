import { motion } from 'framer-motion';
import { StarField } from '@/components/StarField';
import { ConfidenceBadge, StatusBadge } from '@/components/Badges';
import { caseHistory } from '@/demoData';
import { History, FolderOpen, FileText, AlertTriangle, RotateCcw } from 'lucide-react';

export function CaseHistoryPage({
  onReopenCase,
}: {
  onReopenCase: () => void;
}) {
  return (
    <div className="relative min-h-screen bg-void-950 pt-16">
      <StarField density={40} />

      {/* Header */}
      <div className="border-b border-subtle glass-strong">
        <div className="max-w-[1200px] mx-auto px-6 py-5">
          <div className="flex items-center gap-3">
            <History size={20} className="text-cyan-glow/60" />
            <div>
              <h1 className="text-xl font-bold text-white tracking-tight">Case History</h1>
              <p className="text-xs text-gray-400 mt-0.5">
                Revisit and reopen previous investigations
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-6 py-6 space-y-4">
        {caseHistory.map((entry, idx) => (
          <motion.div
            key={entry.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.08 }}
            className="glass-strong rounded-2xl p-5 hover:border-cosmos-500/20 transition-all group"
          >
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4 flex-1 min-w-0">
                <div className={`w-12 h-12 rounded-xl border flex items-center justify-center flex-shrink-0 ${
                  entry.confidence === 'CONFLICTED'
                    ? 'bg-verdict-conflicted/5 border-verdict-conflicted/20'
                    : entry.confidence === 'VERIFIED'
                      ? 'bg-verdict-verified/5 border-verdict-verified/20'
                      : 'bg-cosmos-500/5 border-cosmos-500/20'
                }`}>
                  <FolderOpen size={20} className={
                    entry.confidence === 'CONFLICTED' ? 'text-verdict-conflicted/60' :
                    entry.confidence === 'VERIFIED' ? 'text-verdict-verified/60' : 'text-cosmos-400/60'
                  } />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-mono tracking-wider text-gray-500 uppercase">Case {entry.number}</span>
                    <StatusBadge
                      label={entry.status}
                      color={entry.status === 'COMPLETED' ? 'green' : 'cyan'}
                    />
                  </div>
                  <h3 className="text-base font-semibold text-white mt-1 truncate">{entry.title}</h3>

                  <div className="flex items-center gap-4 mt-2 text-[10px] font-mono text-gray-500">
                    <span className="flex items-center gap-1">
                      <FileText size={10} /> {entry.documentCount} documents
                    </span>
                    <span className={`flex items-center gap-1 ${entry.conflictCount > 0 ? 'text-verdict-conflicted/70' : ''}`}>
                      <AlertTriangle size={10} /> {entry.conflictCount} conflict{entry.conflictCount !== 1 ? 's' : ''}
                    </span>
                    <span>{entry.date}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 flex-shrink-0">
                <ConfidenceBadge level={entry.confidence} size="sm" />
                <button
                  onClick={onReopenCase}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-cosmos-500/20 text-xs font-medium text-cosmos-300 hover:bg-cosmos-500/10 transition-all opacity-0 group-hover:opacity-100"
                >
                  <RotateCcw size={12} />
                  Reopen
                </button>
              </div>
            </div>
          </motion.div>
        ))}

        {/* Summary */}
        <div className="glass rounded-xl p-5 mt-6">
          <div className="grid grid-cols-4 gap-4 text-center">
            {[
              { label: 'Total Cases', value: caseHistory.length, color: 'text-white' },
              { label: 'Completed', value: caseHistory.filter(c => c.status === 'COMPLETED').length, color: 'text-verdict-verified' },
              { label: 'With Conflicts', value: caseHistory.filter(c => c.conflictCount > 0).length, color: 'text-verdict-conflicted' },
              { label: 'Verified', value: caseHistory.filter(c => c.confidence === 'VERIFIED').length, color: 'text-cyan-glow' },
            ].map((stat) => (
              <div key={stat.label}>
                <div className={`text-2xl font-bold font-mono ${stat.color}`}>{stat.value}</div>
                <div className="text-[10px] font-mono uppercase tracking-wider text-gray-500 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
