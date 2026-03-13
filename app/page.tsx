"use client";

import Link from "next/link";

export default function Home() {

function abrirPlano(){
window.open("https://www.asaas.com/c/ayfhkldtnk1osf37","_blank")
}

return(

<div className="container">

<div className="hero">

<h1>RicardoIA</h1>

<p>
Sua inteligência artificial para atendimento, produtividade,
marketing e crescimento empresarial.
</p>

<div className="buttons">

<Link href="/chat" className="btn-primary">
Testar agora
</Link>

<Link href="/planos" className="btn-secondary">
Ver planos
</Link>

</div>

</div>


<div className="features">

<div className="card">
<h3>Atendimento Inteligente</h3>
<p>
Responda clientes com rapidez usando IA moderna.
</p>
</div>

<div className="card">
<h3>Marketing Automático</h3>
<p>
Crie campanhas, posts e textos profissionais em segundos.
</p>
</div>

<div className="card">
<h3>Produtividade</h3>
<p>
Organize tarefas, ideias e estratégias de crescimento.
</p>
</div>

</div>


<div className="plan">

<h2>Plano em destaque</h2>

<div className="plan-card">

<h3>Plano PRO</h3>

<div className="plan-price">
R$ 29,90/mês
</div>

<button
onClick={abrirPlano}
className="btn-primary"
>
Assinar agora
</button>

</div>

</div>


<div className="footer">

<p>
Comece hoje • Teste a plataforma e faça upgrade quando quiser
</p>

</div>


</div>

)

}