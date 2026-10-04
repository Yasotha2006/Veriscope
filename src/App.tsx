import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Navbar } from '@/components/Navbar';
import { DocumentViewerModal } from '@/components/DocumentViewerModal';
import { LandingPage } from '@/pages/LandingPage';
import { InvestigationDashboard } from '@/pages/InvestigationDashboard';
import { EvidenceUniversePage } from '@/pages/EvidenceUniversePage';
import { ConflictAnalysisPage } from '@/pages/ConflictAnalysisPage';
import { DocumentComparisonPage } from '@/pages/DocumentComparisonPage';
import { CaseHistoryPage } from '@/pages/CaseHistoryPage';
import { NewCasePage } from '@/pages/NewCasePage';
import { demoCase } from '@/demoData';
import type { Page, CaseFile } from '@/types';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('landing');
  const [activeCase, setActiveCase] = useState<CaseFile>(demoCase);
  const [viewerDocId, setViewerDocId] = useState<string | null>(null);
  const [viewerChunkId, setViewerChunkId] = useState<string | null>(null);

  const navigate = useCallback((page: Page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const startInvestigation = useCallback((caseFile?: CaseFile) => {
    if (caseFile) {
      setActiveCase(caseFile);
      navigate('investigations');
    } else {
      navigate('newcase');
    }
  }, [navigate]);

  const openDocumentViewer = useCallback((docId: string, chunkId: string) => {
    setViewerDocId(docId);
    setViewerChunkId(chunkId);
  }, []);

  const closeDocumentViewer = useCallback(() => {
    setViewerDocId(null);
    setViewerChunkId(null);
  }, []);

  const pageTransition = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.3 },
  };

  return (
    <div className="relative min-h-screen bg-void-950 text-gray-200">
      <Navbar
        currentPage={currentPage}
        onNavigate={navigate}
        onStartInvestigation={() => navigate('newcase')}
      />

      <AnimatePresence mode="wait">
        {currentPage === 'landing' && (
          <motion.div key="landing" {...pageTransition}>
            <LandingPage onNavigate={navigate} onStartInvestigation={() => navigate('newcase')} />
          </motion.div>
        )}

        {currentPage === 'newcase' && (
          <motion.div key="newcase" {...pageTransition}>
            <NewCasePage onStartInvestigation={startInvestigation} />
          </motion.div>
        )}

        {currentPage === 'investigations' && (
          <motion.div key="investigations" {...pageTransition}>
            <InvestigationDashboard
              caseFile={activeCase}
              onNavigate={navigate}
              onSelectDocumentForView={openDocumentViewer}
            />
          </motion.div>
        )}

        {currentPage === 'evidence' && (
          <motion.div key="evidence" {...pageTransition}>
            <EvidenceUniversePage
              caseFile={activeCase}
              onSelectDocument={openDocumentViewer}
            />
          </motion.div>
        )}

        {currentPage === 'conflicts' && (
          <motion.div key="conflicts" {...pageTransition}>
            <ConflictAnalysisPage caseFile={activeCase} onNavigate={navigate} />
          </motion.div>
        )}

        {currentPage === 'compare' && (
          <motion.div key="compare" {...pageTransition}>
            <DocumentComparisonPage
              caseFile={activeCase}
              onSelectDocument={openDocumentViewer}
            />
          </motion.div>
        )}

        {currentPage === 'documents' && (
          <motion.div key="documents" {...pageTransition}>
            <InvestigationDashboard
              caseFile={activeCase}
              onNavigate={navigate}
              onSelectDocumentForView={openDocumentViewer}
            />
          </motion.div>
        )}

        {currentPage === 'history' && (
          <motion.div key="history" {...pageTransition}>
            <CaseHistoryPage onReopenCase={() => startInvestigation(demoCase)} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Global Document Viewer Modal */}
      <DocumentViewerModal
        caseFile={activeCase}
        documentId={viewerDocId}
        chunkId={viewerChunkId}
        onClose={closeDocumentViewer}
      />
    </div>
  );
}
