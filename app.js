const VAR_FIELDS = [
  { id: "var-period", token: "{{기간}}" },
  { id: "var-lang", token: "{{언어권}}" },
  { id: "var-market", token: "{{시장}}" },
  { id: "var-sector", token: "{{섹터}}" },
  { id: "var-investor", token: "{{투자자유형}}" },
  { id: "var-purpose", token: "{{목적}}" },
];

const chipRow = document.getElementById("template-chips");
const output = document.getElementById("prompt-output");
const copyBtn = document.getElementById("copy-btn");
const copyStatus = document.getElementById("copy-status");

let selectedId = PROMPT_TEMPLATES[0].id;

function fillTemplate(text) {
  let filled = text;
  for (const field of VAR_FIELDS) {
    const value = document.getElementById(field.id).value.trim() || field.token;
    filled = filled.split(field.token).join(value);
  }
  return filled;
}

function render() {
  const template = PROMPT_TEMPLATES.find((t) => t.id === selectedId);
  output.textContent = fillTemplate(template.text);

  [...chipRow.children].forEach((chip) => {
    chip.classList.toggle("selected", chip.dataset.id === selectedId);
  });
}

function buildChips() {
  PROMPT_TEMPLATES.forEach((template) => {
    const chip = document.createElement("button");
    chip.className = "chip";
    chip.type = "button";
    chip.textContent = template.label;
    chip.dataset.id = template.id;
    chip.addEventListener("click", () => {
      selectedId = template.id;
      render();
    });
    chipRow.appendChild(chip);
  });
}

VAR_FIELDS.forEach((field) => {
  document.getElementById(field.id).addEventListener("input", render);
});

copyBtn.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(output.textContent);
    copyStatus.textContent = "복사됨";
  } catch (err) {
    copyStatus.textContent = "복사 실패 — 직접 선택해 주세요";
  }
  setTimeout(() => (copyStatus.textContent = ""), 2000);
});

buildChips();
render();
