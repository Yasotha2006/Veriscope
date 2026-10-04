export type Page = 'landing' | 'investigations' | 'newcase' | 'evidence' | 'documents' | 'conflicts' | 'history' | 'compare';

export type ConfidenceLevel = 'VERIFIED' | 'SUPPORTED' | 'PARTIAL' | 'CONFLICTED' | 'INSUFFICIENT';

export type DocumentType = 'PDF' | 'DOCX' | 'TXT';

export type ExtractionStatus = 'PENDING' | 'EXTRACTING' | 'EXTRACTED' | 'FAILED';

export type IndexingStatus = 'PENDING' | 'INDEXING' | 'INDEXED' | 'FAILED';

export type InvestigationStage =
  | 'understanding'
  | 'searching'
  | 'ranking'
  | 'comparing'
  | 'conflicts'
  | 'verdict';

export interface DocChunk {
  id: string;
  documentId: string;
  documentName: string;
  pageNumber: number;
  section: string;
  text: string;
  chunkIndex: number;
}

export interface CaseDocument {
  id: string;
  name: string;
  type: DocumentType;
  pages: number;
  extractionStatus: ExtractionStatus;
  indexingStatus: IndexingStatus;
  evidenceCount: number;
  investigationStatus: 'READY' | 'PROCESSING' | 'PENDING';
  chunks: DocChunk[];
  uploadDate: string;
}

export interface Evidence {
  id: string;
  documentId: string;
  documentName: string;
  section: string;
  pageNumber: number;
  statement: string;
  strength: 'HIGH' | 'MEDIUM' | 'LOW';
  relevance: number;
  chunkId: string;
}

export interface ConflictClaim {
  source: string;
  documentId: string;
  value: string;
  section: string;
  pageNumber: number;
}

export interface Conflict {
  id: string;
  topic: string;
  claims: ConflictClaim[];
  difference: string;
  status: 'UNRESOLVED' | 'RESOLVED';
  description: string;
}

export interface InvestigationStep {
  stage: InvestigationStage;
  label: string;
  icon: string;
  detail: string;
}

export interface Citation {
  documentName: string;
  section: string;
  pageNumber: number;
  documentId: string;
  chunkId: string;
}

export interface Verdict {
  status: ConfidenceLevel;
  answer: string;
  confidence: ConfidenceLevel;
  citations: Citation[];
  conflicts: Conflict[];
  evidence: Evidence[];
  assessment: string;
}

export interface Investigation {
  id: string;
  caseId: string;
  question: string;
  verdict: Verdict | null;
  timestamp: string;
  steps: InvestigationStep[];
}

export interface CaseFile {
  id: string;
  number: string;
  title: string;
  description: string;
  status: 'INVESTIGATING' | 'COMPLETED' | 'PENDING';
  documents: CaseDocument[];
  conflicts: Conflict[];
  evidence: Evidence[];
  investigations: Investigation[];
  confidence: ConfidenceLevel;
  createdDate: string;
}

export interface CaseHistoryEntry {
  id: string;
  number: string;
  title: string;
  documentCount: number;
  conflictCount: number;
  status: 'COMPLETED' | 'INVESTIGATING';
  date: string;
  confidence: ConfidenceLevel;
}
