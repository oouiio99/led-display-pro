import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "LED Display Pro (Ultimate)" },
      { name: "description", content: "เครื่องมือจำลองป้าย LED แบบ Ultimate ปรับแต่งข้อความ สี เอฟเฟกต์ และฉากหลังได้ครบ" },
      { property: "og:title", content: "LED Display Pro (Ultimate)" },
      { property: "og:description", content: "เครื่องมือจำลองป้าย LED ปรับแต่งได้ครบครัน" },
    ],
  }),
  component: LedDisplayApp,
});

type SectionKey = "text" | "interactive" | "style" | "background" | "effects" | "position" | "system";

const PRESETS = [
  { id: "gradient", label: "Gradient Flow (ทไล่เฉดสี)" },
  { id: "solid", label: "Solid (สีเดียว)" },
  { id: "rainbow", label: "Rainbow (รุ้ง)" },
  { id: "fire", label: "Fire (ไฟ)" },
  { id: "ice", label: "Ice (น้ำแข็ง)" },
];

const NOISE_MODES = [
  { id: "none", label: "ไม่มีโนเซลเซอร์" },
  { id: "low", label: "โนเซลเซอร์ ต่ำ" },
  { id: "mid", label: "โนเซลเซอร์ กลาง" },
  { id: "high", label: "โนเซลเซอร์ สูง" },
];

const STYLE_PRESETS: { id: string; name: string; color: string; bg: string }[] = [
  { id: "S1", name: "Classic Green", color: "#39ff14", bg: "#001a00" },
  { id: "S2", name: "Hot Pink", color: "#ff2bd6", bg: "#1a001a" },
  { id: "S3", name: "Cyan Ice", color: "#00f0ff", bg: "#001a1a" },
  { id: "S4", name: "Amber Vintage", color: "#ffb800", bg: "#1a1000" },
  { id: "S5", name: "Plasma Red", color: "#ff3b3b", bg: "#1a0000" },
];

function LedDisplayApp() {
  // ---------- state ----------
  const [text, setText] = useState("LED DISPLAY PRO");
  const [scroll, setScroll] = useState(true);
  const [loop, setLoop] = useState(true);
  const [blink, setBlink] = useState(false);
  const [float, setFloat] = useState(false);
  const [pausedByTimer, setPausedByTimer] = useState(false);
  const [speed, setSpeed] = useState(30);

  const [interactiveAudio, setInteractiveAudio] = useState(false);

  const [color, setColor] = useState("#39ff14");
  const [bgColor, setBgColor] = useState("#000000");

  const [preset, setPreset] = useState("gradient");
  const [bgOpacityDown, setBgOpacityDown] = useState(30);
  const [bgOpacityUp, setBgOpacityUp] = useState(60);

  const [noiseMode, setNoiseMode] = useState("none");
  const [stylePreset, setStylePreset] = useState("S1");

  const [posY, setPosY] = useState(50);
  const [fontSize, setFontSize] = useState(72);

  const [paused, setPaused] = useState(false);

  // accordion
  const [open, setOpen] = useState<Record<SectionKey, boolean>>({
    text: true,
    interactive: false,
    style: false,
    background: true,
    effects: true,
    position: false,
    system: false,
  });
  const toggle = (k: SectionKey) => setOpen((o) => ({ ...o, [k]: !o[k] }));

  // mobile sidebar
  const [sidebarOpen, setSidebarOpen] = useState(true);
  useEffect(() => {
    document.body.classList.add("led-app");
    const mq = window.matchMedia("(max-width: 900px)");
    const apply = () => setSidebarOpen(!mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => {
      document.body.classList.remove("led-app");
      mq.removeEventListener("change", apply);
    };
  }, []);

  // Apply style preset
  const applyStyle = (id: string) => {
    const s = STYLE_PRESETS.find((x) => x.id === id);
    if (!s) return;
    setStylePreset(id);
    setColor(s.color);
    setBgColor(s.bg);
  };

  // Pause timer demo
  const pauseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const handlePauseShort = () => {
    setPaused(true);
    setPausedByTimer(true);
    if (pauseTimer.current) clearTimeout(pauseTimer.current);
    pauseTimer.current = setTimeout(() => {
      setPaused(false);
      setPausedByTimer(false);
    }, 3000);
  };

  // ---------- derived display styles ----------
  const textShadow = useMemo(() => {
    const c = color;
    return `0 0 4px ${c}, 0 0 10px ${c}, 0 0 20px ${c}, 0 0 40px ${c}`;
  }, [color]);

  const backgroundStyle = useMemo<React.CSSProperties>(() => {
    if (preset === "gradient") {
      return {
        backgroundColor: bgColor,
        backgroundImage:
          "radial-gradient(ellipse at 30% 40%, rgba(0,240,255,0.18), transparent 60%), radial-gradient(ellipse at 70% 60%, rgba(255,43,214,0.18), transparent 60%)",
      };
    }
    if (preset === "rainbow") {
      return { background: `linear-gradient(135deg, #ff3b3b, #ffb800, #39ff14, #00f0ff, #b14bff)` };
    }
    if (preset === "fire") {
      return { background: `radial-gradient(ellipse at 50% 80%, #ff6a00, #4a0500 70%)` };
    }
    if (preset === "ice") {
      return { background: `radial-gradient(ellipse at 50% 30%, #6cc8ff, #001a3a 70%)` };
    }
    return { backgroundColor: bgColor };
  }, [preset, bgColor]);

  const scrollDuration = Math.max(2, 22 - speed * 0.3); // seconds

  const textClasses = [
    "led-text",
    blink && !paused ? "led-blink" : "",
    float && !paused ? "led-float" : "",
  ]
    .filter(Boolean)
    .join(" ");

  const textInner = (
    <span
      className={textClasses}
      style={{
        color,
        textShadow,
        fontSize: `${fontSize}px`,
      }}
    >
      {text || " "}
    </span>
  );

  return (
    <div className="relative h-screen w-screen overflow-hidden">
      <div className="synthwave-bg" />

      {/* Mobile toggle */}
      <button
        onClick={() => setSidebarOpen((s) => !s)}
        className="absolute top-3 left-3 z-30 md:hidden cp-panel px-3 py-2 text-cyan-300 font-display text-xs"
        aria-label="Toggle panel"
      >
        ☰ PANEL
      </button>

      <div className="relative z-10 flex h-full w-full">
        {/* ============== CONTROL PANEL ============== */}
        <aside
          className={[
            "cp-scroll absolute md:relative z-20 top-0 left-0 h-full w-[300px] max-w-[85vw] overflow-y-auto p-3 transition-transform duration-300",
            sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
          ].join(" ")}
        >
          <div className="cp-panel p-3 space-y-2">
            <h1 className="cp-title text-base px-1 py-1 flex items-center gap-2">
              <span className="text-pink-400">✦</span> LED Display Pro (Ultimate)
            </h1>

            {/* TEXT */}
            <Section title="📝 ข้อความและการเคลื่อนไหว" open={open.text} onToggle={() => toggle("text")}>
              <input className="cp-input mb-3" value={text} onChange={(e) => setText(e.target.value)} placeholder="พิมพ์ข้อความ..." />
              <Row label="Text เลื่อนไหว"><Toggle on={scroll} onChange={setScroll} /></Row>
              <Row label="Text ซ้ำชัย"><Toggle on={loop} onChange={setLoop} /></Row>
              <Row label="สลากเปิดตา">
                <Toggle on={blink} onChange={setBlink} />
                <input type="range" min={1} max={100} value={speed} onChange={(e) => setSpeed(+e.target.value)} className="cp-slider" />
                <span className="cp-num">{speed}px</span>
              </Row>
              <Row label="ลอบคลองงาน"><Toggle on={float} onChange={setFloat} /></Row>
              <Row label="หมดกทิเซดชั่วคราว">
                <Toggle on={pausedByTimer} onChange={(v) => { setPausedByTimer(v); setPaused(v); }} />
                <button className={`btn-neon ${!paused ? "" : "playing"}`} onClick={handlePauseShort}>
                  {paused ? "กำลังหยุด" : "หยุดชั่วคราว"}
                </button>
              </Row>
            </Section>

            {/* INTERACTIVE */}
            <Section title="🎙 ได้ออบ/เสียง (interactive)" open={open.interactive} onToggle={() => toggle("interactive")}>
              <Row label="เปิดไมโครโฟน"><Toggle on={interactiveAudio} onChange={setInteractiveAudio} /></Row>
              <p className="text-[11px] text-purple-300/70 mt-2">ตอบสนองต่อเสียงรอบข้าง — ขนาดข้อความจะเต้นตามจังหวะ</p>
            </Section>

            {/* STYLE / COLOR */}
            <Section title="🎨 รูปแบบและสีสัน" open={open.style} onToggle={() => toggle("style")}>
              <Row label="สีตัวอักษร">
                <input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="h-8 w-12 rounded border-0 bg-transparent cursor-pointer" />
                <span className="cp-num">{color.toUpperCase()}</span>
              </Row>
              <Row label="สีพื้นจอ">
                <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="h-8 w-12 rounded border-0 bg-transparent cursor-pointer" />
                <span className="cp-num">{bgColor.toUpperCase()}</span>
              </Row>
            </Section>

            {/* BACKGROUND */}
            <Section title="🖼 ฉากหลังและกรอบ" open={open.background} onToggle={() => toggle("background")}>
              <Row label="Presets">
                <select className="cp-select w-[180px]" value={preset} onChange={(e) => setPreset(e.target.value)}>
                  {PRESETS.map((p) => <option key={p.id} value={p.id}>{p.label}</option>)}
                </select>
              </Row>
              <Row label="ตามหลังกลอง">
                <input type="range" min={0} max={100} value={bgOpacityDown} onChange={(e) => setBgOpacityDown(+e.target.value)} className="cp-slider" />
                <span className="cp-num">{bgOpacityDown}x0px</span>
              </Row>
              <Row label="ตามหลังกลุบ">
                <input type="range" min={0} max={100} value={bgOpacityUp} onChange={(e) => setBgOpacityUp(+e.target.value)} className="cp-slider" />
                <span className="cp-num">{bgOpacityUp}x0px</span>
              </Row>
            </Section>

            {/* EFFECTS */}
            <Section title="✨ เอฟเฟกต์" open={open.effects} onToggle={() => toggle("effects")}>
              <Row label="โหมดเลเยอร์">
                <select className="cp-select w-[180px]" value={noiseMode} onChange={(e) => setNoiseMode(e.target.value)}>
                  {NOISE_MODES.map((n) => <option key={n.id} value={n.id}>{n.label}</option>)}
                </select>
              </Row>
              <div className="cp-row">
                <label>Presets</label>
                <div className="flex gap-1">
                  {STYLE_PRESETS.map((s) => (
                    <button key={s.id} className={`btn-mini ${stylePreset === s.id ? "active" : ""}`} onClick={() => applyStyle(s.id)}>{s.id}</button>
                  ))}
                </div>
              </div>
            </Section>

            {/* POSITION */}
            <Section title="📐 ตำแหน่ง" open={open.position} onToggle={() => toggle("position")}>
              <Row label="แนวตั้ง (Y)">
                <input type="range" min={0} max={100} value={posY} onChange={(e) => setPosY(+e.target.value)} className="cp-slider cyan" />
                <span className="cp-num">{posY}%</span>
              </Row>
              <Row label="ขนาดตัวอักษร">
                <input type="range" min={24} max={160} value={fontSize} onChange={(e) => setFontSize(+e.target.value)} className="cp-slider cyan" />
                <span className="cp-num">{fontSize}px</span>
              </Row>
            </Section>

            {/* SYSTEM */}
            <Section title="⚙ ควบคุมระบบ" open={open.system} onToggle={() => toggle("system")}>
              <Row label="หยุดทั้งหมด"><Toggle on={paused} onChange={setPaused} /></Row>
              <div className="cp-row">
                <label>เต็มจอ</label>
                <button className="btn-mini" onClick={() => {
                  if (!document.fullscreenElement) document.documentElement.requestFullscreen?.();
                  else document.exitFullscreen?.();
                }}>Fullscreen</button>
              </div>
              <div className="cp-row">
                <label>รีเซ็ต</label>
                <button className="btn-mini" onClick={() => {
                  setText("LED DISPLAY PRO"); setScroll(true); setLoop(true); setBlink(false);
                  setFloat(false); setSpeed(30); setColor("#39ff14"); setBgColor("#000000");
                  setPreset("gradient"); setNoiseMode("none"); setStylePreset("S1");
                  setPosY(50); setFontSize(72); setPaused(false);
                }}>Reset</button>
              </div>
            </Section>
          </div>
        </aside>

        {/* ============== DISPLAY AREA ============== */}
        <main className="flex-1 grid place-items-center p-4 md:p-10 min-w-0">
          <div className="relative w-full max-w-[1100px] aspect-[16/9]">
            {/* triangle decorations */}
            <div className="tri-deco">
              <svg viewBox="0 0 800 450" fill="none" stroke="currentColor">
                <polygon points="400,40 760,420 40,420" stroke="#ff3b3b" strokeWidth="1.5" opacity="0.65" />
                <polygon points="400,420 40,40 760,40" stroke="#39ff14" strokeWidth="1.5" opacity="0.55" />
              </svg>
            </div>

            <div className="neon-frame w-full h-full">
              <div className="neon-frame-inner w-full h-full" style={backgroundStyle}>
                {/* LED stage */}
                <div className="led-stage" style={{ alignItems: posY < 50 ? "flex-start" : posY > 50 ? "flex-end" : "center", paddingTop: posY < 50 ? `${posY}%` : 0, paddingBottom: posY > 50 ? `${100 - posY}%` : 0 }}>
                  {scroll && !paused ? (
                    <div
                      className="led-scroll"
                      style={{
                        animationDuration: `${scrollDuration}s`,
                        animationIterationCount: loop ? "infinite" : 1,
                      }}
                    >
                      {textInner}
                    </div>
                  ) : (
                    textInner
                  )}
                </div>

                {/* LED grid overlay */}
                <div className="led-grid-overlay" />

                {/* Noise overlay */}
                {noiseMode !== "none" && (
                  <div
                    className="absolute inset-0 pointer-events-none mix-blend-overlay"
                    style={{
                      opacity: noiseMode === "low" ? 0.1 : noiseMode === "mid" ? 0.2 : 0.35,
                      backgroundImage:
                        "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120'><filter id='n'><feTurbulence baseFrequency='0.9' numOctaves='2'/></filter><rect width='100%25' height='100%25' filter='url(%23n)' opacity='0.6'/></svg>\")",
                    }}
                  />
                )}

                {/* Pause overlay */}
                {paused && (
                  <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-black/70 border border-red-500/60 text-red-300 font-display text-[11px]">
                    ⏸ PAUSED
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

function Section({
  title, open, onToggle, children,
}: { title: string; open: boolean; onToggle: () => void; children: React.ReactNode }) {
  return (
    <div>
      <div className="cp-section-header" onClick={onToggle}>
        <span>{title}</span>
        <span className="text-pink-300">{open ? "▲" : "▼"}</span>
      </div>
      {open && <div className="cp-section-body space-y-1">{children}</div>}
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="cp-row">
      <label>{label}</label>
      <div className="flex items-center gap-2 flex-1 justify-end min-w-0">{children}</div>
    </div>
  );
}

function Toggle({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
  return <span className={`toggle ${on ? "on" : ""}`} onClick={() => onChange(!on)} role="switch" aria-checked={on} />;
}
