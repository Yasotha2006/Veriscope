import { useEffect, useRef, useState } from 'react';
import type { CaseFile } from '@/types';

interface GalaxyNode {
  id: string;
  type: 'center' | 'planet' | 'star';
  x: number;
  y: number;
  radius: number;
  color: string;
  label: string;
  documentId?: string;
  isConflict?: boolean;
  isVerified?: boolean;
  parentIndex?: number;
}

export function EvidenceUniverseMap({
  caseFile,
  selectedDocId,
  onSelectDoc,
  highlightConflict = false,
  className = '',
}: {
  caseFile: CaseFile;
  selectedDocId?: string;
  onSelectDoc?: (docId: string) => void;
  highlightConflict?: boolean;
  className?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const nodesRef = useRef<GalaxyNode[]>([]);
  const [tooltip, setTooltip] = useState<{ x: number; y: number; text: string } | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let time = 0;
    let orbitAngles: number[] = [];

    function resize() {
      if (!canvas || !ctx) return;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * window.devicePixelRatio;
      canvas.height = rect.height * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    }

    function buildNodes() {
      if (!canvas) return;
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      const cx = w / 2;
      const cy = h / 2;
      const baseR = Math.min(w, h) * 0.18;

      const nodes: GalaxyNode[] = [];
      nodes.push({
        id: 'center',
        type: 'center',
        x: cx,
        y: cy,
        radius: 8,
        color: '#22d3ee',
        label: 'Investigation Core',
      });

      const docCount = caseFile.documents.length;
      orbitAngles = [];

      caseFile.documents.forEach((doc, i) => {
        const angle = (Math.PI * 2 * i) / docCount - Math.PI / 2;
        const orbitR = baseR * (1.5 + (i % 2) * 0.5);
        orbitAngles.push(angle);
        nodes.push({
          id: `planet-${doc.id}`,
          type: 'planet',
          x: cx + Math.cos(angle) * orbitR,
          y: cy + Math.sin(angle) * orbitR,
          radius: 18 + doc.evidenceCount * 1.5,
          color: '#4f6df5',
          label: doc.name.replace(/\.[^.]+$/, ''),
          documentId: doc.id,
        });

        // Add evidence stars around this planet
        const docEvidence = caseFile.evidence.filter((e) => e.documentId === doc.id);
        docEvidence.forEach((ev, j) => {
          const evAngle = (Math.PI * 2 * j) / Math.max(docEvidence.length, 1) + angle * 0.3;
          const evDist = 35 + j * 8;
          const conflictEv = caseFile.conflicts.some((c) =>
            c.claims.some((cl) => cl.documentId === doc.id)
          );
          nodes.push({
            id: `star-${ev.id}`,
            type: 'star',
            x: cx + Math.cos(angle) * orbitR + Math.cos(evAngle) * evDist,
            y: cy + Math.sin(angle) * orbitR + Math.sin(evAngle) * evDist,
            radius: 3,
            color: conflictEv && j < 2 ? '#ef4444' : '#22d3ee',
            label: ev.statement,
            documentId: doc.id,
            isConflict: conflictEv && j < 2,
            parentIndex: nodes.length - 1,
          });
        });
      });

      nodesRef.current = nodes;
    }

    function draw() {
      if (!canvas || !ctx) return;
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      const cx = w / 2;
      const cy = h / 2;

      ctx.clearRect(0, 0, w, h);
      time += 1;

      // Background nebula
      const bg = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(w, h) * 0.5);
      bg.addColorStop(0, 'rgba(36, 22, 86, 0.12)');
      bg.addColorStop(0.5, 'rgba(26, 15, 58, 0.05)');
      bg.addColorStop(1, 'transparent');
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, w, h);

      // Background stars
      for (let i = 0; i < 40; i++) {
        const sx = (i * 137.5) % w;
        const sy = (i * 97.3) % h;
        const tw = Math.sin(time * 0.02 + i) * 0.3 + 0.4;
        ctx.globalAlpha = 0.12 * tw;
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(sx, sy, 0.5, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      const nodes = nodesRef.current;
      if (nodes.length === 0) return;

      // Update orbit positions
      const planetNodes = nodes.filter((n) => n.type === 'planet');
      planetNodes.forEach((planet, i) => {
        const angle = orbitAngles[i] + time * 0.001 * (i % 2 === 0 ? 1 : -1);
        const baseR = Math.min(w, h) * 0.18;
        const orbitR = baseR * (1.5 + (i % 2) * 0.5);
        planet.x = cx + Math.cos(angle) * orbitR;
        planet.y = cy + Math.sin(angle) * orbitR;

        // Update stars around this planet
        const stars = nodes.filter((n) => n.type === 'star' && n.documentId === planet.documentId);
        stars.forEach((star, j) => {
          const starAngle = (Math.PI * 2 * j) / Math.max(stars.length, 1) + angle * 0.3 + time * 0.003;
          const evDist = 35 + j * 8;
          star.x = planet.x + Math.cos(starAngle) * evDist;
          star.y = planet.y + Math.sin(starAngle) * evDist;
        });
      });

      // Draw orbit lines
      planetNodes.forEach((planet, i) => {
        const baseR = Math.min(w, h) * 0.18;
        const orbitR = baseR * (1.5 + (i % 2) * 0.5);
        ctx.strokeStyle = selectedDocId === planet.documentId ? 'rgba(34, 211, 238, 0.3)' : 'rgba(79, 109, 245, 0.08)';
        ctx.lineWidth = selectedDocId === planet.documentId ? 1.5 : 1;
        ctx.beginPath();
        ctx.arc(cx, cy, orbitR, 0, Math.PI * 2);
        ctx.stroke();
      });

      // Draw connections from center to planets
      planetNodes.forEach((planet) => {
        const isSelected = selectedDocId === planet.documentId;
        ctx.strokeStyle = isSelected ? 'rgba(34, 211, 238, 0.25)' : 'rgba(79, 109, 245, 0.06)';
        ctx.lineWidth = isSelected ? 1.5 : 0.8;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(planet.x, planet.y);
        ctx.stroke();
      });

      // Draw connections from planets to stars
      nodes.filter((n) => n.type === 'star').forEach((star) => {
        const planet = planetNodes.find((p) => p.documentId === star.documentId);
        if (!planet) return;
        const isSelected = selectedDocId === star.documentId;
        const isConflict = star.isConflict && highlightConflict;
        ctx.strokeStyle = isConflict
          ? 'rgba(239, 68, 68, 0.3)'
          : isSelected
            ? 'rgba(34, 211, 238, 0.2)'
            : 'rgba(79, 109, 245, 0.05)';
        ctx.lineWidth = isConflict ? 1.2 : 0.6;
        ctx.beginPath();
        ctx.moveTo(planet.x, planet.y);
        ctx.lineTo(star.x, star.y);
        ctx.stroke();
      });

      // Draw center core
      const pulse = Math.sin(time * 0.04) * 0.15 + 0.85;
      const coreGlow = ctx.createRadialGradient(cx, cy, 0, cx, cy, 40);
      coreGlow.addColorStop(0, `rgba(34, 211, 238, ${0.3 * pulse})`);
      coreGlow.addColorStop(1, 'transparent');
      ctx.fillStyle = coreGlow;
      ctx.beginPath();
      ctx.arc(cx, cy, 40, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#22d3ee';
      ctx.globalAlpha = pulse;
      ctx.beginPath();
      ctx.arc(cx, cy, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;

      ctx.strokeStyle = `rgba(34, 211, 238, ${0.4 * pulse})`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(cx, cy, 14, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(cx, cy, 20, 0, Math.PI * 2);
      ctx.stroke();

      // Draw stars (evidence)
      nodes.filter((n) => n.type === 'star').forEach((star) => {
        const isSelected = selectedDocId === star.documentId;
        const isHovered = hoveredNode === star.id;
        const tw = Math.sin(time * 0.03 + star.x * 0.01) * 0.3 + 0.7;

        const size = isHovered ? star.radius * 2 : star.radius;
        const color = star.isConflict ? '#ef4444' : '#22d3ee';

        // glow
        const grad = ctx.createRadialGradient(star.x, star.y, 0, star.x, star.y, size * 4);
        grad.addColorStop(0, color);
        grad.addColorStop(1, 'transparent');
        ctx.fillStyle = grad;
        ctx.globalAlpha = (isSelected ? 0.3 : 0.15) * tw;
        ctx.beginPath();
        ctx.arc(star.x, star.y, size * 4, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = color;
        ctx.globalAlpha = tw;
        ctx.beginPath();
        ctx.arc(star.x, star.y, size, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
      });

      // Draw planets
      planetNodes.forEach((planet) => {
        const isSelected = selectedDocId === planet.documentId;
        const isHovered = hoveredNode === `planet-${planet.documentId}`;

        // glow
        const glowR = planet.radius * 2;
        const glow = ctx.createRadialGradient(planet.x, planet.y, 0, planet.x, planet.y, glowR);
        const glowColor = isSelected ? '#22d3ee' : '#4f6df5';
        glow.addColorStop(0, glowColor + '30');
        glow.addColorStop(1, 'transparent');
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(planet.x, planet.y, glowR, 0, Math.PI * 2);
        ctx.fill();

        // body
        const body = ctx.createRadialGradient(
          planet.x - planet.radius * 0.3,
          planet.y - planet.radius * 0.3,
          0,
          planet.x,
          planet.y,
          planet.radius
        );
        body.addColorStop(0, glowColor + '50');
        body.addColorStop(0.7, glowColor + '20');
        body.addColorStop(1, glowColor + '08');
        ctx.fillStyle = body;
        ctx.beginPath();
        ctx.arc(planet.x, planet.y, planet.radius, 0, Math.PI * 2);
        ctx.fill();

        // border
        ctx.strokeStyle = isSelected ? '#22d3ee' : isHovered ? '#6b8aff' : glowColor + '50';
        ctx.lineWidth = isSelected ? 2 : 1;
        ctx.beginPath();
        ctx.arc(planet.x, planet.y, planet.radius, 0, Math.PI * 2);
        ctx.stroke();

        // label
        if (isHovered || isSelected) {
          ctx.fillStyle = '#e2e8f0';
          ctx.font = '11px "Space Grotesk", sans-serif';
          ctx.textAlign = 'center';
          const label = planet.label.length > 30 ? planet.label.slice(0, 28) + '...' : planet.label;
          ctx.fillText(label, planet.x, planet.y + planet.radius + 18);
        }
      });

      animationId = requestAnimationFrame(draw);
    }

    resize();
    buildNodes();
    draw();

    const handleResize = () => {
      resize();
      buildNodes();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
    };
  }, [caseFile, selectedDocId, highlightConflict, hoveredNode]);

  function handleMouseMove(e: React.MouseEvent<HTMLCanvasElement>) {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;

    let found: { x: number; y: number; text: string; id: string } | null = null;
    for (const node of nodesRef.current) {
      if (node.type === 'center') continue;
      const dx = mx - node.x;
      const dy = my - node.y;
      const hitR = node.type === 'planet' ? node.radius + 5 : node.radius * 2 + 5;
      if (Math.sqrt(dx * dx + dy * dy) < hitR) {
        found = { x: node.x, y: node.y, text: node.label, id: node.id };
        break;
      }
    }

    if (found) {
      setHoveredNode(found.id);
      setTooltip({ x: found.x, y: found.y, text: found.text });
      e.currentTarget.style.cursor = 'pointer';
    } else {
      setHoveredNode(null);
      setTooltip(null);
      e.currentTarget.style.cursor = 'default';
    }
  }

  function handleClick(e: React.MouseEvent<HTMLCanvasElement>) {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;

    for (const node of nodesRef.current) {
      if (node.type !== 'planet') continue;
      const dx = mx - node.x;
      const dy = my - node.y;
      if (Math.sqrt(dx * dx + dy * dy) < node.radius + 5) {
        if (node.documentId && onSelectDoc) {
          onSelectDoc(node.documentId);
        }
        break;
      }
    }
  }

  return (
    <div className={`relative ${className}`}>
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        onMouseMove={handleMouseMove}
        onMouseLeave={() => {
          setHoveredNode(null);
          setTooltip(null);
        }}
        onClick={handleClick}
      />
      {tooltip && (
        <div
          className="absolute pointer-events-none z-10 px-3 py-1.5 rounded-lg glass-strong text-xs text-gray-200 max-w-[240px] truncate"
          style={{
            left: tooltip.x,
            top: tooltip.y - 40,
            transform: 'translateX(-50%)',
          }}
        >
          {tooltip.text}
        </div>
      )}
    </div>
  );
}
