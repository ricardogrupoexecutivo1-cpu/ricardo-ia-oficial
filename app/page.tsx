"use client";

import { useEffect, useState } from "react";

export default function HomePage() {

  const [phase,setPhase] = useState<"intro"|"platform">("intro");

  useEffect(()=>{

    const timer=setTimeout(()=>{

      setPhase("platform");

    },4000);

    return ()=>clearTimeout(timer);

  },[]);

  return (

<main
style={{
minHeight:"100vh",
background:"radial-gradient(circle at center,#12213e 0%,#070c1b 40%,#02040a 100%)",
color:"#fff",
fontFamily:"Arial",
overflow:"hidden"
}}
>

<style jsx global>{`

.line{
position:absolute;
height:3px;
background:linear-gradient(90deg,#00ffaa,#0099ff);
box-shadow:0 0 20px #00ffaa;
}

.l1{
top:0;
left:0;
width:300px;
transform:rotate(45deg);
animation:l1 1.2s forwards;
}

.l2{
top:0;
right:0;
width:300px;
transform:rotate(-45deg);
animation:l2 1.2s forwards;
}

.l3{
bottom:0;
left:0;
width:300px;
transform:rotate(-45deg);
animation:l3 1.2s forwards;
}

.l4{
bottom:0;
right:0;
width:300px;
transform:rotate(45deg);
animation:l4 1.2s forwards;
}

@keyframes l1{
from{transform:translate(-200px,-200px) rotate(45deg)}
to{transform:translate(400px,300px) rotate(45deg)}
}

@keyframes l2{
from{transform:translate(200px,-200px) rotate(-45deg)}
to{transform:translate(-400px,300px) rotate(-45deg)}
}

@keyframes l3{
from{transform:translate(-200px,200px) rotate(-45deg)}
to{transform:translate(400px,-300px) rotate(-45deg)}
}

@keyframes l4{
from{transform:translate(200px,200px) rotate(45deg)}
to{transform:translate(-400px,-300px) rotate(45deg)}
}

`}</style>

{phase==="intro" && (

<section
style={{
position:"fixed",
inset:0,
display:"flex",
alignItems:"center",
justifyContent:"center",
flexDirection:"column",
zIndex:10
}}
>

<div className="line l1"></div>
<div className="line l2"></div>
<div className="line l3"></div>
<div className="line l4"></div>

<img
src="/aurora-robot.png"
alt="Aurora"
style={{
width:220,
marginBottom:20,
filter:"drop-shadow(0 0 40px rgba(0,255,200,0.5))"
}}
/>

<h1 style={{fontSize:42}}>
Bem-vindos à Aurora IA
</h1>

</section>

)}

{phase==="platform" && (

<div style={{maxWidth:1200,margin:"0 auto",padding:20}}>

<h1 style={{fontSize:38}}>Plataforma Aurora IA</h1>

<p style={{color:"#aaa"}}>
Chat • Imagens • Marketing • Explorar
</p>

<div
style={{
display:"grid",
gridTemplateColumns:"repeat(auto-fit,minmax(240px,1fr))",
gap:20,
marginTop:30
}}
>

<a href="/chat" style={card}>
<h3>Chat inteligente</h3>
<p>Converse com a Aurora IA.</p>
</a>

<a href="/chat" style={card}>
<h3>Gerar imagens</h3>
<p>Crie imagens com IA.</p>
</a>

<a href="/chat" style={card}>
<h3>Marketing</h3>
<p>Crie campanhas.</p>
</a>

<a href="/explorar" style={card}>
<h3>Explorar</h3>
<p>Veja imagens públicas.</p>
</a>

<a href="/planos" style={card}>
<h3>Planos</h3>
<p>Conheça os planos.</p>
</a>

<a href="/login" style={card}>
<h3>Entrar</h3>
<p>Acesse sua conta.</p>
</a>

</div>

</div>

)}

</main>

);

}

const card:React.CSSProperties={

background:"#11182d",
padding:20,
borderRadius:16,
textDecoration:"none",
color:"#fff",
border:"1px solid rgba(255,255,255,0.1)"

};