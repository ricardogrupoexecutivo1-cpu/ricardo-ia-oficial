const currentLang =
  typeof window !== "undefined"
    ? localStorage.getItem("aurora_lang") || "pt"
    : "pt";

const response = await fetch("/api/chat", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "x-language": currentLang,
  },
  body: JSON.stringify({
    message: input,
  }),
});