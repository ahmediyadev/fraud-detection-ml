import { useState, useEffect, useRef, useCallback } from "react";

// ─────────────────────────────────────────────────────────────────────────────
// DATA — Banks & Clients with lat/lon
// ─────────────────────────────────────────────────────────────────────────────
const BANKS = [
  { id: "BNK-NY",  name: "NY Federal",      lat: 40.71, lon: -74.00, type: "bank" },
  { id: "BNK-LON", name: "London Intl",     lat: 51.50, lon:  -0.12, type: "bank" },
  { id: "BNK-PAR", name: "BNP Paris",       lat: 48.85, lon:   2.35, type: "bank" },
  { id: "BNK-FRA", name: "Deutsche Bk",     lat: 50.11, lon:   8.68, type: "bank" },
  { id: "BNK-TKY", name: "Bank Tokyo",      lat: 35.68, lon: 139.69, type: "bank" },
  { id: "BNK-DXB", name: "Dubai Intl",      lat: 25.20, lon:  55.27, type: "bank" },
  { id: "BNK-SGP", name: "OCBC Singapore",  lat:  1.35, lon: 103.82, type: "bank" },
  { id: "BNK-SHA", name: "ICBC Shanghai",   lat: 31.23, lon: 121.47, type: "bank" },
  { id: "BNK-SYD", name: "ANZ Sydney",      lat:-33.87, lon: 151.21, type: "bank" },
  { id: "BNK-JNB", name: "FNB Joburg",      lat:-26.20, lon:  28.04, type: "bank" },
  { id: "BNK-SAO", name: "Itaú São Paulo",  lat:-23.55, lon: -46.63, type: "bank" },
  { id: "BNK-MEX", name: "Banorte Mexico",  lat: 19.43, lon: -99.13, type: "bank" },
  { id: "BNK-MUM", name: "SBI Mumbai",      lat: 19.07, lon:  72.88, type: "bank" },
  { id: "BNK-YDE", name: "BGFI Yaoundé",    lat:  3.85, lon:  11.52, type: "bank" },
  { id: "BNK-LAG", name: "GTBank Lagos",    lat:  6.45, lon:   3.38, type: "bank" },
  { id: "BNK-MAD", name: "Santander Madrid",lat: 40.42, lon:  -3.70, type: "bank" },
];

const USERS = [
  { id: "USR-001", name: "A. Martin",    lat: 48.86, lon:   2.36, type: "user" },
  { id: "USR-002", name: "J. Smith",     lat: 51.51, lon:  -0.09, type: "user" },
  { id: "USR-003", name: "L. Chen",      lat: 31.22, lon: 121.48, type: "user" },
  { id: "USR-004", name: "K. Tanaka",    lat: 35.67, lon: 139.70, type: "user" },
  { id: "USR-005", name: "M. García",    lat: 40.42, lon:  -3.70, type: "user" },
  { id: "USR-006", name: "P. Okafor",    lat:  6.46, lon:   3.39, type: "user" },
  { id: "USR-007", name: "S. Kumar",     lat: 19.08, lon:  72.89, type: "user" },
  { id: "USR-008", name: "E. Dupont",    lat: 43.30, lon:   5.38, type: "user" },
  { id: "USR-009", name: "R. Santos",    lat:-23.54, lon: -46.62, type: "user" },
  { id: "USR-010", name: "N. Kamga",     lat:  3.86, lon:  11.53, type: "user" },
  { id: "USR-011", name: "T. Williams",  lat: 40.72, lon: -74.01, type: "user" },
  { id: "USR-012", name: "F. Müller",    lat: 52.52, lon:  13.40, type: "user" },
  { id: "USR-013", name: "X. Wang",      lat: 39.91, lon: 116.39, type: "user" },
  { id: "USR-014", name: "H. Al-Saeed", lat: 25.21, lon:  55.28, type: "user" },
  { id: "USR-015", name: "O. Mensah",   lat:  5.56, lon:  -0.20, type: "user" },
  { id: "USR-016", name: "Y. Nakamura", lat: 34.69, lon: 135.50, type: "user" },
  { id: "USR-017", name: "C. Mbeki",    lat:-33.93, lon:  18.42, type: "user" },
  { id: "USR-018", name: "I. Petrov",   lat: 55.75, lon:  37.62, type: "user" },
];

const ALL_NODES = [...BANKS, ...USERS];

// Simplified world land polygons
const LAND_POLYGONS = [
  // North America
  [[70,-140],[70,-60],[50,-55],[45,-65],[40,-70],[30,-80],[25,-77],[10,-77],[8,-80],[9,-83],[20,-97],[28,-110],[35,-117],[45,-124],[50,-127],[55,-130],[60,-140]],
  // Greenland
  [[83,-45],[83,-17],[75,-17],[70,-25],[60,-45],[65,-55],[75,-58],[83,-45]],
  // South America
  [[-5,-80],[-5,-75],[-15,-75],[-20,-70],[-35,-70],[-55,-67],[-60,-64],[-53,-67],[-34,-58],[-25,-48],[-5,-35],[5,-52],[10,-62],[10,-73],[-5,-80]],
  // Europe
  [[60,5],[57,8],[55,15],[54,20],[48,24],[42,28],[37,23],[36,14],[43,0],[43,-9],[44,0],[48,-5],[50,-5],[54,9],[58,5],[60,5]],
  // UK
  [[51,-3],[58,-5],[58,0],[53,0],[51,1],[50,-5],[51,-3]],
  // Africa
  [[35,10],[35,37],[10,42],[-10,40],[-30,30],[-35,26],[-34,18],[-20,14],[-20,12],[-5,9],[5,2],[10,-15],[20,-17],[35,10]],
  // Asia
  [[70,30],[70,80],[55,80],[45,60],[40,52],[35,55],[25,57],[22,69],[10,78],[0,104],[-10,107],[-10,125],[0,128],[10,125],[25,120],[35,120],[40,130],[45,135],[50,130],[60,140],[70,170],[75,140],[80,100],[75,60],[65,35],[70,30]],
  // Australia
  [[-10,130],[-20,120],[-30,115],[-35,118],[-38,140],[-38,148],[-30,153],[-20,148],[-15,135],[-10,130]],
  // Japan
  [[30,130],[35,136],[40,141],[43,141],[40,139],[35,135],[32,131],[30,130]],
  // Madagascar
  [[-12,44],[-16,50],[-25,47],[-25,44],[-20,43],[-12,44]],
];

const AI_MESSAGES = [
  "✓ Comportement nominal — profil client cohérent, géolocalisation validée.",
  "⚠ Anomalie détectée — montant 3.2σ au-dessus de la moyenne historique.",
  "🔴 FRAUDE PROBABLE — double transaction depuis deux continents en <2s.",
  "Analyse vectorielle complète. 847 features. Score confiance : 98.7%.",
  "Alerte : adresse IP masquée via proxy détectée. Vérification KYC lancée.",
  "✓ Virement SWIFT validé — correspondant bancaire authentifié.",
  "Fréquence anormalement haute sur ce compte. Gel temporaire recommandé.",
  "Modèle XGBoost v2.3 actif — taux faux positifs : 0.003% sur 30j.",
  "🔴 Structuration suspecte — série de micro-paiements fragmentés détectée.",
  "✓ Paiement transfrontalier conforme AML/KYC. Archivé en blockchain.",
  "Graphe de transactions : cluster de 15 nœuds suspects isolé.",
  "Vérification biométrique réussie. Accès autorisé.",
];

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────
function project(lat, lon, W, H) {
  const padX = 30, padY = 20;
  const x = padX + ((lon + 180) / 360) * (W - 2 * padX);
  const y = padY + ((90 - lat) / 180) * (H - 2 * padY);
  return { x, y };
}

function randItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function fmtAmount(n) {
  if (n >= 1e6) return "$" + (n / 1e6).toFixed(2) + "M";
  if (n >= 1e3) return "$" + (n / 1e3).toFixed(1) + "K";
  return "$" + n.toFixed(2);
}

function fmtTime(d) {
  return d.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
}

let _txCounter = 1;
function newTxId() {
  return "TX-" + String(_txCounter++).padStart(7, "0");
}

// ─────────────────────────────────────────────────────────────────────────────
// CANVAS RENDERER HOOK
// ─────────────────────────────────────────────────────────────────────────────
function useWorldCanvas(canvasRef, transactions) {
  const rafRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    function resize() {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    }
    resize();
    window.addEventListener("resize", resize);

    function drawLand() {
      const W = canvas.width, H = canvas.height;
      ctx.save();
      // Ocean bg
      ctx.fillStyle = "#040f1e";
      ctx.fillRect(0, 0, W, H);

      // Grid
      ctx.strokeStyle = "rgba(0,180,255,0.04)";
      ctx.lineWidth = 0.5;
      for (let lon = -180; lon <= 180; lon += 30) {
        ctx.beginPath();
        const a = project(90, lon, W, H), b = project(-90, lon, W, H);
        ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
      }
      for (let lat = -90; lat <= 90; lat += 30) {
        ctx.beginPath();
        const a = project(lat, -180, W, H), b = project(lat, 180, W, H);
        ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
      }

      // Land
      for (const poly of LAND_POLYGONS) {
        ctx.beginPath();
        for (let i = 0; i < poly.length; i++) {
          const { x, y } = project(poly[i][0], poly[i][1], W, H);
          i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.fillStyle   = "rgba(12,35,65,0.85)";
        ctx.strokeStyle = "rgba(0,160,255,0.18)";
        ctx.lineWidth   = 0.6;
        ctx.fill(); ctx.stroke();
      }
      ctx.restore();
    }

    function drawNodes(t) {
      const W = canvas.width, H = canvas.height;
      for (const node of ALL_NODES) {
        const { x, y } = project(node.lat, node.lon, W, H);
        const pulse = 0.5 + 0.5 * Math.sin(t * 0.0015 + x * 0.02);
        ctx.save();
        if (node.type === "bank") {
          ctx.shadowColor = "#00d4ff";
          ctx.shadowBlur  = 8 * pulse;
          ctx.fillStyle   = "#00d4ff";
          ctx.strokeStyle = "rgba(0,212,255,0.5)";
          ctx.lineWidth   = 1;
          ctx.fillRect(x - 3, y - 3, 6, 6);
          ctx.strokeRect(x - 5, y - 5, 10, 10);
          // Label
          ctx.font = "bold 7px 'Courier New', monospace";
          ctx.fillStyle = "rgba(0,212,255,0.7)";
          ctx.shadowBlur = 0;
          ctx.fillText(node.name, x + 8, y + 3);
        } else {
          ctx.shadowColor = "#7c3aed";
          ctx.shadowBlur  = 5 * pulse;
          ctx.fillStyle   = "#7c3aed";
          ctx.beginPath();
          ctx.arc(x, y, 3, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }
    }

    function bezierPoint(t, x0, y0, cx, cy, x1, y1) {
      const u = 1 - t;
      return {
        x: u * u * x0 + 2 * u * t * cx + t * t * x1,
        y: u * u * y0 + 2 * u * t * cy + t * t * y1,
      };
    }

    function drawArcs(t) {
      const W = canvas.width, H = canvas.height;
      const txSnap = transactions.current;
      for (const tx of txSnap) {
        const src = project(tx.srcNode.lat, tx.srcNode.lon, W, H);
        const dst = project(tx.dstNode.lat, tx.dstNode.lon, W, H);

        const mx  = (src.x + dst.x) / 2;
        const my  = (src.y + dst.y) / 2 - Math.abs(dst.x - src.x) * 0.22 - 25;

        let color;
        if      (tx.status === "fraud")   color = "#ff1a4d";
        else if (tx.status === "pending") color = "#00ff88";
        else                              color = "#00ff88";

        const isDashed  = tx.progress < 1 || tx.status === "fraud";
        const progress  = Math.min(tx.progress, 1);
        const steps     = 80;
        const endStep   = tx.status === "fraud" ? steps : Math.floor(progress * steps);

        ctx.save();
        ctx.strokeStyle = color;
        ctx.lineWidth   = tx.status === "fraud" ? 1.5 : 1;
        ctx.shadowColor = color;
        ctx.shadowBlur  = 5;

        if (isDashed) {
          ctx.setLineDash([5, 5]);
          ctx.lineDashOffset = -(t * 0.05 + tx.dashSeed);
        }

        ctx.beginPath();
        for (let i = 0; i <= endStep; i++) {
          const tt  = i / steps;
          const pt  = bezierPoint(tt, src.x, src.y, mx, my, dst.x, dst.y);
          i === 0 ? ctx.moveTo(pt.x, pt.y) : ctx.lineTo(pt.x, pt.y);
        }
        ctx.stroke();
        ctx.setLineDash([]);

        // Traveling packet dot
        if (tx.progress < 1) {
          const pp = bezierPoint(progress, src.x, src.y, mx, my, dst.x, dst.y);
          ctx.fillStyle   = color;
          ctx.shadowBlur  = 12;
          ctx.shadowColor = color;
          ctx.beginPath();
          ctx.arc(pp.x, pp.y, 3.5, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }
    }

    function render(t) {
      drawLand();
      drawArcs(t);
      drawNodes(t);
      rafRef.current = requestAnimationFrame(render);
    }

    rafRef.current = requestAnimationFrame(render);
    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
    };
  }, [canvasRef]);
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
export default function BankingFraudDashboard() {
  const canvasRef   = useRef(null);
  const txRef       = useRef([]);    // mutable ref for canvas loop
  const [txList, setTxList]       = useState([]);   // displayed in ticker + panel
  const [stats, setStats]         = useState({ total: 0, ok: 0, fraud: 0, pending: 0, volume: 0 });
  const [clock, setClock]         = useState(new Date());
  const [aiMsg, setAiMsg]         = useState("Initialisation du moteur d'analyse IA…");
  const [aiTyping, setAiTyping]   = useState(false);
  const aiTimerRef = useRef(null);

  useWorldCanvas(canvasRef, txRef);

  // Clock tick
  useEffect(() => {
    const id = setInterval(() => setClock(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  // AI typing effect
  const typeAiMsg = useCallback((msg) => {
    setAiTyping(true);
    setAiMsg("");
    let i = 0;
    clearInterval(aiTimerRef.current);
    aiTimerRef.current = setInterval(() => {
      setAiMsg((prev) => prev + (msg[i] || ""));
      i++;
      if (i >= msg.length) {
        clearInterval(aiTimerRef.current);
        setAiTyping(false);
      }
    }, 22);
  }, []);

  // Spawn transactions
  useEffect(() => {
    const MAX_ACTIVE = 18;
    const MAX_LIST   = 25;

    function spawn() {
      let src = randItem(ALL_NODES);
      let dst;
      do { dst = randItem(ALL_NODES); } while (dst.id === src.id);

      const amount = parseFloat((50 + Math.random() * 149950).toFixed(2));
      const rnd    = Math.random();
      const status = rnd < 0.13 ? "fraud" : rnd < 0.30 ? "pending" : "ok";

      const tx = {
        id:       newTxId(),
        srcNode:  src,
        dstNode:  dst,
        amount,
        status,
        progress: 0,
        speed:    0.003 + Math.random() * 0.007,
        dashSeed: Math.random() * 100,
        time:     new Date(),
        fadingAt: null,
      };

      // Update mutable ref
      txRef.current = [...txRef.current.slice(-MAX_ACTIVE), tx];

      // Update React state for panel
      setTxList((prev) => [tx, ...prev].slice(0, MAX_LIST));
      setStats((s) => ({
        total:   s.total + 1,
        ok:      s.ok      + (status === "ok"      ? 1 : 0),
        fraud:   s.fraud   + (status === "fraud"   ? 1 : 0),
        pending: s.pending + (status === "pending" ? 1 : 0),
        volume:  s.volume  + amount,
      }));

      if (Math.random() < 0.45) {
        const fraudMsgs = AI_MESSAGES.filter(m => m.includes("🔴") || m.includes("⚠") || m.includes("Anomalie") || m.includes("proxy") || m.includes("Gel") || m.includes("Structuration") || m.includes("cluster"));
        const okMsgs    = AI_MESSAGES.filter(m => m.includes("✓") || m.includes("Modèle") || m.includes("Analyse") || m.includes("biométrique") || m.includes("blockchain") || m.includes("Graphe"));
        const pool      = status === "fraud" ? fraudMsgs : okMsgs;
        typeAiMsg(pool[Math.floor(Math.random() * pool.length)] || AI_MESSAGES[0]);
      }
    }

    // Animate progress
    const raf = { id: null };
    function tick() {
      txRef.current = txRef.current.map(tx => ({
        ...tx,
        progress: tx.status === "fraud" ? tx.progress : Math.min(tx.progress + tx.speed, 1),
      }));
      raf.id = requestAnimationFrame(tick);
    }
    raf.id = requestAnimationFrame(tick);

    // Spawn interval
    let spawnId;
    function scheduleSpawn() {
      const delay = 700 + Math.random() * 900;
      spawnId = setTimeout(() => { spawn(); scheduleSpawn(); }, delay);
    }
    scheduleSpawn();

    // Initial burst
    for (let i = 0; i < 6; i++) setTimeout(spawn, i * 120);

    return () => {
      cancelAnimationFrame(raf.id);
      clearTimeout(spawnId);
    };
  }, [typeAiMsg]);

  // ── STYLES ──────────────────────────────────────────────────────────────────
  const s = {
    root: {
      display: "flex", flexDirection: "column",
      width: "100vw", height: "100vh",
      background: "#020b18", color: "#a8d8ea",
      fontFamily: "'Courier New', 'Share Tech Mono', monospace",
      overflow: "hidden",
    },

    // HEADER
    header: {
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "0 20px", height: 56,
      background: "rgba(2,8,20,0.97)",
      borderBottom: "1px solid #0d3a5c",
      flexShrink: 0, zIndex: 10,
    },
    brand: { display: "flex", alignItems: "center", gap: 12 },
    brandIcon: {
      width: 36, height: 36,
      background: "rgba(0,212,255,0.08)",
      border: "1px solid rgba(0,212,255,0.3)",
      borderRadius: 8, display: "flex", alignItems: "center",
      justifyContent: "center", fontSize: 18,
    },
    brandName: {
      fontSize: 17, fontWeight: 700,
      color: "#e0f4ff", letterSpacing: "0.15em",
      textTransform: "uppercase",
      fontFamily: "'Courier New', monospace",
    },
    brandSub: {
      fontSize: 9, color: "#3a8ab0",
      letterSpacing: "0.25em", textTransform: "uppercase",
      marginTop: 2,
    },
    clock: {
      fontSize: 26, fontWeight: 700,
      color: "#00d4ff", letterSpacing: "0.1em",
      fontFamily: "'Courier New', monospace",
      textShadow: "0 0 12px rgba(0,212,255,0.4)",
    },
    statsRow: { display: "flex", gap: 10 },
    statCard: (color) => ({
      display: "flex", flexDirection: "column", alignItems: "center",
      padding: "4px 14px",
      background: "rgba(0,0,0,0.3)",
      border: `1px solid ${color}33`,
      borderRadius: 4,
      minWidth: 74,
    }),
    statVal: (color) => ({
      fontSize: 18, fontWeight: 700, color,
      fontFamily: "'Courier New', monospace",
    }),
    statLbl: {
      fontSize: 8, letterSpacing: "0.2em",
      textTransform: "uppercase", color: "#3a8ab0",
      marginTop: 1,
    },

    // TICKER BAR (transactions scrolling)
    ticker: {
      height: 32, background: "rgba(0,5,15,0.97)",
      borderBottom: "1px solid #0d3a5c",
      display: "flex", alignItems: "center",
      overflow: "hidden", flexShrink: 0,
      position: "relative",
    },
    tickerInner: {
      display: "flex", gap: 32,
      animation: "ticker-scroll 30s linear infinite",
      whiteSpace: "nowrap", paddingLeft: 20,
    },
    tickerItem: (status) => ({
      display: "inline-flex", alignItems: "center", gap: 8,
      fontSize: 10, color: "#4a9bc7",
    }),
    tickerBadge: (status) => ({
      padding: "1px 6px", borderRadius: 2,
      fontSize: 8, letterSpacing: "0.15em", fontWeight: 700,
      textTransform: "uppercase",
      ...(status === "ok"      ? { background: "rgba(0,255,136,0.15)", color: "#00ff88", border: "1px solid rgba(0,255,136,0.3)" } :
          status === "fraud"   ? { background: "rgba(255,26,77,0.15)",  color: "#ff1a4d", border: "1px solid rgba(255,26,77,0.3)"  } :
                                 { background: "rgba(255,187,0,0.12)",  color: "#ffbb00", border: "1px solid rgba(255,187,0,0.3)"   }),
    }),

    // BODY
    body: { display: "flex", flex: 1, overflow: "hidden" },

    // MAP
    mapWrap: { flex: 1, position: "relative", overflow: "hidden" },
    canvas:  { width: "100%", height: "100%", display: "block" },

    legend: {
      position: "absolute", bottom: 14, left: 14,
      background: "rgba(2,8,22,0.88)",
      border: "1px solid #0d3a5c",
      borderRadius: 6, padding: "8px 14px",
      display: "flex", flexDirection: "column", gap: 6,
    },
    legendRow: { display: "flex", alignItems: "center", gap: 10, fontSize: 10, color: "#6bb8d4" },
    legendLine: (color, dashed) => ({
      width: 28, height: 2,
      background: dashed
        ? `repeating-linear-gradient(90deg,${color} 0,${color} 4px,transparent 4px,transparent 8px)`
        : color,
    }),
    legendDot: (color) => ({
      width: 8, height: 8, borderRadius: "50%", background: color,
      boxShadow: `0 0 5px ${color}`,
    }),

    // SIDE PANEL
    panel: {
      width: 310, flexShrink: 0,
      background: "rgba(2,6,18,0.98)",
      borderLeft: "1px solid #0d3a5c",
      display: "flex", flexDirection: "column",
      overflow: "hidden",
    },
    panelHead: {
      padding: "8px 14px",
      borderBottom: "1px solid #0d3a5c",
      fontSize: 9, letterSpacing: "0.25em",
      textTransform: "uppercase", color: "#3a8ab0",
      display: "flex", alignItems: "center", gap: 8,
      flexShrink: 0,
    },
    blink: {
      width: 6, height: 6, borderRadius: "50%",
      background: "#00ff88",
      animation: "pulse-dot 1.2s ease-in-out infinite",
    },
    aiBox: {
      padding: "10px 14px",
      borderBottom: "1px solid #0d3a5c",
      flexShrink: 0,
    },
    aiText: {
      fontSize: 10, color: "#6dd4f0",
      lineHeight: 1.6, minHeight: 40,
    },
    cursor: {
      display: "inline-block", width: 7, height: 12,
      background: "#00d4ff", marginLeft: 2,
      animation: "blink-cursor 0.7s step-end infinite",
      verticalAlign: "middle",
    },
    txListWrap: { flex: 1, overflowY: "auto" },
    txItem: (status) => ({
      padding: "7px 14px",
      borderBottom: "1px solid #050e1e",
      borderLeft: `2px solid ${status === "ok" ? "#00ff88" : status === "fraud" ? "#ff1a4d" : "#ffbb00"}`,
      background: status === "fraud" ? "rgba(255,26,77,0.03)" : "transparent",
      animation: "slide-in 0.35s ease-out",
    }),
    txRow1: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 2 },
    txId:   { fontSize: 9, color: "#3a8ab0" },
    txAmt:  (status) => ({
      fontSize: 11, fontWeight: 700,
      color: status === "ok" ? "#00ff88" : status === "fraud" ? "#ff1a4d" : "#ffbb00",
    }),
    txRow2: { display: "flex", justifyContent: "space-between", fontSize: 9, color: "#3a8ab0", marginTop: 2 },
    txRoute:{ maxWidth: 160, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", color: "#5aa8c8", fontSize: 9 },
  };

  const fmtVol = (v) =>
    v >= 1e9 ? "$" + (v / 1e9).toFixed(2) + "B" :
    v >= 1e6 ? "$" + (v / 1e6).toFixed(1) + "M" :
    v >= 1e3 ? "$" + (v / 1e3).toFixed(0) + "K" : "$" + Math.round(v);

  return (
    <div style={s.root}>

      {/* ── KEYFRAMES ── */}
      <style>{`
        @keyframes ticker-scroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes pulse-dot {
          0%,100% { opacity:1; } 50% { opacity:0.15; }
        }
        @keyframes blink-cursor {
          0%,100% { opacity:1; } 50% { opacity:0; }
        }
        @keyframes slide-in {
          from { opacity:0; transform:translateX(16px); }
          to   { opacity:1; transform:translateX(0); }
        }
        ::-webkit-scrollbar { width:4px; }
        ::-webkit-scrollbar-track { background:transparent; }
        ::-webkit-scrollbar-thumb { background:#0d3a5c; border-radius:2px; }
      `}</style>

      {/* ── HEADER ── */}
      <div style={s.header}>
        <div style={s.brand}>
          <div style={s.brandIcon}>🏦</div>
          <div>
            <div style={s.brandName}>NexaBank · AI Shield</div>
            <div style={s.brandSub}>Fraud Detection System · v4.0 · Real-time</div>
          </div>
        </div>

        <div style={s.clock}>{fmtTime(clock)}</div>

        <div style={s.statsRow}>
          {[
            { lbl: "Transactions", val: stats.total,               color: "#00d4ff" },
            { lbl: "Validées",     val: stats.ok,                  color: "#00ff88" },
            { lbl: "Fraudes",      val: stats.fraud,               color: "#ff1a4d" },
            { lbl: "Volume Total", val: fmtVol(stats.volume),      color: "#ffbb00" },
          ].map(({ lbl, val, color }) => (
            <div key={lbl} style={s.statCard(color)}>
              <span style={s.statVal(color)}>{val}</span>
              <span style={s.statLbl}>{lbl}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── TICKER — scrolling transaction feed ── */}
      <div style={s.ticker}>
        <div style={s.tickerInner}>
          {/* Duplicate for seamless loop */}
          {[...txList, ...txList].map((tx, i) => (
            <span key={i} style={s.tickerItem(tx.status)}>
              <span style={{ color: "#4a9bc7" }}>{tx.id}</span>
              <span style={{ color: "#8acce0" }}>{tx.srcNode.name}</span>
              <span style={{ color: "#2a5a70" }}>→</span>
              <span style={{ color: "#8acce0" }}>{tx.dstNode.name}</span>
              <span style={{ color: "#e0f4ff", fontWeight: 700 }}>{fmtAmount(tx.amount)}</span>
              <span style={{ color: "#2a5a70" }}>{fmtTime(tx.time)}</span>
              <span style={s.tickerBadge(tx.status)}>
                {tx.status === "ok" ? "OK" : tx.status === "fraud" ? "FRAUDE" : "…"}
              </span>
              <span style={{ color: "#0d3a5c", marginLeft: 4 }}>·</span>
            </span>
          ))}
        </div>
      </div>

      {/* ── BODY ── */}
      <div style={s.body}>

        {/* ── MAP ── */}
        <div style={s.mapWrap}>
          <canvas ref={canvasRef} style={s.canvas} />

          {/* Legend */}
          <div style={s.legend}>
            {[
              { label: "Transaction validée",    color: "#00ff88", dashed: false, dot: false },
              { label: "Transaction en cours",   color: "#00ff88", dashed: true,  dot: false },
              { label: "Transaction frauduleuse",color: "#ff1a4d", dashed: true,  dot: false },
              { label: "Banque",   color: "#00d4ff", dot: true },
              { label: "Client",   color: "#7c3aed", dot: true },
            ].map(({ label, color, dashed, dot }) => (
              <div key={label} style={s.legendRow}>
                {dot
                  ? <div style={s.legendDot(color)} />
                  : <div style={s.legendLine(color, dashed)} />}
                {label}
              </div>
            ))}
          </div>
        </div>

        {/* ── SIDE PANEL ── */}
        <div style={s.panel}>

          {/* AI */}
          <div style={s.panelHead}>
            <div style={s.blink} />
            IA · Analyse Fraudes
          </div>
          <div style={s.aiBox}>
            <div style={s.aiText}>
              {aiMsg}
              {aiTyping && <span style={s.cursor} />}
            </div>
          </div>

          {/* Transaction list */}
          <div style={s.panelHead}>
            Flux des transactions
          </div>
          <div style={s.txListWrap}>
            {txList.map((tx) => (
              <div key={tx.id} style={s.txItem(tx.status)}>
                <div style={s.txRow1}>
                  <span style={s.txId}>{tx.id}</span>
                  <span style={s.txAmt(tx.status)}>{fmtAmount(tx.amount)}</span>
                </div>
                <div style={s.txRow2}>
                  <span style={s.txRoute}>{tx.srcNode.name} → {tx.dstNode.name}</span>
                  <span>
                    {tx.status === "ok"    ? "✓ Validée"   :
                     tx.status === "fraud" ? "🔴 FRAUDE"   : "⏳ En cours"}
                  </span>
                </div>
                <div style={{ ...s.txRow2, marginTop: 2, color: "#1e4f6a" }}>
                  <span>{tx.srcNode.id} → {tx.dstNode.id}</span>
                  <span style={{ fontFamily: "'Courier New', monospace", fontSize: 9 }}>
                    {fmtTime(tx.time)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}