"use client";

export default function PlanosPage() {

  function abrirPagamento() {
    window.open("https://www.asaas.com/c/ayfhkldtnk1osf37", "_blank");
  }

  return (
    <main style={{maxWidth:800,margin:"0 auto",padding:"40px"}}>

      <h1 style={{fontSize:"32px",fontWeight:"bold"}}>
        Planos Aurora IA
      </h1>

      <p style={{marginTop:"10px"}}>
        Escolha o plano inicial da Aurora IA e tenha acesso completo à plataforma.
      </p>

      <div
        style={{
          border:"1px solid #ddd",
          borderRadius:"16px",
          padding:"30px",
          marginTop:"30px",
          background:"#fafafa"
        }}
      >

        <h2 style={{fontSize:"26px",fontWeight:"bold"}}>
          Founders Aurora
        </h2>

        <p style={{fontSize:"22px",marginTop:"10px"}}>
          <strong>R$ 29,90 / mês</strong>
        </p>

        <p style={{marginTop:"10px"}}>
          Preço garantido por até 24 meses para os primeiros usuários.
        </p>

        <ul style={{marginTop:"20px",lineHeight:"28px"}}>
          <li>✔ acesso à Aurora IA</li>
          <li>✔ chat inteligente com memória</li>
          <li>✔ geração de imagens com IA</li>
          <li>✔ criação de campanhas de marketing</li>
          <li>✔ suporte na fase inicial</li>
        </ul>

        <button
          onClick={abrirPagamento}
          style={{
            marginTop:"30px",
            padding:"14px 24px",
            fontSize:"18px",
            borderRadius:"10px",
            background:"#000",
            color:"#fff",
            cursor:"pointer"
          }}
        >
          Assinar Plano Founders
        </button>

        <p style={{marginTop:"20px",fontSize:"14px"}}>
          Pagamento seguro via Asaas.  
          Pix • Cartão • Boleto • Assinatura mensal.
        </p>

      </div>

    </main>
  );
}