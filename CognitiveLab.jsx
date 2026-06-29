import { useState, useEffect, useRef, useCallback } from "react";
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

// ─── THEME TOKENS ────────────────────────────────────────────────────────────
const C = {
  bg: "#07090F",
  surface: "#0F1420",
  card: "#141929",
  border: "#1E2740",
  cyan: "#00D4FF",
  lavender: "#8B9CF4",
  green: "#00FF9C",
  red: "#FF4D6D",
  yellow: "#FFD166",
  text: "#E8EAF0",
  muted: "#5A6280",
  white: "#FFFFFF",
};

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;700&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    background: ${C.bg};
    color: ${C.text};
    font-family: 'Space Grotesk', sans-serif;
    min-height: 100vh;
  }

  .mono { font-family: 'JetBrains Mono', monospace; }

  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: ${C.bg}; }
  ::-webkit-scrollbar-thumb { background: ${C.border}; border-radius: 3px; }

  @keyframes pulse-ring {
    0% { transform: scale(0.8); opacity: 1; }
    100% { transform: scale(2.5); opacity: 0; }
  }
  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-8px); }
  }
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(16px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes blink {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.2; }
  }
  @keyframes scanline {
    0% { transform: translateY(-100%); }
    100% { transform: translateY(100vh); }
  }
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
  .fadeIn { animation: fadeIn 0.5s ease forwards; }
  .float { animation: float 3s ease-in-out infinite; }
`;

// ─── NEURAL NETWORK SVG ───────────────────────────────────────────────────────
function NeuralBg() {
  const nodes = [
    {x:10,y:30},{x:10,y:50},{x:10,y:70},
    {x:35,y:20},{x:35,y:40},{x:35,y:60},{x:35,y:80},
    {x:60,y:30},{x:60,y:50},{x:60,y:70},
    {x:85,y:20},{x:85,y:50},{x:85,y:80},
  ];
  const edges = [
    [0,3],[0,4],[1,3],[1,4],[1,5],[2,4],[2,5],[2,6],
    [3,7],[3,8],[4,7],[4,8],[4,9],[5,8],[5,9],[6,8],[6,9],
    [7,10],[7,11],[8,10],[8,11],[8,12],[9,11],[9,12],
  ];
  return (
    <svg viewBox="0 0 100 100" style={{position:"absolute",inset:0,width:"100%",height:"100%",opacity:0.08}} preserveAspectRatio="xMidYMid slice">
      {edges.map(([a,b],i)=>(
        <line key={i} x1={nodes[a].x} y1={nodes[a].y} x2={nodes[b].x} y2={nodes[b].y}
          stroke={C.cyan} strokeWidth="0.3"/>
      ))}
      {nodes.map((n,i)=>(
        <circle key={i} cx={n.x} cy={n.y} r="1.5" fill={C.cyan}/>
      ))}
    </svg>
  );
}

// ─── EXPERIMENT METADATA ──────────────────────────────────────────────────────
const EXPERIMENTS = [
  { id:"reaction", label:"Reaction Time", icon:"⚡", color: C.cyan,    desc:"Click the moment the screen turns green. Measures neural processing speed." },
  { id:"stroop",   label:"Stroop Test",   icon:"🎨", color: C.lavender, desc:"Name the ink color, not the word. Measures cognitive control." },
  { id:"memory",   label:"Memory Test",   icon:"🧩", color: C.green,   desc:"Memorize a sequence of objects. Measures working memory capacity." },
  { id:"gonogo",   label:"Go / No-Go",    icon:"🎯", color: C.yellow,  desc:"Press for circles, hold for squares. Measures impulse control." },
  { id:"visual",   label:"Visual Search", icon:"🔍", color: "#FF8C42",  desc:"Find the odd one out. Measures attention and visual scanning." },
  { id:"attention",label:"Attention",     icon:"📡", color: "#FF4D6D",  desc:"Track specific targets in a rapid stream. Measures selective attention." },
];

// ─── HOME ─────────────────────────────────────────────────────────────────────
function Home({ onStart, results }) {
  const completed = Object.keys(results).length;
  return (
    <div style={{minHeight:"100vh",display:"flex",flexDirection:"column"}}>
      {/* Hero */}
      <div style={{position:"relative",padding:"80px 40px 60px",textAlign:"center",overflow:"hidden"}}>
        <NeuralBg/>
        <div style={{position:"relative",zIndex:1}}>
          <div style={{display:"inline-flex",alignItems:"center",gap:8,background:C.surface,border:`1px solid ${C.border}`,borderRadius:99,padding:"6px 16px",marginBottom:24}}>
            <span style={{width:8,height:8,borderRadius:"50%",background:C.green,display:"inline-block",animation:"blink 1.4s ease-in-out infinite"}}/>
            <span style={{fontSize:13,color:C.muted,fontFamily:"JetBrains Mono,monospace",letterSpacing:1}}>COGNITIVE ASSESSMENT PLATFORM</span>
          </div>
          <h1 style={{fontSize:"clamp(36px,6vw,72px)",fontWeight:700,letterSpacing:"-2px",lineHeight:1.1,marginBottom:16}}>
            <span style={{color:C.white}}>Cognitive</span>
            <span style={{color:C.cyan}}>Lab</span>
          </h1>
          <p style={{fontSize:18,color:C.muted,maxWidth:480,margin:"0 auto 40px",lineHeight:1.6}}>
            Six research-grade experiments. Real measurements. Understand how your mind works.
          </p>
          {completed > 0 && (
            <div style={{display:"inline-block",background:C.surface,border:`1px solid ${C.border}`,borderRadius:12,padding:"8px 20px",marginBottom:32,fontSize:14,color:C.muted}}>
              ✓ {completed} of 6 experiments completed
              {completed === 6 && <span style={{color:C.green,marginLeft:8}}>— View dashboard below</span>}
            </div>
          )}
        </div>
      </div>

      {/* Grid */}
      <div style={{padding:"0 40px 80px",maxWidth:1100,margin:"0 auto",width:"100%"}}>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))",gap:20}}>
          {EXPERIMENTS.map(exp => {
            const done = !!results[exp.id];
            return (
              <button key={exp.id} onClick={()=>onStart(exp.id)} style={{
                background: C.card, border:`1px solid ${done ? exp.color+"44" : C.border}`,
                borderRadius:16, padding:28, textAlign:"left", cursor:"pointer",
                transition:"all 0.2s", position:"relative", overflow:"hidden",
              }}
                onMouseEnter={e=>{e.currentTarget.style.borderColor=exp.color+"88";e.currentTarget.style.transform="translateY(-2px)";}}
                onMouseLeave={e=>{e.currentTarget.style.borderColor=done?exp.color+"44":C.border;e.currentTarget.style.transform="translateY(0)";}}
              >
                {done && <div style={{position:"absolute",top:16,right:16,background:exp.color+"22",color:exp.color,fontSize:12,padding:"2px 10px",borderRadius:99,fontFamily:"JetBrains Mono,monospace"}}>DONE</div>}
                <div style={{fontSize:36,marginBottom:16}}>{exp.icon}</div>
                <div style={{fontWeight:600,fontSize:17,color:C.white,marginBottom:8}}>{exp.label}</div>
                <div style={{fontSize:14,color:C.muted,lineHeight:1.5,marginBottom:20}}>{exp.desc}</div>
                <div style={{display:"flex",alignItems:"center",gap:6,color:exp.color,fontSize:14,fontWeight:500}}>
                  <span>{done ? "Retake" : "Start"}</span>
                  <span>→</span>
                </div>
                <div style={{position:"absolute",bottom:0,left:0,height:2,width:done?"100%":"0%",background:exp.color,transition:"width 0.6s"}}/>
              </button>
            );
          })}
        </div>
        {completed === 6 && <Dashboard results={results}/>}
      </div>
    </div>
  );
}

// ─── SHELL ────────────────────────────────────────────────────────────────────
function Shell({ title, color="#00D4FF", children, onBack }) {
  return (
    <div style={{minHeight:"100vh",display:"flex",flexDirection:"column",animation:"fadeIn 0.4s ease"}}>
      <style>{css}</style>
      <header style={{display:"flex",alignItems:"center",gap:16,padding:"20px 32px",borderBottom:`1px solid ${C.border}`,background:C.surface}}>
        <button onClick={onBack} style={{background:"none",border:`1px solid ${C.border}`,color:C.muted,borderRadius:8,padding:"6px 14px",cursor:"pointer",fontSize:13,fontFamily:"JetBrains Mono,monospace"}}>← BACK</button>
        <span style={{fontWeight:600,color:C.white,fontSize:16}}>{title}</span>
        <div style={{marginLeft:"auto",width:8,height:8,borderRadius:"50%",background:color,boxShadow:`0 0 12px ${color}`}}/>
      </header>
      <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:32}}>
        {children}
      </div>
    </div>
  );
}

function Btn({onClick,children,color=C.cyan,disabled,style={}}) {
  return (
    <button onClick={onClick} disabled={disabled} style={{
      background:disabled?"transparent":color,color:disabled?C.muted:C.bg,
      border:`2px solid ${disabled?C.border:color}`,borderRadius:12,
      padding:"14px 32px",fontSize:16,fontWeight:700,cursor:disabled?"not-allowed":"pointer",
      transition:"all 0.15s",fontFamily:"Space Grotesk,sans-serif",
      boxShadow:disabled?"none":`0 0 20px ${color}44`,...style,
    }}
      onMouseEnter={e=>{if(!disabled){e.currentTarget.style.transform="scale(1.03)";}}}
      onMouseLeave={e=>{e.currentTarget.style.transform="scale(1)";}}
    >{children}</button>
  );
}

function StatBox({label,value,color=C.cyan,unit=""}) {
  return (
    <div style={{background:C.surface,border:`1px solid ${color}33`,borderRadius:12,padding:"20px 24px",textAlign:"center",minWidth:120}}>
      <div style={{fontFamily:"JetBrains Mono,monospace",fontSize:28,fontWeight:700,color,marginBottom:4}}>{value}<span style={{fontSize:14,color:C.muted}}>{unit}</span></div>
      <div style={{fontSize:12,color:C.muted,letterSpacing:1,textTransform:"uppercase"}}>{label}</div>
    </div>
  );
}

// ─── 1. REACTION TIME ─────────────────────────────────────────────────────────
function ReactionTime({ onDone, onBack }) {
  const [phase, setPhase] = useState("idle"); // idle | waiting | ready | result | done
  const [times, setTimes] = useState([]);
  const [startTs, setStartTs] = useState(null);
  const [lastTime, setLastTime] = useState(null);
  const timerRef = useRef();
  const TRIALS = 5;

  const startTrial = useCallback(() => {
    setPhase("waiting");
    const delay = 1500 + Math.random() * 2500;
    timerRef.current = setTimeout(() => {
      setStartTs(Date.now());
      setPhase("ready");
    }, delay);
  }, []);

  const handleClick = () => {
    if (phase === "idle") { startTrial(); return; }
    if (phase === "waiting") {
      clearTimeout(timerRef.current);
      setPhase("tooearly");
      setTimeout(() => startTrial(), 1200);
      return;
    }
    if (phase === "ready") {
      const t = Date.now() - startTs;
      setLastTime(t);
      const newTimes = [...times, t];
      setTimes(newTimes);
      if (newTimes.length >= TRIALS) {
        setPhase("done");
        const avg = Math.round(newTimes.reduce((a,b)=>a+b,0)/newTimes.length);
        const best = Math.min(...newTimes);
        const worst = Math.max(...newTimes);
        const std = Math.round(Math.sqrt(newTimes.map(x=>(x-avg)**2).reduce((a,b)=>a+b,0)/newTimes.length));
        onDone({ avg, best, worst, consistency: std, trials: newTimes });
      } else {
        setPhase("result");
        setTimeout(() => startTrial(), 1000);
      }
      return;
    }
  };

  const avg = times.length ? Math.round(times.reduce((a,b)=>a+b,0)/times.length) : null;
  const bgColor = phase==="ready" ? C.green : phase==="waiting" ? C.red+"22" : C.surface;

  return (
    <Shell title="Reaction Time" color={C.cyan} onBack={onBack}>
      <div style={{width:"100%",maxWidth:540,display:"flex",flexDirection:"column",gap:24,alignItems:"center"}}>
        <div style={{textAlign:"center"}}>
          <div style={{fontSize:14,color:C.muted,fontFamily:"JetBrains Mono,monospace",marginBottom:8}}>TRIAL {Math.min(times.length+1,TRIALS)} / {TRIALS}</div>
          <div style={{display:"flex",gap:6,justifyContent:"center"}}>
            {Array.from({length:TRIALS}).map((_,i)=>(
              <div key={i} style={{width:32,height:4,borderRadius:2,background:i<times.length?C.cyan:C.border}}/>
            ))}
          </div>
        </div>

        <div onClick={handleClick} style={{
          width:300,height:300,borderRadius:"50%",
          background:bgColor,border:`3px solid ${phase==="ready"?C.green:C.border}`,
          display:"flex",alignItems:"center",justifyContent:"center",
          cursor:"pointer",transition:"all 0.15s",userSelect:"none",
          boxShadow:phase==="ready"?`0 0 60px ${C.green}66`:"none",
        }}>
          <div style={{textAlign:"center"}}>
            {phase==="idle" && <><div style={{fontSize:36,marginBottom:8}}>⚡</div><div style={{color:C.muted,fontSize:15}}>Click to begin</div></>}
            {phase==="waiting" && <div style={{color:C.red,fontSize:14,fontFamily:"JetBrains Mono,monospace"}}>WAIT...</div>}
            {phase==="ready" && <div style={{color:C.bg,fontSize:18,fontWeight:700,fontFamily:"JetBrains Mono,monospace"}}>CLICK!</div>}
            {phase==="result" && <div style={{color:C.cyan,fontSize:22,fontFamily:"JetBrains Mono,monospace",fontWeight:700}}>{lastTime}ms</div>}
            {phase==="tooearly" && <div style={{color:C.red,fontSize:14,fontFamily:"JetBrains Mono,monospace"}}>Too early!</div>}
            {phase==="done" && <div style={{color:C.green,fontSize:14,fontFamily:"JetBrains Mono,monospace"}}>Complete!</div>}
          </div>
        </div>

        {times.length > 0 && (
          <div style={{display:"flex",gap:12,flexWrap:"wrap",justifyContent:"center"}}>
            <StatBox label="Average" value={avg} unit="ms" color={C.cyan}/>
            <StatBox label="Best" value={Math.min(...times)} unit="ms" color={C.green}/>
            {times.length >= TRIALS && <StatBox label="Worst" value={Math.max(...times)} unit="ms" color={C.red}/>}
          </div>
        )}
      </div>
    </Shell>
  );
}

// ─── 2. STROOP TEST ───────────────────────────────────────────────────────────
const STROOP_COLORS = [
  {word:"RED",color:"#FF4D6D"},
  {word:"BLUE",color:"#4D9FFF"},
  {word:"GREEN",color:"#00FF9C"},
  {word:"YELLOW",color:"#FFD166"},
  {word:"PURPLE",color:"#C77DFF"},
];

function StroopTest({ onDone, onBack }) {
  const [trials, setTrials] = useState([]);
  const [current, setCurrent] = useState(null);
  const [phase, setPhase] = useState("intro");
  const [startTs, setStartTs] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const TOTAL = 12;

  const nextTrial = useCallback((prevTrials=[]) => {
    const wordIdx = Math.floor(Math.random()*STROOP_COLORS.length);
    let colorIdx = Math.floor(Math.random()*STROOP_COLORS.length);
    const congruent = Math.random() < 0.4;
    if (congruent) colorIdx = wordIdx;
    else while(colorIdx===wordIdx) colorIdx=Math.floor(Math.random()*STROOP_COLORS.length);
    setCurrent({word:STROOP_COLORS[wordIdx].word, inkColor:STROOP_COLORS[colorIdx].color, correctColor:STROOP_COLORS[colorIdx], congruent});
    setStartTs(Date.now());
    setFeedback(null);
    if (prevTrials.length < TOTAL) setPhase("trial");
  }, []);

  const handleAnswer = (chosen) => {
    if (phase !== "trial") return;
    const rt = Date.now() - startTs;
    const correct = chosen.word === current.correctColor.word;
    const newTrials = [...trials, {rt, correct, congruent:current.congruent}];
    setTrials(newTrials);
    setFeedback(correct);
    setTimeout(() => {
      if (newTrials.length >= TOTAL) {
        const acc = Math.round(newTrials.filter(t=>t.correct).length/newTrials.length*100);
        const avgRt = Math.round(newTrials.reduce((a,b)=>a+b.rt,0)/newTrials.length);
        const congruentTrials = newTrials.filter(t=>t.congruent);
        const incongruentTrials = newTrials.filter(t=>!t.congruent);
        const avgCon = congruentTrials.length ? Math.round(congruentTrials.reduce((a,b)=>a+b.rt,0)/congruentTrials.length) : 0;
        const avgIncon = incongruentTrials.length ? Math.round(incongruentTrials.reduce((a,b)=>a+b.rt,0)/incongruentTrials.length) : 0;
        onDone({accuracy:acc, avgRt, stroopEffect: avgIncon-avgCon, trials:newTrials});
      } else {
        nextTrial(newTrials);
      }
    }, 600);
  };

  // Shuffle answer options
  const options = current ? [...STROOP_COLORS].sort(()=>Math.random()-0.5).slice(0,4) : [];
  const hasCorrect = options.some(o=>o.word===current?.correctColor.word);
  if (!hasCorrect && current) options[Math.floor(Math.random()*4)] = current.correctColor;

  return (
    <Shell title="Stroop Test" color={C.lavender} onBack={onBack}>
      {phase==="intro" ? (
        <div style={{textAlign:"center",maxWidth:420}}>
          <div style={{fontSize:48,marginBottom:16}}>🎨</div>
          <h2 style={{fontSize:24,fontWeight:700,marginBottom:12}}>Stroop Test</h2>
          <p style={{color:C.muted,marginBottom:12,lineHeight:1.7}}>You'll see a word written in a colored ink. Click the button matching the <strong style={{color:C.white}}>ink color</strong>, not what the word says.</p>
          <div style={{background:C.surface,borderRadius:12,padding:20,marginBottom:24,fontSize:32,fontFamily:"JetBrains Mono,monospace",color:"#4D9FFF",fontWeight:700}}>RED</div>
          <p style={{color:C.muted,marginBottom:24,fontSize:14}}>↑ You'd click "BLUE" here (the ink color)</p>
          <Btn onClick={()=>nextTrial([])} color={C.lavender}>Begin ({TOTAL} trials)</Btn>
        </div>
      ) : (
        <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:32,width:"100%",maxWidth:500}}>
          <div style={{display:"flex",gap:6}}>
            {Array.from({length:TOTAL}).map((_,i)=>{
              const t = trials[i];
              return <div key={i} style={{width:24,height:4,borderRadius:2,background:t===undefined?C.border:t.correct?C.green:C.red}}/>;
            })}
          </div>

          <div style={{position:"relative",textAlign:"center",height:140,display:"flex",alignItems:"center",justifyContent:"center"}}>
            {current && (
              <div style={{fontFamily:"JetBrains Mono,monospace",fontSize:"clamp(48px,10vw,80px)",fontWeight:700,color:current.inkColor,
                filter:feedback===true?"drop-shadow(0 0 20px "+current.inkColor+")":"none",transition:"filter 0.2s"}}>
                {current.word}
              </div>
            )}
            {feedback !== null && (
              <div style={{position:"absolute",top:-32,left:"50%",transform:"translateX(-50%)",fontSize:24}}>
                {feedback ? "✓" : "✗"}
              </div>
            )}
          </div>

          <div style={{fontSize:13,color:C.muted,fontFamily:"JetBrains Mono,monospace"}}>WHAT COLOR IS THE INK?</div>

          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,width:"100%"}}>
            {options.map((opt)=>(
              <button key={opt.word} onClick={()=>handleAnswer(opt)} style={{
                background:C.surface,border:`2px solid ${opt.color}44`,borderRadius:12,
                padding:"16px",fontSize:16,fontFamily:"JetBrains Mono,monospace",fontWeight:700,
                color:opt.color,cursor:"pointer",transition:"all 0.15s",
              }}
                onMouseEnter={e=>{e.currentTarget.style.background=opt.color+"22";e.currentTarget.style.borderColor=opt.color;}}
                onMouseLeave={e=>{e.currentTarget.style.background=C.surface;e.currentTarget.style.borderColor=opt.color+"44";}}
              >{opt.word}</button>
            ))}
          </div>

          <div style={{fontSize:13,color:C.muted,fontFamily:"JetBrains Mono,monospace"}}>{trials.length}/{TOTAL} trials • {trials.filter(t=>t.correct).length} correct</div>
        </div>
      )}
    </Shell>
  );
}

// ─── 3. MEMORY TEST ───────────────────────────────────────────────────────────
const EMOJI_POOL = ["🍎","🍌","🚗","🐱","⭐","🏠","🎸","🌈","🦋","🎩","🍕","⚽","🎪","🦊","🌙","🎯","🏆","🎨","🦁","🍦","🚀","🎭","🌺","🐬","🎲"];

function MemoryTest({ onDone, onBack }) {
  const [level, setLevel] = useState(0);
  const [phase, setPhase] = useState("show"); // show | hide | answer | result
  const [shown, setShown] = useState([]);
  const [selected, setSelected] = useState([]);
  const [options, setOptions] = useState([]);
  const [results, setResults] = useState([]);
  const LEVELS = [5, 7, 10];

  const startLevel = useCallback((lvl) => {
    const count = LEVELS[lvl];
    const seq = [...EMOJI_POOL].sort(()=>Math.random()-0.5).slice(0,count);
    setShown(seq);
    setSelected([]);
    setPhase("show");
    // Build answer options (correct + distractors)
    const distractors = EMOJI_POOL.filter(e=>!seq.includes(e)).sort(()=>Math.random()-0.5).slice(0,count+3);
    const allOptions = [...seq,...distractors].sort(()=>Math.random()-0.5);
    setOptions(allOptions);
    setTimeout(()=>setPhase("hide"),4000+(lvl*500));
  }, []);

  useEffect(()=>{ startLevel(0); }, []);

  const toggleSelect = (e) => {
    setSelected(prev => prev.includes(e) ? prev.filter(x=>x!==e) : [...prev,e]);
  };

  const submitAnswers = () => {
    const correct = shown.filter(e=>selected.includes(e)).length;
    const false_alarms = selected.filter(e=>!shown.includes(e)).length;
    const score = correct - false_alarms;
    const newResults = [...results, {level:LEVELS[level], correct, total:shown.length, score}];
    setResults(newResults);
    setPhase("result");
    setTimeout(()=>{
      if (level < LEVELS.length-1) {
        setLevel(l=>l+1);
        startLevel(level+1);
      } else {
        const totalCorrect = newResults.reduce((a,b)=>a+b.correct,0);
        const totalItems = newResults.reduce((a,b)=>a+b.total,0);
        onDone({accuracy:Math.round(totalCorrect/totalItems*100), levels:newResults, spanLevel:LEVELS[level]});
      }
    }, 2000);
  };

  return (
    <Shell title="Memory Test" color={C.green} onBack={onBack}>
      <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:28,width:"100%",maxWidth:560}}>
        <div style={{textAlign:"center"}}>
          <div style={{fontFamily:"JetBrains Mono,monospace",fontSize:13,color:C.muted,marginBottom:4}}>LEVEL {level+1} / {LEVELS.length} — {LEVELS[level]} ITEMS</div>
          <div style={{display:"flex",gap:8,justifyContent:"center"}}>
            {LEVELS.map((_,i)=><div key={i} style={{width:40,height:3,borderRadius:2,background:i<level?C.green:i===level?C.green+"66":C.border}}/>)}
          </div>
        </div>

        {phase==="show" && (
          <div style={{textAlign:"center"}}>
            <div style={{fontSize:13,color:C.muted,marginBottom:16,fontFamily:"JetBrains Mono,monospace"}}>MEMORIZE THESE</div>
            <div style={{display:"flex",flexWrap:"wrap",gap:12,justifyContent:"center",maxWidth:400}}>
              {shown.map((e,i)=><div key={i} style={{fontSize:36,animation:"fadeIn 0.3s ease both",animationDelay:`${i*60}ms`}}>{e}</div>)}
            </div>
            <div style={{marginTop:24,color:C.muted,fontSize:13}}>They'll disappear in a few seconds...</div>
          </div>
        )}

        {phase==="hide" && (
          <div style={{textAlign:"center"}}>
            <div style={{fontSize:13,color:C.muted,marginBottom:24,fontFamily:"JetBrains Mono,monospace"}}>SELECT THE ITEMS YOU SAW</div>
            <div style={{display:"flex",flexWrap:"wrap",gap:10,justifyContent:"center",maxWidth:440,marginBottom:24}}>
              {options.map((e,i)=>(
                <button key={i} onClick={()=>toggleSelect(e)} style={{
                  fontSize:28,padding:10,borderRadius:12,cursor:"pointer",
                  background:selected.includes(e)?C.green+"22":C.surface,
                  border:`2px solid ${selected.includes(e)?C.green:C.border}`,
                  transition:"all 0.15s",
                }}>{e}</button>
              ))}
            </div>
            <Btn onClick={submitAnswers} color={C.green} disabled={selected.length===0}>
              Submit ({selected.length} selected)
            </Btn>
          </div>
        )}

        {phase==="result" && (
          <div style={{textAlign:"center"}}>
            {results.length > 0 && (
              <>
                <div style={{fontSize:48,marginBottom:8}}>
                  {results[results.length-1].correct >= LEVELS[level]*0.8 ? "🎉" : "💡"}
                </div>
                <div style={{fontFamily:"JetBrains Mono,monospace",fontSize:22,color:C.green}}>
                  {results[results.length-1].correct}/{LEVELS[level]} correct
                </div>
                <div style={{color:C.muted,marginTop:8,fontSize:14}}>
                  {level < LEVELS.length-1 ? "Next level loading..." : "Test complete!"}
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </Shell>
  );
}

// ─── 4. GO / NO-GO ───────────────────────────────────────────────────────────
function GoNoGo({ onDone, onBack }) {
  const [phase, setPhase] = useState("intro");
  const [shape, setShape] = useState(null);
  const [trials, setTrials] = useState([]);
  const [feedback, setFeedback] = useState(null);
  const trialRef = useRef({active:false, isGo:false, startTs:0, responded:false});
  const timerRef = useRef();
  const TOTAL = 20;

  const runTrial = useCallback((prevTrials=[]) => {
    const isGo = Math.random() < 0.7;
    trialRef.current = {active:true, isGo, startTs:Date.now(), responded:false};
    setShape(isGo ? "circle" : "square");
    setFeedback(null);

    timerRef.current = setTimeout(() => {
      if (!trialRef.current.responded) {
        const newTrials = [...prevTrials, {isGo, responded:false, correct:!isGo, rt:null, type:isGo?"miss":"correct_inhibit"}];
        if (isGo) setFeedback("miss");
        trialRef.current.active = false;
        setShape(null);
        if (newTrials.length >= TOTAL) {
          finalize(newTrials);
        } else {
          setTimeout(()=>runTrial(newTrials), 400);
        }
        setTrials(newTrials);
      }
    }, 900);
  }, []);

  const finalize = (trialArr) => {
    const goes = trialArr.filter(t=>t.isGo);
    const nogos = trialArr.filter(t=>!t.isGo);
    const hits = goes.filter(t=>t.responded&&t.correct).length;
    const misses = goes.filter(t=>!t.responded).length;
    const falseAlarms = nogos.filter(t=>t.responded).length;
    const correctInhibits = nogos.filter(t=>!t.responded).length;
    const avgRt = goes.filter(t=>t.rt).length ? Math.round(goes.filter(t=>t.rt).reduce((a,b)=>a+(b.rt||0),0)/goes.filter(t=>t.rt).length) : 0;
    onDone({hits, misses, falseAlarms, correctInhibits, avgRt, impulsivity: Math.round(falseAlarms/nogos.length*100)});
  };

  const handleResponse = useCallback(() => {
    if (!trialRef.current.active || trialRef.current.responded) return;
    clearTimeout(timerRef.current);
    const rt = Date.now() - trialRef.current.startTs;
    const isGo = trialRef.current.isGo;
    trialRef.current.responded = true;
    trialRef.current.active = false;
    const correct = isGo;
    setFeedback(correct ? "hit" : "false_alarm");
    const newTrials = [...trials, {isGo, responded:true, correct, rt, type:isGo?"hit":"false_alarm"}];
    setTrials(newTrials);
    setShape(null);
    if (newTrials.length >= TOTAL) {
      setTimeout(()=>finalize(newTrials), 600);
    } else {
      setTimeout(()=>runTrial(newTrials), 600);
    }
  }, [trials, runTrial]);

  useEffect(()=>{
    const handler = (e)=>{ if(e.code==="Space"){ e.preventDefault(); handleResponse(); }};
    window.addEventListener("keydown",handler);
    return ()=>window.removeEventListener("keydown",handler);
  },[handleResponse]);

  const correct = trials.filter(t=>t.correct).length;
  const pct = trials.length ? Math.round(correct/trials.length*100) : 0;

  return (
    <Shell title="Go / No-Go" color={C.yellow} onBack={onBack}>
      {phase==="intro" ? (
        <div style={{textAlign:"center",maxWidth:400}}>
          <div style={{fontSize:48,marginBottom:16}}>🎯</div>
          <h2 style={{fontSize:24,fontWeight:700,marginBottom:16}}>Go / No-Go</h2>
          <div style={{display:"flex",gap:20,justifyContent:"center",marginBottom:24}}>
            <div style={{background:C.surface,borderRadius:12,padding:20,textAlign:"center"}}>
              <div style={{width:60,height:60,borderRadius:"50%",background:C.green,margin:"0 auto 8px"}}/>
              <div style={{fontSize:13,color:C.muted}}>Circle → <strong style={{color:C.white}}>PRESS</strong></div>
            </div>
            <div style={{background:C.surface,borderRadius:12,padding:20,textAlign:"center"}}>
              <div style={{width:60,height:60,background:C.red,margin:"0 auto 8px",borderRadius:6}}/>
              <div style={{fontSize:13,color:C.muted}}>Square → <strong style={{color:C.white}}>HOLD</strong></div>
            </div>
          </div>
          <p style={{color:C.muted,marginBottom:24,fontSize:14}}>Press <kbd style={{background:C.surface,border:`1px solid ${C.border}`,padding:"2px 8px",borderRadius:4}}>SPACE</kbd> or click for circles. {TOTAL} trials total.</p>
          <Btn onClick={()=>{setPhase("running");setTimeout(()=>runTrial([]),300);}} color={C.yellow}>Start</Btn>
        </div>
      ) : (
        <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:28,width:"100%",maxWidth:400}}>
          <div style={{display:"flex",gap:4,flexWrap:"wrap",justifyContent:"center"}}>
            {Array.from({length:TOTAL}).map((_,i)=>{
              const t = trials[i];
              return <div key={i} style={{width:20,height:4,borderRadius:2,background:t===undefined?C.border:t.correct?C.green:C.red}}/>;
            })}
          </div>

          <div onClick={handleResponse} style={{
            width:180,height:180,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",
          }}>
            {shape==="circle" && (
              <div style={{width:160,height:160,borderRadius:"50%",background:C.green,boxShadow:`0 0 40px ${C.green}66`,animation:"float 0s"}}/>
            )}
            {shape==="square" && (
              <div style={{width:140,height:140,background:C.red,borderRadius:12,boxShadow:`0 0 40px ${C.red}66`}}/>
            )}
            {!shape && (
              <div style={{width:20,height:20,borderRadius:"50%",background:C.border}}/>
            )}
          </div>

          <div style={{textAlign:"center",fontFamily:"JetBrains Mono,monospace",fontSize:14,color:
            feedback==="hit"?C.green:feedback==="false_alarm"?C.red:feedback==="miss"?C.yellow:C.muted}}>
            {feedback==="hit"&&"✓ Good!"}{feedback==="false_alarm"&&"✗ False alarm"}{feedback==="miss"&&"! Missed"}{!feedback&&"—"}
          </div>

          <div style={{display:"flex",gap:12}}>
            <StatBox label="Correct" value={correct} color={C.green}/>
            <StatBox label="Accuracy" value={pct} unit="%" color={C.yellow}/>
            <StatBox label="Done" value={`${trials.length}/${TOTAL}`} color={C.muted}/>
          </div>

          <div style={{fontSize:13,color:C.muted}}>Press <kbd style={{background:C.surface,border:`1px solid ${C.border}`,padding:"2px 8px",borderRadius:4}}>SPACE</kbd> or click the shape</div>
        </div>
      )}
    </Shell>
  );
}

// ─── 5. VISUAL SEARCH ────────────────────────────────────────────────────────
function VisualSearch({ onDone, onBack }) {
  const [trials, setTrials] = useState([]);
  const [grid, setGrid] = useState([]);
  const [target, setTarget] = useState(null);
  const [targetPos, setTargetPos] = useState(null);
  const [startTs, setStartTs] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [phase, setPhase] = useState("intro");
  const SETS = [
    {distractor:"O", odd:"Q", label:"Letters"},
    {distractor:"▲", odd:"▼", label:"Triangles"},
    {distractor:"□", odd:"■", label:"Squares"},
    {distractor:"○", odd:"●", label:"Circles"},
    {distractor:"—", odd:"|", label:"Lines"},
    {distractor:"✕", odd:"✓", label:"Marks"},
  ];
  const SIZES = [16,25,36];
  const TOTAL = SIZES.length * 2;

  const nextTrial = useCallback((prevTrials=[]) => {
    const trialIdx = prevTrials.length;
    const sizeIdx = Math.floor(trialIdx/2);
    const size = SIZES[Math.min(sizeIdx, SIZES.length-1)];
    const set = SETS[Math.floor(Math.random()*SETS.length)];
    const oddPos = Math.floor(Math.random()*size);
    const newGrid = Array.from({length:size},(_,i)=>i===oddPos?set.odd:set.distractor);
    setGrid(newGrid);
    setTarget(set.odd);
    setTargetPos(oddPos);
    setStartTs(Date.now());
    setFeedback(null);
    setPhase("trial");
  },[]);

  const handleClick = (idx) => {
    if (phase!=="trial") return;
    const rt = Date.now()-startTs;
    const correct = idx===targetPos;
    setFeedback({correct,idx});
    const newTrials = [...trials, {rt, correct, gridSize:grid.length}];
    setTrials(newTrials);
    setTimeout(()=>{
      if(newTrials.length>=TOTAL) {
        const acc = Math.round(newTrials.filter(t=>t.correct).length/newTrials.length*100);
        const avgRt = Math.round(newTrials.reduce((a,b)=>a+b.rt,0)/newTrials.length);
        onDone({accuracy:acc, avgRt, trials:newTrials});
      } else {
        nextTrial(newTrials);
      }
    }, 700);
  };

  const cols = grid.length<=16?4:grid.length<=25?5:6;

  return (
    <Shell title="Visual Search" color="#FF8C42" onBack={onBack}>
      {phase==="intro" ? (
        <div style={{textAlign:"center",maxWidth:400}}>
          <div style={{fontSize:48,marginBottom:16}}>🔍</div>
          <h2 style={{fontSize:24,fontWeight:700,marginBottom:12}}>Visual Search</h2>
          <p style={{color:C.muted,marginBottom:24,lineHeight:1.7}}>Find the item that's different from all others and click it as fast as you can. Grids get larger over time.</p>
          <Btn onClick={()=>nextTrial([])} color="#FF8C42">Begin</Btn>
        </div>
      ) : (
        <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:24,width:"100%",maxWidth:500}}>
          <div style={{fontFamily:"JetBrains Mono,monospace",fontSize:13,color:C.muted}}>
            FIND THE ODD ONE — Trial {trials.length+1}/{TOTAL}
          </div>
          <div style={{display:"grid",gap:4,gridTemplateColumns:`repeat(${cols},1fr)`,background:C.surface,padding:20,borderRadius:16,border:`1px solid ${C.border}`}}>
            {grid.map((char,i)=>{
              const isTarget = i===targetPos;
              const wasClicked = feedback&&feedback.idx===i;
              return (
                <button key={i} onClick={()=>handleClick(i)} style={{
                  width:36,height:36,display:"flex",alignItems:"center",justifyContent:"center",
                  fontSize:16,fontFamily:"JetBrains Mono,monospace",
                  background: wasClicked?(feedback.correct?C.green+"22":C.red+"22"):"transparent",
                  border:`1px solid ${wasClicked?(feedback.correct?C.green:C.red):C.border+"55"}`,
                  borderRadius:6,cursor:"pointer",color:C.text,
                  transition:"all 0.1s",
                }}>{char}</button>
              );
            })}
          </div>
          {feedback && (
            <div style={{fontFamily:"JetBrains Mono,monospace",color:feedback.correct?C.green:C.red,fontSize:14}}>
              {feedback.correct?"✓ Found it!":"✗ Wrong item"}
            </div>
          )}
          <div style={{display:"flex",gap:12}}>
            <StatBox label="Correct" value={trials.filter(t=>t.correct).length} color="#FF8C42"/>
            <StatBox label="Trials" value={`${trials.length}/${TOTAL}`} color={C.muted}/>
          </div>
        </div>
      )}
    </Shell>
  );
}

// ─── 6. ATTENTION ─────────────────────────────────────────────────────────────
function AttentionTask({ onDone, onBack }) {
  const [phase, setPhase] = useState("intro");
  const [sequence, setSequence] = useState([]);
  const [showing, setShowing] = useState(null);
  const [target, setTarget] = useState(null);
  const [questionIdx, setQuestionIdx] = useState(null);
  const [answer, setAnswer] = useState("");
  const [trials, setTrials] = useState([]);
  const timerRef = useRef();

  const ROUNDS = 5;

  const runRound = useCallback((prevTrials=[]) => {
    const len = 6 + prevTrials.length;
    const seq = Array.from({length:len},()=>Math.floor(Math.random()*9)+1);
    const qIdx = 1 + Math.floor(Math.random()*(len-2));
    setSequence(seq);
    setTarget(seq[qIdx]);
    setQuestionIdx(qIdx);
    setShowing(null);
    setAnswer("");
    let i = 0;
    const show = () => {
      if(i < seq.length) {
        setShowing(seq[i]);
        i++;
        timerRef.current = setTimeout(show, 700);
      } else {
        setShowing(null);
        setPhase("question");
      }
    };
    setPhase("stream");
    timerRef.current = setTimeout(show, 400);
  }, []);

  const submitAnswer = () => {
    const correct = parseInt(answer) === target;
    const newTrials = [...trials, {correct, target, given: parseInt(answer)}];
    setTrials(newTrials);
    if(newTrials.length >= ROUNDS) {
      const acc = Math.round(newTrials.filter(t=>t.correct).length/ROUNDS*100);
      onDone({accuracy:acc, trials:newTrials});
    } else {
      setPhase("feedback");
      setTimeout(()=>runRound(newTrials), 1000);
    }
  };

  return (
    <Shell title="Attention" color={C.red} onBack={onBack}>
      {phase==="intro" && (
        <div style={{textAlign:"center",maxWidth:400}}>
          <div style={{fontSize:48,marginBottom:16}}>📡</div>
          <h2 style={{fontSize:24,fontWeight:700,marginBottom:12}}>Attention Task</h2>
          <p style={{color:C.muted,marginBottom:24,lineHeight:1.7}}>Numbers will flash on screen one at a time. After the sequence ends, you'll be asked to recall a specific number from the stream.</p>
          <Btn onClick={()=>runRound([])} color={C.red}>Begin</Btn>
        </div>
      )}

      {phase==="stream" && (
        <div style={{textAlign:"center"}}>
          <div style={{fontFamily:"JetBrains Mono,monospace",fontSize:12,color:C.muted,marginBottom:40,letterSpacing:2}}>WATCH CAREFULLY</div>
          <div style={{
            fontFamily:"JetBrains Mono,monospace",fontSize:120,fontWeight:700,color:C.red,
            minWidth:160,minHeight:160,display:"flex",alignItems:"center",justifyContent:"center",
            textShadow:`0 0 40px ${C.red}88`,animation:"fadeIn 0.1s ease",
          }}>{showing??""}</div>
        </div>
      )}

      {phase==="question" && (
        <div style={{textAlign:"center",maxWidth:360}}>
          <div style={{fontFamily:"JetBrains Mono,monospace",fontSize:13,color:C.muted,marginBottom:16}}>
            WHAT WAS NUMBER {questionIdx+1} IN THE SEQUENCE?
          </div>
          <input type="number" min="1" max="9" value={answer}
            onChange={e=>setAnswer(e.target.value)}
            onKeyDown={e=>{if(e.key==="Enter"&&answer)submitAnswer();}}
            autoFocus
            style={{
              background:C.surface,border:`2px solid ${C.red}`,borderRadius:12,
              padding:"16px 24px",fontSize:36,fontFamily:"JetBrains Mono,monospace",
              color:C.white,textAlign:"center",width:120,marginBottom:24,outline:"none",
            }}
          />
          <br/>
          <Btn onClick={submitAnswer} disabled={!answer} color={C.red}>Submit</Btn>
        </div>
      )}

      {phase==="feedback" && (
        <div style={{textAlign:"center"}}>
          {trials.length > 0 && (
            <div style={{fontFamily:"JetBrains Mono,monospace",fontSize:22,
              color:trials[trials.length-1].correct?C.green:C.red}}>
              {trials[trials.length-1].correct?"✓ Correct!":
                `✗ It was ${trials[trials.length-1].target}`}
            </div>
          )}
          <div style={{color:C.muted,marginTop:8,fontSize:14}}>Loading next round...</div>
        </div>
      )}

      {phase!=="intro" && (
        <div style={{marginTop:24,fontFamily:"JetBrains Mono,monospace",fontSize:13,color:C.muted}}>
          Round {trials.length+1}/{ROUNDS} • {trials.filter(t=>t.correct).length} correct
        </div>
      )}
    </Shell>
  );
}

// ─── DASHBOARD ────────────────────────────────────────────────────────────────
function scoreReaction(r) { return r.avg<200?100:r.avg<250?90:r.avg<300?80:r.avg<400?65:50; }
function scoreStroop(r) { return r.accuracy; }
function scoreMemory(r) { return r.accuracy; }
function scoreGoNoGo(r) { const imp=r.impulsivity||0; return Math.max(0,100-imp*2); }
function scoreVisual(r) { return r.accuracy; }
function scoreAttention(r) { return r.accuracy; }

function Dashboard({ results }) {
  const hasAll = EXPERIMENTS.every(e=>results[e.id]);
  if (!hasAll) return null;

  const scores = {
    reaction: scoreReaction(results.reaction),
    stroop: scoreStroop(results.stroop),
    memory: scoreMemory(results.memory),
    gonogo: scoreGoNoGo(results.gonogo),
    visual: scoreVisual(results.visual),
    attention: scoreAttention(results.attention),
  };
  const overall = Math.round(Object.values(scores).reduce((a,b)=>a+b,0)/6);

  const radarData = [
    {subject:"Speed", score:scores.reaction},
    {subject:"Control", score:scores.stroop},
    {subject:"Memory", score:scores.memory},
    {subject:"Inhibition", score:scores.gonogo},
    {subject:"Vision", score:scores.visual},
    {subject:"Attention", score:scores.attention},
  ];

  const rtData = results.reaction.trials?.map((rt,i)=>({trial:i+1,ms:rt})) || [];

  return (
    <div style={{marginTop:60,animation:"fadeIn 0.6s ease"}}>
      <div style={{display:"flex",alignItems:"center",gap:16,marginBottom:32}}>
        <div style={{width:4,height:32,background:C.cyan,borderRadius:2}}/>
        <h2 style={{fontSize:24,fontWeight:700}}>Cognitive Profile</h2>
      </div>

      {/* Overall Score */}
      <div style={{background:`linear-gradient(135deg,${C.cyan}11,${C.lavender}11)`,border:`1px solid ${C.cyan}33`,borderRadius:20,padding:"32px 40px",marginBottom:24,display:"flex",alignItems:"center",gap:32,flexWrap:"wrap"}}>
        <div style={{textAlign:"center"}}>
          <div style={{fontFamily:"JetBrains Mono,monospace",fontSize:72,fontWeight:700,color:C.cyan,lineHeight:1}}>{overall}</div>
          <div style={{fontSize:13,color:C.muted,letterSpacing:2,marginTop:4}}>OVERALL SCORE</div>
        </div>
        <div style={{flex:1,minWidth:200}}>
          <div style={{fontSize:20,fontWeight:600,marginBottom:4}}>
            {overall>=90?"Exceptional":overall>=80?"Above Average":overall>=65?"Average":"Developing"}
          </div>
          <div style={{color:C.muted,lineHeight:1.6,fontSize:15}}>
            {overall>=80 ? "Your cognitive performance is well above the typical range. Strong processing speed and attentional control." : 
             "Your results show a solid cognitive baseline with some areas for development through practice."}
          </div>
        </div>
      </div>

      {/* Score Cards */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(160px,1fr))",gap:12,marginBottom:24}}>
        {[
          {label:"Reaction", value:results.reaction.avg+"ms", score:scores.reaction, color:C.cyan},
          {label:"Memory", value:results.memory.accuracy+"%", score:scores.memory, color:C.green},
          {label:"Attention", value:scores.attention+"%", score:scores.attention, color:C.red},
          {label:"Impulse Control", value:(100-results.gonogo.impulsivity)+"%", score:scores.gonogo, color:C.yellow},
          {label:"Visual Search", value:results.visual.accuracy+"%", score:scores.visual, color:"#FF8C42"},
          {label:"Stroop", value:results.stroop.accuracy+"%", score:scores.stroop, color:C.lavender},
        ].map(item=>(
          <div key={item.label} style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:14,padding:"18px 16px",position:"relative",overflow:"hidden"}}>
            <div style={{position:"absolute",bottom:0,left:0,height:3,width:`${item.score}%`,background:item.color,transition:"width 1s"}}/>
            <div style={{fontFamily:"JetBrains Mono,monospace",fontSize:20,fontWeight:700,color:item.color,marginBottom:4}}>{item.value}</div>
            <div style={{fontSize:12,color:C.muted,textTransform:"uppercase",letterSpacing:1}}>{item.label}</div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:20,marginBottom:24,flexWrap:"wrap"}}>
        <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:16,padding:24,minWidth:280}}>
          <div style={{fontSize:14,fontWeight:600,marginBottom:16,color:C.white}}>Cognitive Radar</div>
          <ResponsiveContainer width="100%" height={220}>
            <RadarChart data={radarData}>
              <PolarGrid stroke={C.border}/>
              <PolarAngleAxis dataKey="subject" tick={{fill:C.muted,fontSize:12,fontFamily:"Space Grotesk"}}/>
              <Radar name="Score" dataKey="score" stroke={C.cyan} fill={C.cyan} fillOpacity={0.15} strokeWidth={2}/>
            </RadarChart>
          </ResponsiveContainer>
        </div>
        <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:16,padding:24,minWidth:280}}>
          <div style={{fontSize:14,fontWeight:600,marginBottom:16,color:C.white}}>Reaction Times (ms)</div>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={rtData}>
              <CartesianGrid strokeDasharray="3 3" stroke={C.border}/>
              <XAxis dataKey="trial" tick={{fill:C.muted,fontSize:11}} label={{value:"Trial",position:"insideBottom",offset:-2,fill:C.muted,fontSize:11}}/>
              <YAxis tick={{fill:C.muted,fontSize:11}}/>
              <Tooltip contentStyle={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:8,color:C.text,fontSize:13}}/>
              <Line type="monotone" dataKey="ms" stroke={C.cyan} strokeWidth={2} dot={{fill:C.cyan,r:4}} activeDot={{r:6}}/>
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Stroop effect highlight */}
      <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:16,padding:24}}>
        <div style={{fontSize:14,fontWeight:600,marginBottom:16,color:C.white}}>Detailed Insights</div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))",gap:12}}>
          {[
            {label:"Stroop Interference Effect", value:`+${results.stroop.stroopEffect||0}ms`, desc:"RT difference for incongruent vs congruent trials", color:C.lavender},
            {label:"False Alarm Rate", value:`${results.gonogo.impulsivity||0}%`, desc:"Percentage of No-Go trials where you responded", color:C.yellow},
            {label:"Memory Span Reached", value:`${results.memory.spanLevel||5} items`, desc:"Highest item count level attempted", color:C.green},
            {label:"Visual Search Avg RT", value:`${results.visual.avgRt||0}ms`, desc:"Average time to locate the target", color:"#FF8C42"},
          ].map(item=>(
            <div key={item.label} style={{background:C.surface,borderRadius:12,padding:16,borderLeft:`3px solid ${item.color}`}}>
              <div style={{fontFamily:"JetBrains Mono,monospace",fontSize:18,fontWeight:700,color:item.color,marginBottom:4}}>{item.value}</div>
              <div style={{fontSize:13,fontWeight:600,color:C.white,marginBottom:4}}>{item.label}</div>
              <div style={{fontSize:12,color:C.muted,lineHeight:1.5}}>{item.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── APP ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [screen, setScreen] = useState("home");
  const [results, setResults] = useState({});

  const handleDone = (id, data) => {
    setResults(prev => ({...prev, [id]: data}));
    setScreen("home");
  };

  return (
    <>
      <style>{css}</style>
      {screen === "home" && <Home onStart={setScreen} results={results}/>}
      {screen === "reaction" && <ReactionTime onDone={d=>handleDone("reaction",d)} onBack={()=>setScreen("home")}/>}
      {screen === "stroop" && <StroopTest onDone={d=>handleDone("stroop",d)} onBack={()=>setScreen("home")}/>}
      {screen === "memory" && <MemoryTest onDone={d=>handleDone("memory",d)} onBack={()=>setScreen("home")}/>}
      {screen === "gonogo" && <GoNoGo onDone={d=>handleDone("gonogo",d)} onBack={()=>setScreen("home")}/>}
      {screen === "visual" && <VisualSearch onDone={d=>handleDone("visual",d)} onBack={()=>setScreen("home")}/>}
      {screen === "attention" && <AttentionTask onDone={d=>handleDone("attention",d)} onBack={()=>setScreen("home")}/>}
    </>
  );
}
