import React,{useEffect,useRef,useState} from "react";
import {createRoot} from "react-dom/client";
import "./styles.css";

declare global{interface Window{yulia:{open:(target:string)=>Promise<boolean>}}}

const commands=[["Open YouTube","https://youtube.com"],["Open Google","https://google.com"]];
function App(){
 const [listening,setListening]=useState(false),[text,setText]=useState(""),[status,setStatus]=useState("Ready to listen");
 const rec=useRef<any>(null);
 useEffect(()=>()=>rec.current?.stop(),[]);
 const speak=(message:string)=>{
   setStatus(message); const voices=speechSynthesis.getVoices();
   const v=voices.find((x:any)=>/female|zira|samantha|victoria|karen|google us english/i.test(x.name))||voices[0];
   const u=new SpeechSynthesisUtterance(message); if(v)u.voice=v;u.rate=.96;u.pitch=1.05;speechSynthesis.speak(u);
 };
 const run=(raw:string)=>{
   const q=raw.trim(); if(!q)return;
   const l=q.toLowerCase();
   if(l.includes("youtube")){window.yulia.open("https://youtube.com");speak("Opening YouTube.");return}
   if(l.includes("google")){window.yulia.open("https://google.com");speak("Opening Google.");return}
   speak("I heard you, but that command is not available yet.");
 };
 const start=()=>{
   const SR=(window as any).SpeechRecognition||(window as any).webkitSpeechRecognition;
   if(!SR){speak("Speech recognition is not supported in this environment.");return}
   const r=new SR();rec.current=r;r.lang="en-US";r.interimResults=true;r.continuous=false;
   r.onstart=()=>{setListening(true);setStatus("Listening…")};
   r.onresult=(e:any)=>{const value=Array.from(e.results).map((x:any)=>x[0].transcript).join("");setText(value);if(e.results[e.results.length-1].isFinal)run(value)};
   r.onerror=()=>{setListening(false);setStatus("Could not hear that. Try again.")};
   r.onend=()=>setListening(false);r.start();
 };
 return <main className="app">
   <aside><div className="brand"><div className="orb small">Y</div><div><b>Yulia</b><span>AI Assistant</span></div></div><div className="nav active">◉ <span>Assistant</span></div><div className="nav">⌁ <span>Commands</span></div><div className="nav">⚙ <span>Settings</span></div><div className="tip">Say <b>“Open YouTube”</b><br/>to get started.</div></aside>
   <section className="content"><header><div><p className="eyebrow">PERSONAL ASSISTANT</p><h1>Good to see you.</h1><p className="sub">Talk to Yulia naturally. She'll take care of the rest.</p></div><div className={"status "+(listening?"live":"")}><i/> {status}</div></header>
   <div className="hero"><div className={"orb "+(listening?"pulse":"")}><div className="core">Y</div></div><h2>{listening?"I'm listening…":"How can I help?"}</h2><p>{text||"Press the microphone and give me a command."}</p><button className="mic" onClick={start}>{listening?"Listening":"🎙 Start speaking"}</button></div>
   <div className="quick"><div className="section-title">Quick commands</div>{commands.map(([name,target])=><button key={name} onClick={()=>{window.yulia.open(target);speak(name+".")}} className="command"><span>↗</span>{name}<small>Open</small></button>)}</div>
   </section>
 </main>
}
createRoot(document.getElementById("root")!).render(<App/>);