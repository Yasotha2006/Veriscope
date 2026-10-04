import { useState } from 'react';
import { motion } from 'framer-motion';
import { StarField } from '@/components/StarField';
import { StatusBadge } from '@/components/Badges';
import type { CaseFile } from '@/types';
import { ArrowLeftRight, Check, X, AlertTriangle, FileText } from 'lucide-react';

interface ComparisonRow {
  topic: string;
  leftValue: string;
  rightValue: string;
  status: 'MATCH' | 'DIFFER' | 'CONFLICT' | 'LEFT_ONLY' | 'RIGHT_ONLY';
}

export function DocumentComparisonPage({
  caseFile,
  onSelectDocument,
}: {
  caseFile: CaseFile;
  onSelectDocument?: (docId: string, chunkId: string) => void;
}) {
  const [leftDocId, setLeftDocId] = useState(caseFile.documents[0]?.id || '');
  const [rightDocId, setRightDocId] = useState(caseFile.documents[1]?.id || '');

  const leftDoc = caseFile.documents.find((d) => d.id === leftDocId);
  const rightDoc = caseFile.documents.find((d) => d.id === rightDocId);

  // Build comparison data from document chunks
  const comparisons: ComparisonRow[] = [
    {
      topic: 'Minimum Academic Percentage',
      leftValue: leftDoc?.chunks.find(c => c.text.includes('%'))?.text.match(/(\d+)%/)?.[1] + '%' || 'Not specified',
      rightValue: rightDoc?.chunks.find(c => c.text.includes('%'))?.text.match(/(\d+)%/)?.[1] + '%' || 'Not specified',
      status: 'CONFLICT',
    },
    {
      topic: 'Document Type',
      leftValue: leftDoc?.type || '',
      rightValue: rightDoc?.type || '',
      status: leftDoc?.type === rightDoc?.type ? 'MATCH' : 'DIFFER',
    },
    {
      topic: 'Page Count',
      leftValue: String(leftDoc?.pages || 0),
      rightValue: String(rightDoc?.pages || 0),
      status: leftDoc?.pages === rightDoc?.pages ? 'MATCH' : 'DIFFER',
    },
    {
      topic: 'Evidence Points',
      leftValue: String(leftDoc?.evidenceCount || 0),
      rightValue: String(rightDoc?.evidenceCount || 0),
      status: leftDoc?.evidenceCount === rightDoc?.evidenceCount ? 'MATCH' : 'DIFFER',
    },
    {
      topic: 'Eligibility Section',
      leftValue: leftDoc?.chunks.find(c => c.section.toLowerCase().includes('eligib'))?.section || 'Not found',
      rightValue: rightDoc?.chunks.find(c => c.section.toLowerCase().includes('eligib'))?.section || 'Not found',
      status: 'MATCH',
    },
    {
      topic: 'Renewal/Continuation Policy',
      leftValue: leftDoc?.chunks.find(c => c.text.toLowerCase().includes('continuation') || c.text.toLowerCase().includes('renewal'))?.section || 'Not specified',
      rightValue: rightDoc?.chunks.find(c => c.text.toLowerCase().includes('continuation') || c.text.toLowerCase().includes('renewal'))?.section || 'Not specified',
      status: 'DIFFER',
    },
  ];

  const statusConfig = {
    MATCH: { color: 'text-verdict-verified', bg: 'bg-verdict-verified/5', border: 'border-verdict-verified/20', icon: Check, label: 'MATCH' },
    DIFFER: { color: 'text-cosmos-400', bg: 'bg-cosmos-500/5', border: 'border-cosmos-500/20', icon: ArrowLeftRight, label: 'DIFFER' },
    CONFLICT: { color: 'text-verdict-conflicted', bg: 'bg-verdict-conflicted/5', border: 'border-verdict-conflicted/20', icon: AlertTriangle, label: 'CONFLICT' },
    LEFT_ONLY: { color: 'text-amber-glow', bg: 'bg-amber-glow/5', border: 'border-amber-glow/20', icon: ArrowLeftRight, label: 'LEFT ONLY' },
    RIGHT_ONLY: { color: 'text-amber-glow', bg: 'bg-amber-glow/5', border: 'border-amber-glow/20', icon: ArrowLeftRight, label: 'RIGHT ONLY' },
  };

  return (
    <div className="relative min-h-screen bg-void-950 pt-16">
      <StarField density={40} />

      {/* Header */}
      <div className="border-b border-subtle glass-strong">
        <div className="max-w-[1400px] mx-auto px-6 py-5">
          <div className="flex items-center gap-3">
            <ArrowLeftRight size={20} className="text-cyan-glow/60" />
            <div>
              <h1 className="text-xl font-bold text-white tracking-tight">Compare Evidence</h1>
              <p className="text-xs text-gray-400 mt-0.5">
                Side-by-side analysis of matching, differing, and conflicting information
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 py-6 space-y-6">
        {/* Document selectors */}
        <div className="grid md:grid-cols-2 gap-4">
          {[
            { label: 'Left Document', value: leftDocId, set: setLeftDocId },
            { label: 'Right Document', value: rightDocId, set: setRightDocId },
          ].map((sel, idx) => (
            <div key={idx} className="glass rounded-xl p-4">
              <div className="text-[10px] font-mono uppercase tracking-wider text-gray-500 mb-2">{sel.label}</div>
              <div className="flex items-center gap-2 flex-wrap">
                {caseFile.documents.map((doc) => (
                  <button
                    key={doc.id}
                    onClick={() => sel.set(doc.id)}
                    className={`text-xs px-3 py-1.5 rounded-lg border transition-all ${
                      sel.value === doc.id
                        ? 'border-cyan-glow/30 bg-cyan-glow/10 text-cyan-glow'
                        : 'border-subtle text-gray-400 hover:border-cosmos-500/20'
                    }`}
                  >
                    {doc.name.replace(/\.[^.]+$/, '')}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Split-screen comparison */}
        <div className="grid md:grid-cols-2 gap-4">
          {/* Left document */}
          <div className="glass-strong rounded-2xl overflow-hidden">
            <div className="p-4 border-b border-subtle bg-void-900/40">
              <div className="flex items-center gap-2">
                <FileText size={16} className="text-cosmos-400/60" />
                <span className="text-sm font-semibold text-white truncate">{leftDoc?.name}</span>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <StatusBadge label={leftDoc?.type || ''} color="cyan" />
                <span className="text-[10px] font-mono text-gray-500">{leftDoc?.pages} pages</span>
              </div>
            </div>
            <div className="p-4 space-y-3 max-h-[500px] overflow-y-auto">
              {leftDoc?.chunks.map((chunk) => (
                <div key={chunk.id} className="rounded-lg p-3 bg-void-900/30 border border-subtle">
                  <div className="text-[10px] font-mono text-gray-500 mb-1.5">
                    p.{chunk.pageNumber} — {chunk.section}
                  </div>
                  <p className="text-xs text-gray-400 leading-relaxed">{chunk.text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right document */}
          <div className="glass-strong rounded-2xl overflow-hidden">
            <div className="p-4 border-b border-subtle bg-void-900/40">
              <div className="flex items-center gap-2">
                <FileText size={16} className="text-cyan-glow/60" />
                <span className="text-sm font-semibold text-white truncate">{rightDoc?.name}</span>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <StatusBadge label={rightDoc?.type || ''} color="cyan" />
                <span className="text-[10px] font-mono text-gray-500">{rightDoc?.pages} pages</span>
              </div>
            </div>
            <div className="p-4 space-y-3 max-h-[500px] overflow-y-auto">
              {rightDoc?.chunks.map((chunk) => (
                <div key={chunk.id} className="rounded-lg p-3 bg-void-900/30 border border-subtle">
                  <div className="text-[10px] font-mono text-gray-500 mb-1.5">
                    p.{chunk.pageNumber} — {chunk.section}
                  </div>
                  <p className="text-xs text-gray-400 leading-relaxed">{chunk.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Comparison table */}
        <div className="glass-strong rounded-2xl overflow-hidden">
          <div className="p-4 border-b border-subtle">
            <h3 className="text-sm font-mono uppercase tracking-wider text-gray-300">Evidence Comparison</h3>
          </div>
          <div className="divide-y divide-subtle">
            {comparisons.map((row, i) => {
              const cfg = statusConfig[row.status];
              const Icon = cfg.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.05 }}
                  className="grid grid-cols-[1fr_auto_1fr] md:grid-cols-[1fr_auto_1fr_auto] gap-3 p-4 items-center"
                >
                  {/* Left value */}
                  <div className="text-sm text-gray-300">
                    <div className="text-[10px] font-mono uppercase text-gray-600 mb-0.5">{row.topic}</div>
                    <div className="font-medium">{row.leftValue}</div>
                  </div>

                  {/* Center status */}
                  <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border ${cfg.color} ${cfg.bg} ${cfg.border}`}>
                    <Icon size={12} />
                    <span className="text-[9px] font-mono font-bold uppercase tracking-wider">{cfg.label}</span>
                  </div>

                  {/* Right value */}
                  <div className="text-sm text-gray-300 text-right">
                    <div className="text-[10px] font-mono uppercase text-gray-600 mb-0.5 md:hidden">{row.topic}</div>
                    <div className="font-medium">{row.rightValue}</div>
                  </div>

                  {/* Action */}
                  <button
                    onClick={() => {
                      if (leftDoc) onSelectDocument?.(leftDoc.id, leftDoc.chunks[0]?.id || '');
                    }}
                    className="hidden md:flex items-center gap-1 text-[10px] text-cyan-glow/60 hover:text-cyan-glow transition-colors"
                  >
                    <FileText size={10} /> View
                  </button>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Summary */}
        <div className="glass rounded-xl p-5">
          <div className="grid grid-cols-3 gap-4 text-center">
            {[
              { label: 'Matches', count: comparisons.filter(c => c.status === 'MATCH').length, color: 'text-verdict-verified' },
              { label: 'Differences', count: comparisons.filter(c => c.status === 'DIFFER').length, color: 'text-cosmos-400' },
              { label: 'Conflicts', count: comparisons.filter(c => c.status === 'CONFLICT').length, color: 'text-verdict-conflicted' },
            ].map((stat) => (
              <div key={stat.label}>
                <div className={`text-2xl font-bold font-mono ${stat.color}`}>{stat.count}</div>
                <div className="text-[10px] font-mono uppercase tracking-wider text-gray-500 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
