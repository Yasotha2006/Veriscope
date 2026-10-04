import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { StarField } from '@/components/StarField';
import { ConfidenceBadge, StatusBadge } from '@/components/Badges';
import { investigate, getStages } from '@/investigationEngine';
import { suggestedQuestions, demoCase } from '@/demoData';
import type { CaseFile, Verdict, Investigation, InvestigationStage } from '@/types';
import { FileText, Search, AlertTriangle, Scale, BookOpen, Star, Link as LinkIcon, Loader2, ChevronRight, FolderOpen, Eye } from 'lucide-react';

const STAGES = getStages();

function DocTypeIcon({ type }: { type: string }) {
  const color = type === 'PDF' ? '#ef4444' : type === 'DOCX' ? '#4f6df5' : '#22d3ee';
  return (
    <div className="flex-shrink-0 w-9 h-11 rounded-md border flex items-center justify-center text-[8px] font-mono font-bold" style={{ borderColor: color + '40', backgroundColor: color + '10', color }}>
      {type}
    </div>
  );
}

function PlanetMini({ size = 40, evidenceCount = 0, color = '#4f6df5' }: { size?: number; evidenceCount?: number; color?: string }) {
  return (
    <div className="relative flex-shrink-0" style={{ width: size, height: size }}>
      <div className="absolute inset-0 rounded-full" style={{ background: `radial-gradient(circle at 30% 30%, ${color}40, ${color}10)`, border: `1px solid ${color}40` }} />
      {/* Orbit ring */}
      <div className="absolute rounded-full border" style={{ inset: -4, borderColor: color + '15', transform: 'rotate(-15deg) scaleY(0.4)' }} />
      {/* Evidence dots */}
      {Array.from({ length: Math.min(evidenceCount, 4) }).map((_, i) => {
        const angle = (Math.PI * 2 * i) / 4;
        const r = size * 0.5;
        return (
          <div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-cyan-glow animate-twinkle"
            style={{
              left: '50% + Math.cos(angle) * r' as any,
              top: '50% + Math.sin(angle) * r' as any,
              animationDelay: `${i * 0.5}s`,
            }}
          />
        );
      })}
    </div>
  );
}

export function InvestigationDashboard({
  caseFile,
  onNavigate,
  onSelectDocumentForView,
}: {
  caseFile: CaseFile;
  onNavigate: (page: any) => void;
  onSelectDocumentForView?: (docId: string, chunkId: string) => void;
}) {
  const [question, setQuestion] = useState('');
  const [isInvestigating, setIsInvestigating] = useState(false);
  const [currentStage, setCurrentStage] = useState(-1);
  const [verdict, setVerdict] = useState<Verdict | null>(null);
  const [investigations, setInvestigations] = useState<Investigation[]>(caseFile.investigations);
  const [selectedEvidence, setSelectedEvidence] = useState<string | null>(null);
  const [expandedEvidence, setExpandedEvidence] = useState<string | null>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const evidencePanelRef = useRef<HTMLDivElement>(null);

  const runInvestigation = useCallback(async (q: string) => {
    if (!q.trim() || isInvestigating) return;
    setQuestion(q);
    setIsInvestigating(true);
    setVerdict(null);
    setCurrentStage(0);

    // Animate through stages
    for (let i = 0; i < STAGES.length; i++) {
      setCurrentStage(i);
      await new Promise((r) => setTimeout(r, 700 + Math.random() * 400));
    }

    const result = investigate(q, caseFile);
    setVerdict(result);
    setIsInvestigating(false);
    setCurrentStage(-1);

    const investigation: Investigation = {
      id: `inv-${Date.now()}`,
      caseId: caseFile.id,
      question: q,
      verdict: result,
      timestamp: new Date().toISOString(),
      steps: STAGES.map((s) => ({ stage: s.stage as InvestigationStage, label: s.label, icon: s.icon, detail: s.detail })),
    };
    setInvestigations((prev) => [investigation, ...prev]);
  }, [caseFile, isInvestigating]);

  function handleEvidenceClick(evId: string) {
    setSelectedEvidence(evId);
    setExpandedEvidence(expandedEvidence === evId ? null : evId);
  }

  function handleCitationClick(docId: string, chunkId: string) {
    if (onSelectDocumentForView) {
      onSelectDocumentForView(docId, chunkId);
    }
  }

  const totalEvidence = caseFile.documents.reduce((sum, d) => sum + d.evidenceCount, 0);

  return (
    <div className="relative min-h-screen bg-void-950 pt-16">
      <StarField density={40} />
      <div className="absolute inset-0 bg-grid opacity-30 pointer-events-none" />
      <div className="relative min-h-screen">

        {/* Case Header */}
        <div className="border-b border-subtle glass-strong">
          <div className="max-w-[1600px] mx-auto px-6 py-5">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-1 h-12 bg-gradient-to-b from-cyan-glow to-cosmos-500 rounded-full" />
                <div>
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-mono tracking-[0.2em] text-gray-500 uppercase">Case {caseFile.number}</span>
                    {caseFile.confidence === 'CONFLICTED' && (
                      <StatusBadge label="Anomaly Detected" color="red" icon="⚠" />
                    )}
                  </div>
                  <h1 className="text-2xl lg:text-3xl font-bold text-white tracking-tight mt-1">{caseFile.title}</h1>
                  <p className="text-sm text-gray-400 mt-1">{caseFile.description}</p>
                </div>
              </div>

              {/* Case stats */}
              <div className="flex gap-6">
                {[
                  { label: 'Status', value: caseFile.status, color: caseFile.status === 'INVESTIGATING' ? 'text-cyan-glow' : 'text-verdict-verified' },
                  { label: 'Documents', value: String(caseFile.documents.length), color: 'text-white' },
                  { label: 'Evidence', value: String(totalEvidence), color: 'text-white' },
                  { label: 'Conflicts', value: String(caseFile.conflicts.length), color: caseFile.conflicts.length > 0 ? 'text-verdict-conflicted' : 'text-white' },
                ].map((stat) => (
                  <div key={stat.label} className="text-center">
                    <div className={`text-lg font-bold font-mono ${stat.color}`}>{stat.value}</div>
                    <div className="text-[9px] font-mono uppercase tracking-wider text-gray-500 mt-0.5">{stat.label}</div>
                  </div>
                ))}
                <div className="text-center">
                  <ConfidenceBadge level={caseFile.confidence} size="sm" />
                  <div className="text-[9px] font-mono uppercase tracking-wider text-gray-500 mt-1.5">Confidence</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Three-panel layout */}
        <div className="max-w-[1600px] mx-auto px-6 py-6 grid lg:grid-cols-[260px_1fr_340px] gap-4 min-h-[calc(100vh-180px)]">

          {/* LEFT: Case Files */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 mb-1">
              <FolderOpen size={14} className="text-cyan-glow/60" />
              <h2 className="text-xs font-mono uppercase tracking-wider text-gray-400">Case Files</h2>
            </div>

            {caseFile.documents.map((doc) => (
              <div
                key={doc.id}
                className="glass rounded-xl p-4 hover:border-cosmos-500/20 transition-all cursor-pointer group"
                onClick={() => handleCitationClick(doc.id, doc.chunks[0]?.id || '')}
              >
                <div className="flex items-start gap-3">
                  <DocTypeIcon type={doc.type} />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-white truncate group-hover:text-cyan-glow transition-colors">
                      {doc.name}
                    </div>
                    <div className="flex items-center gap-2 mt-1.5">
                      <StatusBadge label={doc.extractionStatus} color="green" />
                      <StatusBadge label={doc.indexingStatus} color="blue" />
                    </div>
                    <div className="flex items-center gap-3 mt-2 text-[10px] font-mono text-gray-500">
                      <span>{doc.pages} pages</span>
                      <span className="text-cyan-glow/60">{doc.evidenceCount} evidence</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Mini evidence universe preview */}
            <button
              onClick={() => onNavigate('evidence')}
              className="w-full glass rounded-xl p-4 hover:border-cyan-glow/20 transition-all group text-left"
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="w-1.5 h-1.5 rounded-full bg-cyan-glow animate-twinkle" />
                <span className="text-xs font-mono uppercase tracking-wider text-gray-400">Evidence Universe</span>
              </div>
              <p className="text-[11px] text-gray-500 leading-relaxed">
                Visualize documents as planets and evidence as stars in the galactic knowledge map.
              </p>
              <div className="flex items-center gap-1 mt-2 text-cyan-glow/70 text-xs">
                Open map <ChevronRight size={12} />
              </div>
            </button>

            <button
              onClick={() => onNavigate('conflicts')}
              className="w-full glass rounded-xl p-4 hover:border-verdict-conflicted/20 transition-all group text-left"
            >
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle size={14} className="text-verdict-conflicted/60" />
                <span className="text-xs font-mono uppercase tracking-wider text-gray-400">Anomaly Analysis</span>
              </div>
              <p className="text-[11px] text-gray-500 leading-relaxed">
                {caseFile.conflicts.length} unresolved conflict{caseFile.conflicts.length !== 1 ? 's' : ''} detected across case files.
              </p>
              <div className="flex items-center gap-1 mt-2 text-verdict-conflicted/70 text-xs">
                Analyze <ChevronRight size={12} />
              </div>
            </button>
          </div>

          {/* CENTER: Investigation */}
          <div className="space-y-4">
            {/* Question input */}
            <div className="glass-strong rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <Search size={16} className="text-cyan-glow/60" />
                <h2 className="text-sm font-mono uppercase tracking-wider text-gray-300">
                  What would you like to investigate?
                </h2>
              </div>

              <textarea
                ref={inputRef}
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    runInvestigation(question);
                  }
                }}
                placeholder="Ask a question about the evidence..."
                className="w-full bg-void-900/50 border border-subtle rounded-xl p-4 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-cyan-glow/30 transition-colors resize-none"
                rows={2}
                disabled={isInvestigating}
              />

              <div className="flex items-center justify-between mt-3">
                <span className="text-[10px] font-mono text-gray-600">
                  Press Enter to investigate • Shift+Enter for new line
                </span>
                <button
                  onClick={() => runInvestigation(question)}
                  disabled={!question.trim() || isInvestigating}
                  className="group relative px-5 py-2 text-xs font-bold tracking-wider uppercase rounded-lg overflow-hidden transition-all disabled:opacity-40 disabled:cursor-not-allowed enabled:hover:scale-105"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-cosmos-500 to-cyan-glow disabled:from-gray-600 disabled:to-gray-700" />
                  <span className="relative text-white flex items-center gap-1.5">
                    {isInvestigating ? <Loader2 size={14} className="animate-spin" /> : <Search size={14} />}
                    {isInvestigating ? 'Investigating...' : 'Investigate'}
                  </span>
                </button>
              </div>

              {/* Suggested questions */}
              <div className="mt-5 pt-4 border-t border-subtle">
                <div className="text-[10px] font-mono uppercase tracking-wider text-gray-500 mb-3">
                  Suggested Investigation Questions
                </div>
                <div className="flex flex-wrap gap-2">
                  {suggestedQuestions.map((q) => (
                    <button
                      key={q}
                      onClick={() => runInvestigation(q)}
                      disabled={isInvestigating}
                      className="text-[11px] px-3 py-1.5 rounded-lg border border-cosmos-500/15 text-gray-400 hover:text-cyan-glow hover:border-cyan-glow/30 hover:bg-cyan-glow/5 transition-all disabled:opacity-40"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Investigation Process */}
            <AnimatePresence>
              {isInvestigating && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="glass-strong rounded-2xl p-6 overflow-hidden"
                >
                  <div className="flex items-center gap-2 mb-5">
                    <div className="w-2 h-2 rounded-full bg-cyan-glow animate-pulse" />
                    <h3 className="text-sm font-mono uppercase tracking-wider text-cyan-glow">
                      Investigation In Progress
                    </h3>
                  </div>

                  <div className="space-y-1">
                    {STAGES.map((stage, i) => {
                      const isDone = i < currentStage;
                      const isActive = i === currentStage;
                      const isPending = i > currentStage;
                      return (
                        <motion.div
                          key={stage.stage}
                          initial={{ opacity: 0.3 }}
                          animate={{ opacity: isPending ? 0.3 : 1 }}
                          className="flex items-center gap-3 py-2"
                        >
                          <div className="flex flex-col items-center">
                            {isDone ? (
                              <div className="w-6 h-6 rounded-full bg-verdict-verified/15 border border-verdict-verified/40 flex items-center justify-center text-verdict-verified text-xs">
                                ✓
                              </div>
                            ) : isActive ? (
                              <div className="w-6 h-6 rounded-full bg-cyan-glow/15 border border-cyan-glow/40 flex items-center justify-center">
                                <Loader2 size={12} className="animate-spin text-cyan-glow" />
                              </div>
                            ) : (
                              <div className="w-6 h-6 rounded-full border border-gray-700" />
                            )}
                            {i < STAGES.length - 1 && (
                              <div className={`w-px h-6 ${isDone ? 'bg-verdict-verified/30' : 'bg-gray-800'}`} />
                            )}
                          </div>
                          <div className="flex-1">
                            <div className={`text-sm font-medium ${isPending ? 'text-gray-600' : isActive ? 'text-white' : 'text-gray-400'}`}>
                              <span className="mr-2">{stage.icon}</span>
                              {stage.label}
                            </div>
                            {isActive && (
                              <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-[11px] text-cyan-glow/60 mt-0.5 font-mono"
                              >
                                {stage.detail}
                              </motion.div>
                            )}
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Verdict */}
            <AnimatePresence>
              {verdict && !isInvestigating && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="glass-strong rounded-2xl p-6"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Scale size={18} className="text-cyan-glow/60" />
                      <h3 className="text-sm font-mono uppercase tracking-wider text-gray-300">
                        Investigation Verdict
                      </h3>
                    </div>
                    <ConfidenceBadge level={verdict.confidence} />
                  </div>

                  {/* Status banner */}
                  <div className={`rounded-xl p-4 mb-5 border ${
                    verdict.status === 'CONFLICTED'
                      ? 'bg-verdict-conflicted/5 border-verdict-conflicted/20 glow-conflict'
                      : verdict.status === 'VERIFIED'
                        ? 'bg-verdict-verified/5 border-verdict-verified/20 glow-verified'
                        : 'bg-cosmos-500/5 border-cosmos-500/20'
                  }`}>
                    <div className={`text-lg font-bold mb-2 ${
                      verdict.status === 'CONFLICTED' ? 'text-verdict-conflicted' :
                      verdict.status === 'VERIFIED' ? 'text-verdict-verified' : 'text-cosmos-400'
                    }`}>
                      {verdict.status === 'CONFLICTED' ? '⚠ CONFLICTED' :
                       verdict.status === 'VERIFIED' ? '✓ VERIFIED' :
                       verdict.status === 'SUPPORTED' ? '✓ SUPPORTED' :
                       verdict.status === 'PARTIAL' ? '◐ PARTIAL' : '? INSUFFICIENT'}
                    </div>
                    <p className="text-sm text-gray-300 leading-relaxed">{verdict.answer}</p>
                  </div>

                  {/* Source citations */}
                  {verdict.citations.length > 0 && (
                    <div className="mb-5">
                      <div className="text-[10px] font-mono uppercase tracking-wider text-gray-500 mb-2">
                        Source Citations
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {verdict.citations.map((cite, i) => (
                          <button
                            key={i}
                            onClick={() => handleCitationClick(cite.documentId, cite.chunkId)}
                            className="text-[11px] px-2.5 py-1 rounded-md border border-cosmos-500/20 bg-cosmos-500/5 text-cosmos-300 hover:bg-cosmos-500/10 hover:border-cosmos-500/40 transition-all"
                          >
                            [{cite.documentName} — {cite.section}]
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Conflicting sources */}
                  {verdict.conflicts.length > 0 && (
                    <div className="mb-5">
                      <div className="flex items-center gap-2 mb-3">
                        <AlertTriangle size={14} className="text-verdict-conflicted/70" />
                        <span className="text-[10px] font-mono uppercase tracking-wider text-verdict-conflicted/70">
                          Conflicting Sources
                        </span>
                      </div>
                      <div className="space-y-2">
                        {verdict.conflicts[0].claims.map((claim, i) => (
                          <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-void-900/50 border border-verdict-conflicted/10">
                            <div className="flex items-center gap-3">
                              <span className="text-[10px] font-mono text-gray-500">SOURCE {String(i + 1).padStart(2, '0')}</span>
                              <div>
                                <div className="text-sm text-white">{claim.source}</div>
                                <div className="text-[10px] font-mono text-gray-500">{claim.section}</div>
                              </div>
                            </div>
                            <div className="text-lg font-bold font-mono text-verdict-conflicted">{claim.value}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* VeriScope Assessment */}
                  <div className="rounded-xl p-4 bg-void-900/50 border border-subtle">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-4 h-4 rounded-full bg-gradient-to-br from-cosmos-500 to-cyan-glow flex items-center justify-center text-[8px] text-white font-bold">V</div>
                      <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-glow/80">
                        VeriScope Assessment
                      </span>
                    </div>
                    <p className="text-sm text-gray-300 leading-relaxed italic">{verdict.assessment}</p>
                    <div className="flex items-center gap-3 mt-3 pt-3 border-t border-subtle">
                      <span className="text-[10px] font-mono uppercase text-gray-500">Evidence Confidence:</span>
                      <ConfidenceBadge level={verdict.confidence} size="sm" showIcon={false} />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Investigation History (this session) */}
            {investigations.length > 0 && !isInvestigating && !verdict && (
              <div className="glass rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-3">
                  <BookOpen size={14} className="text-cyan-glow/60" />
                  <span className="text-xs font-mono uppercase tracking-wider text-gray-400">Previous Investigations</span>
                </div>
                <div className="space-y-2">
                  {investigations.map((inv) => (
                    <div key={inv.id} className="flex items-center justify-between p-3 rounded-lg bg-void-900/40 border border-subtle">
                      <span className="text-sm text-gray-300 truncate">{inv.question}</span>
                      {inv.verdict && <ConfidenceBadge level={inv.verdict.confidence} size="sm" />}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* RIGHT: Evidence Panel */}
          <div ref={evidencePanelRef} className="space-y-3">
            <div className="flex items-center gap-2 mb-1">
              <Star size={14} className="text-cyan-glow/60" />
              <h2 className="text-xs font-mono uppercase tracking-wider text-gray-400">Evidence Trail</h2>
            </div>

            {verdict && verdict.evidence.length > 0 ? (
              <div className="space-y-3">
                {verdict.evidence.map((ev, i) => {
                  const isExpanded = expandedEvidence === ev.id;
                  const isSelected = selectedEvidence === ev.id;
                  const isConflict = verdict.conflicts.some(c => c.claims.some(cl => cl.documentId === ev.documentId));
                  return (
                    <motion.div
                      key={ev.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.08 }}
                      className={`glass rounded-xl p-4 cursor-pointer transition-all ${
                        isSelected ? 'border-cyan-glow/30 glow-cyan' : isConflict ? 'border-verdict-conflicted/20' : 'hover:border-cosmos-500/20'
                      }`}
                      onClick={() => handleEvidenceClick(ev.id)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-mono text-gray-500">EVIDENCE #{String(i + 1).padStart(2, '0')}</span>
                        <div className="flex items-center gap-2">
                          {isConflict && <StatusBadge label="ANOMALY" color="red" icon="⚠" />}
                          <StatusBadge label={ev.strength} color={ev.strength === 'HIGH' ? 'green' : ev.strength === 'MEDIUM' ? 'amber' : 'gray'} />
                        </div>
                      </div>

                      <div className="text-sm font-medium text-white mb-1">{ev.documentName}</div>
                      <div className="flex items-center gap-2 text-[10px] font-mono text-gray-500 mb-2">
                        <span>Section: {ev.section}</span>
                        <span>•</span>
                        <span>p.{ev.pageNumber}</span>
                      </div>

                      <div className="text-xs text-gray-400 leading-relaxed bg-void-900/40 rounded-lg p-2.5 mb-2">
                        "{ev.statement}"
                      </div>

                      {/* Relevance bar */}
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] font-mono text-gray-600 uppercase">Relevance</span>
                        <div className="flex-1 h-1.5 rounded-full bg-void-900 overflow-hidden">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-cosmos-500 to-cyan-glow transition-all"
                            style={{ width: `${ev.relevance}%` }}
                          />
                        </div>
                        <span className="text-[10px] font-mono text-cyan-glow">{ev.relevance}%</span>
                      </div>

                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mt-3 pt-3 border-t border-subtle"
                          >
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleCitationClick(ev.documentId, ev.chunkId);
                              }}
                              className="flex items-center gap-1.5 text-xs text-cyan-glow/80 hover:text-cyan-glow transition-colors"
                            >
                              <Eye size={12} />
                              View in document
                            </button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })}
              </div>
            ) : (
              <div className="glass rounded-xl p-6 text-center">
                <Star size={24} className="mx-auto mb-3 text-gray-700" />
                <p className="text-xs text-gray-500 leading-relaxed">
                  Evidence will appear here after you run an investigation. Ask a question to trace the evidence trail.
                </p>
              </div>
            )}

            {/* Citations quick reference */}
            {verdict && verdict.citations.length > 0 && (
              <div className="glass rounded-xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <LinkIcon size={12} className="text-cosmos-400/60" />
                  <span className="text-[10px] font-mono uppercase tracking-wider text-gray-500">Citations</span>
                </div>
                <div className="space-y-1.5">
                  {verdict.citations.map((cite, i) => (
                    <button
                      key={i}
                      onClick={() => handleCitationClick(cite.documentId, cite.chunkId)}
                      className="block w-full text-left text-[11px] text-gray-400 hover:text-cyan-glow transition-colors truncate"
                    >
                      [{cite.documentName} — p.{cite.pageNumber} — {cite.section}]
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
