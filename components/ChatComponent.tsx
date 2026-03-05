} catch (e: any) {
  // ✅ se já veio texto, mantém e só avisa que pode ter sido interrompido
  const msg = e?.message ? String(e.message) : 'stream interrompida'

  assistantText =
    (assistantText || '') +
    (assistantText ? '\n\n' : '') +
    `⚠️ A resposta foi interrompida no final (mas o texto acima está válido). Detalhe: ${msg}`

  setMessages((prev) => {
    const updated = [...prev]
    updated[updated.length - 1] = { role: 'assistant', content: assistantText }
    return updated
  })
} finally {
  setLoading(false)
}