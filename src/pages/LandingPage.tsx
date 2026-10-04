import { motion } from 'framer-motion';
import { StarField } from '@/components/StarField';
import { GalaxyHero } from '@/components/GalaxyHero';
import { Logo } from '@/components/Logo';
import type { Page } from '@/types';

const FEATURES = [
  {
    icon: '🔎',
    title: 'Natural-Language Investigation',
    desc: 'Ask questions in plain English. VeriScope traces answers through your documents like a detective following evidence.',
  },
  {
    icon: '⭐',
    title: 'Evidence Trail',
    desc: 'Every answer is grounded in source evidence with exact page numbers, sections, and relevance scores.',
  },
  {
    icon: '⚠',
    title: 'Anomaly Detection',
    desc: 'When documents disagree, VeriScope detects contradictions and refuses to hide uncertainty behind a false answer.',
  },
  {
    icon: '🌌',
    title: 'Evidence Universe',
    desc: 'Visualize your documents as planets and evidence as stars in an interactive galactic knowledge map.',
  },
];

const STEPS = [
  { num: '01', title: 'Open Case File', desc: 'Upload PDF, DOCX, or TXT documents. Each becomes a case file ready for investigation.' },
  { num: '02', title: 'Ask Questions', desc: 'Investigate using natural language. VeriScope searches, ranks, and compares evidence.' },
  { num: '03', title: 'Review Verdict', desc: 'Get a grounded verdict with confidence level, supporting evidence, and source citations.' },
  { num: '04', title: 'Detect Anomalies', desc: 'Conflicting evidence is flagged as cosmic anomalies. Uncertainty is reported, never hidden.' },
];

const METAPHORS = [
  { label: 'Documents', value: 'Planets' },
  { label: 'Evidence', value: 'Stars' },
  { label: 'Relationships', value: 'Orbit Lines' },
  { label: 'Questions', value: 'Investigation Missions' },
  { label: 'Conflicts', value: 'Cosmic Anomalies' },
  { label: 'Answers', value: 'Verdicts' },
];

export function LandingPage({
  onNavigate,
  onStartInvestigation,
}: {
  onNavigate: (page: Page) => void;
  onStartInvestigation: () => void;
}) {
  return (
    <div className="relative min-h-screen bg-void-950 overflow-hidden">
      {/* Background */}
      <div className="fixed inset-0 bg-grid opacity-40" />
      <div className="fixed inset-0 bg-radial-glow" />
      <StarField density={60} />

      {/* Hero */}
      <section className="relative min-h-screen flex items-center pt-16">
        <div className="max-w-[1400px] mx-auto px-6 w-full grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="relative z-10"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-cyan-glow/20 bg-cyan-glow/5 mb-6">
              <Logo size={16} />
              <span className="text-[10px] font-mono tracking-[0.25em] text-cyan-glow/80 uppercase">
                Intelligent Document Investigation
              </span>
            </div>

            <h1 className="text-5xl lg:text-7xl font-bold leading-[1.05] tracking-tight text-white mb-6">
              Every Document.
              <br />
              <span className="text-gradient-cosmos">Every Clue.</span>
              <br />
              One Investigation.
            </h1>

            <p className="text-lg text-gray-400 leading-relaxed max-w-xl mb-8">
              Investigate multiple documents, trace every answer to its evidence, uncover
              contradictions, and know when the evidence is uncertain.
            </p>

            <div className="flex flex-wrap gap-4">
              <button
                onClick={onStartInvestigation}
                className="group relative px-8 py-3.5 text-sm font-bold tracking-wider uppercase rounded-xl overflow-hidden transition-transform hover:scale-105"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-cosmos-500 to-cyan-glow" />
                <span className="absolute inset-0 bg-gradient-to-r from-cosmos-500 to-cyan-glow opacity-60 blur-lg group-hover:opacity-90 transition-opacity" />
                <span className="relative text-white flex items-center gap-2">
                  Start New Investigation
                </span>
              </button>

              <button
                onClick={onStartInvestigation}
                className="px-8 py-3.5 text-sm font-bold tracking-wider uppercase rounded-xl border border-cosmos-500/30 text-gray-300 hover:text-white hover:border-cosmos-500/50 hover:bg-cosmos-500/5 transition-all"
              >
                Explore Demo Case
              </button>
            </div>

            {/* Stats */}
            <div className="flex gap-8 mt-12 pt-8 border-t border-subtle">
              {[
                { label: 'Case Files', value: '3' },
                { label: 'Evidence Points', value: '12' },
                { label: 'Anomalies', value: '1' },
              ].map((stat) => (
                <div key={stat.label}>
                  <div className="text-2xl font-bold text-white font-mono">{stat.value}</div>
                  <div className="text-[10px] font-mono tracking-wider uppercase text-gray-500 mt-1">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right: galaxy visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, delay: 0.3 }}
            className="relative h-[500px] lg:h-[600px]"
          >
            <GalaxyHero />
            {/* Floating labels */}
            <div className="absolute top-[15%] right-[10%] hidden lg:flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-cyan-glow animate-twinkle" />
              <span className="text-[10px] font-mono text-cyan-glow/70 uppercase tracking-wider">Evidence Star</span>
            </div>
            <div className="absolute bottom-[20%] left-[5%] hidden lg:flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-cosmos-400 animate-twinkle" style={{ animationDelay: '1s' }} />
              <span className="text-[10px] font-mono text-cosmos-400/70 uppercase tracking-wider">Document Planet</span>
            </div>
            <div className="absolute top-[45%] left-[2%] hidden lg:flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-verdict-conflicted animate-twinkle" style={{ animationDelay: '2s' }} />
              <span className="text-[10px] font-mono text-verdict-conflicted/70 uppercase tracking-wider">Cosmic Anomaly</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Visual Metaphor Section */}
      <section className="relative py-24 border-t border-subtle">
        <div className="max-w-[1400px] mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <div className="text-[10px] font-mono tracking-[0.3em] text-cyan-glow/60 uppercase mb-3">
              The Galactic Knowledge Universe
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
              A Universe Made of Documents
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              VeriScope maps your investigation into a galactic metaphor — documents become planets,
              evidence becomes stars, and contradictions become cosmic anomalies.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            {METAPHORS.map((m, i) => (
              <motion.div
                key={m.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="glass rounded-xl p-5 flex items-center justify-between hover:border-cyan-glow/20 transition-colors group"
              >
                <div>
                  <div className="text-[10px] font-mono uppercase tracking-wider text-gray-500">{m.label}</div>
                  <div className="text-lg font-semibold text-white mt-1">{m.value}</div>
                </div>
                <div className="w-8 h-8 rounded-full bg-cosmos-500/10 flex items-center justify-center group-hover:bg-cyan-glow/10 transition-colors">
                  <div className="w-2 h-2 rounded-full bg-cyan-glow animate-twinkle" style={{ animationDelay: `${i * 0.3}s` }} />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="relative py-24 border-t border-subtle" id="how-it-works">
        <div className="max-w-[1400px] mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <div className="text-[10px] font-mono tracking-[0.3em] text-cyan-glow/60 uppercase mb-3">
              How It Works
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold text-white">
              From Documents to Verdict
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {STEPS.map((step, i) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="relative"
              >
                <div className="glass rounded-xl p-6 h-full hover:border-cosmos-500/20 transition-colors">
                  <div className="text-3xl font-bold font-mono text-cosmos-500/30 mb-4">{step.num}</div>
                  <h3 className="text-lg font-semibold text-white mb-2">{step.title}</h3>
                  <p className="text-sm text-gray-400 leading-relaxed">{step.desc}</p>
                </div>
                {i < STEPS.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-3 text-cosmos-500/30 text-xl">→</div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="relative py-24 border-t border-subtle">
        <div className="max-w-[1400px] mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <div className="text-[10px] font-mono tracking-[0.3em] text-cyan-glow/60 uppercase mb-3">
              Investigation Capabilities
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold text-white">
              Not Just Chat with PDF
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {FEATURES.map((feat, i) => (
              <motion.div
                key={feat.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="glass rounded-xl p-6 flex gap-5 hover:border-cyan-glow/20 transition-all hover:translate-x-1"
              >
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-cosmos-500/10 border border-cosmos-500/20 flex items-center justify-center text-2xl">
                  {feat.icon}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">{feat.title}</h3>
                  <p className="text-sm text-gray-400 leading-relaxed">{feat.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-24 border-t border-subtle">
        <div className="max-w-[800px] mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Logo size={48} className="mx-auto mb-6 animate-float" />
            <h2 className="text-3xl lg:text-5xl font-bold text-white mb-4">
              Begin Your Investigation
            </h2>
            <p className="text-gray-400 mb-8 max-w-xl mx-auto">
              Upload your case files and let VeriScope trace every clue across the evidence universe.
            </p>
            <button
              onClick={onStartInvestigation}
              className="group relative px-10 py-4 text-sm font-bold tracking-wider uppercase rounded-xl overflow-hidden transition-transform hover:scale-105"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-cosmos-500 to-cyan-glow" />
              <span className="absolute inset-0 bg-gradient-to-r from-cosmos-500 to-cyan-glow opacity-60 blur-lg group-hover:opacity-90 transition-opacity" />
              <span className="relative text-white">Start Investigation</span>
            </button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative py-8 border-t border-subtle">
        <div className="max-w-[1400px] mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Logo size={24} />
            <span className="text-sm font-bold tracking-widest text-white">VERISCOPE</span>
          </div>
          <p className="text-xs font-mono text-gray-500 tracking-wider">
            Every Document. Every Clue. One Investigation.
          </p>
          <p className="text-xs text-gray-600">ALG-AI-02 • Intelligent Document Investigator</p>
        </div>
      </footer>
    </div>
  );
}
