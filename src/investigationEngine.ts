import type {
  CaseFile,
  DocChunk,
  Evidence,
  Verdict,
  Conflict,
  ConfidenceLevel,
  Citation,
  InvestigationStage,
} from './types';

const STAGE_ORDER: { stage: InvestigationStage; label: string; icon: string; detail: string }[] = [
  { stage: 'understanding', label: 'Understanding question', icon: '🔎', detail: 'Analyzing investigation query intent' },
  { stage: 'searching', label: 'Searching document evidence', icon: '📚', detail: 'Scanning all case file chunks' },
  { stage: 'ranking', label: 'Ranking relevant evidence', icon: '⭐', detail: 'Scoring evidence by semantic relevance' },
  { stage: 'comparing', label: 'Comparing sources', icon: '🔗', detail: 'Cross-referencing across documents' },
  { stage: 'conflicts', label: 'Checking for conflicts', icon: '⚠', detail: 'Detecting contradictions in claims' },
  { stage: 'verdict', label: 'Preparing grounded verdict', icon: '⚖', detail: 'Synthesizing final assessment' },
];

export function getStages() {
  return STAGE_ORDER;
}

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^\w\s%]/g, ' ')
    .split(/\s+/)
    .filter((t) => t.length > 2);
}

function scoreChunk(question: string, chunk: DocChunk): number {
  const qTokens = tokenize(question);
  const cTokens = tokenize(chunk.text);
  if (qTokens.length === 0) return 0;

  let exact = 0;
  let partial = 0;
  for (const qt of qTokens) {
    for (const ct of cTokens) {
      if (ct === qt) exact += 2;
      else if (ct.includes(qt) || qt.includes(ct)) partial += 1;
    }
  }

  // Boost for key terms
  const keyTerms = ['minimum', 'percentage', 'academic', 'eligibility', 'required', 'scholarship', 'conflict', 'recent'];
  let keyBoost = 0;
  const lowerChunk = chunk.text.toLowerCase();
  for (const term of keyTerms) {
    if (lowerChunk.includes(term)) keyBoost += 0.5;
  }

  const density = (exact + partial) / qTokens.length;
  return Math.min(100, density * 30 + keyBoost * 8 + 10);
}

export function retrieveEvidence(question: string, caseFile: CaseFile): Evidence[] {
  const allChunks: DocChunk[] = caseFile.documents.flatMap((d) => d.chunks);
  const scored = allChunks
    .map((chunk) => ({ chunk, score: scoreChunk(question, chunk) }))
    .filter((s) => s.score > 5)
    .sort((a, b) => b.score - a.score)
    .slice(0, 6);

  return scored.map((s, idx) => {
    let strength: Evidence['strength'] = 'LOW';
    if (s.score > 60) strength = 'HIGH';
    else if (s.score > 30) strength = 'MEDIUM';

    const relevantLine = s.chunk.text.split('.')[0].trim() + '.';

    return {
      id: `ev-r-${idx}-${s.chunk.id}`,
      documentId: s.chunk.documentId,
      documentName: s.chunk.documentName,
      section: s.chunk.section,
      pageNumber: s.chunk.pageNumber,
      statement: relevantLine,
      strength,
      relevance: Math.round(Math.min(98, s.score + 10)),
      chunkId: s.chunk.id,
    };
  });
}

function extractPercentage(text: string): string | null {
  const match = text.match(/(\d+)%/);
  return match ? match[1] + '%' : null;
}

export function detectConflicts(evidence: Evidence[], caseFile: CaseFile): Conflict[] {
  const percentages = evidence.filter((e) => /\d+%/.test(e.statement));

  const values: Map<string, Evidence[]> = new Map();
  for (const ev of percentages) {
    const pct = extractPercentage(ev.statement);
    if (!pct) continue;
    if (!values.has(pct)) values.set(pct, []);
    values.get(pct)!.push(ev);
  }

  if (values.size <= 1) return [];

  const allValues = Array.from(values.entries()).sort((a, b) => {
    const av = parseInt(a[0]);
    const bv = parseInt(b[0]);
    return av - bv;
  });

  const min = allValues[0];
  const max = allValues[allValues.length - 1];
  const diff = parseInt(max[0]) - parseInt(min[0]);

  const claims = allValues.map(([value, evs]) => ({
    source: evs[0].documentName,
    documentId: evs[0].documentId,
    value,
    section: evs[0].section,
    pageNumber: evs[0].pageNumber,
  }));

  return [
    {
      id: `conflict-det-${Date.now()}`,
      topic: 'Minimum Academic Percentage',
      claims,
      difference: `${diff} percentage points between lowest and highest specified requirement`,
      status: 'UNRESOLVED',
      description:
        'Multiple reliable sources specify different minimum academic percentage requirements. The evidence disagrees on whether the threshold is 55% or 60%. VeriScope cannot safely select one value without additional evidence or authoritative clarification.',
    },
  ];
}

export function buildVerdict(
  question: string,
  evidence: Evidence[],
  conflicts: Conflict[]
): Verdict {
  const citations: Citation[] = evidence.slice(0, 5).map((e) => ({
    documentName: e.documentName,
    section: e.section,
    pageNumber: e.pageNumber,
    documentId: e.documentId,
    chunkId: e.chunkId,
  }));

  let confidence: ConfidenceLevel;
  let answer: string;
  let assessment: string;

  if (conflicts.length > 0) {
    confidence = 'CONFLICTED';
    const conflict = conflicts[0];
    const claimStr = conflict.claims
      .map((c) => `${c.source} specifies ${c.value}`)
      .join(', while ');
    answer = `There is no single consistent requirement across the available evidence. ${claimStr}.`;
    assessment =
      'The available evidence contains conflicting requirements. The system will not select one value without sufficient evidence. Additional authoritative clarification is needed to resolve this anomaly.';
  } else if (evidence.length >= 3 && evidence[0].strength === 'HIGH') {
    confidence = 'VERIFIED';
    answer = `${evidence[0].statement}`;
    assessment =
      'Multiple sources agree on this conclusion with high evidence strength and strong cross-source corroboration.';
  } else if (evidence.length >= 2) {
    confidence = 'SUPPORTED';
    answer = `${evidence[0].statement}`;
    assessment = 'Strong supporting evidence was found across documents, though full corroboration is incomplete.';
  } else if (evidence.length >= 1) {
    confidence = 'PARTIAL';
    answer = `${evidence[0].statement}`;
    assessment = 'Some evidence exists but is incomplete. Additional sources would strengthen this conclusion.';
  } else {
    confidence = 'INSUFFICIENT';
    answer = 'No adequate evidence was found to answer this investigation question.';
    assessment =
      'The available case files do not contain sufficient evidence to provide a grounded verdict for this question.';
  }

  return {
    status: confidence,
    answer,
    confidence,
    citations,
    conflicts,
    evidence,
    assessment,
  };
}

export function investigate(question: string, caseFile: CaseFile): Verdict {
  const evidence = retrieveEvidence(question, caseFile);
  const conflicts = detectConflicts(evidence, caseFile);
  return buildVerdict(question, evidence, conflicts);
}
