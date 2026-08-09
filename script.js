
const m2ProPaket = 1.742;
const preisProM2 = 55.00;
const emailEmpfaenger = "info@menuiserie-delley.ch";

// Preis pro Laufmeter (Spalte "Preis" aus dem Export AX, gelb markierte Sockelleisten-Artikel).
// Sockelleisten sind immer in 4-m-Stangen erhältlich, daher Stückpreis = Preis x 4.
const sockelleistenPreisProLfm = {
  "Sockelleiste B-40 parallel, Kiefer massiv, Weiss RAL 9010, lackiert, Dim. 40x12 mm, Stk. à 4 m1": 3.15,
  "Sockelleiste parallel B-60, Kiefer massiv, Weiss RAL 9016, lackiert, Dim. 60x12 mm, Stk. à 4m1": 4.45,
  "Sockelleiste parallel B-40, Kiefer massiv, Weiss RAL 9016, lackiert, Dim. 40x12 mm, Stk. à 4 m1": 3.15,
  "Oeko-Sockelleiste konisch Eiche furniert lackiert 60 x 14/8 mm 4 m1/Stk": 4.81,
  "Oeko-Sockelleiste konisch foliert Weiss deckend RAL 9010 60 x 14/8 mm 4 m1/Stk": 5.76,
  "Oeko-Sockelleiste konisch Eiche furniert geölt 60 x 14/8 mm 4 m1/Stk": 6.05,
  "Oeko-Sockelleiste konisch Buche gedämpft furniert lackiert 60 x 14/8 mm 4 m1/Stk": 4.69,
  "Oeko-Sockelleiste konisch Ahorn furniert lackiert 60 x 14/8 mm 4 m1/Stk": 4.69,
  "Oeko-Sockelleiste konisch Nussbaum ami furniert lackiert 60 x 14/8 mm 4 m1/Stk": 5.24,
  "Sockelleiste konisch Eiche massiv lackiert 60 x 12/8 mm": 10.15,
  "Sockelleiste konisch Eiche massiv geölt 60 x 12/8 mm": 11.54,
  "Sockelleiste konisch Buche weiss deckend RAL 9010 60 x 12/8 mm": 6.93,
  "Sockelleiste konisch Buche weiss deckend RAL 9003 40 x 12/8 mm": 6.38,
  "Alu-Sockel mit Fuss ungelocht Silber eloxiert 60 x 11 mm 4 m1/Stk": 9.44,
  "Sockelleiste massiv Buche konisch RAL 9016 weiss deckend lackiert 60 x 12/8 mm fallende Längen 2.5 bis 4.0 lfm": 6.93,
  "Sockel Kiefer konisch RAL 9016 4000x40x12/8 mm Holzherkunft: Europa, Ursprungsland Europa": 3.8,
};

let raumIndex = 1;

function addRoomField() {
  const container = document.getElementById("raeume");
  const div = document.createElement("div");
  div.innerHTML = `
    <h3>Zimmer ${raumIndex}</h3>
    <label>Länge (m): <input type="number" step="0.01" id="laenge${raumIndex}" /></label>
    <label>Breite (m): <input type="number" step="0.01" id="breite${raumIndex}" /></label>
`;
  container.appendChild(div);
  raumIndex++;
}

// Reine Berechnung ohne Seiteneffekte — wird sowohl für die Anzeige als auch
// für PDF/E-Mail verwendet, damit überall dieselben Zahlen erscheinen.
function berechneWerte() {
  const raeume = [];
  let gesamt = 0;
  for (let i = 1; i < raumIndex; i++) {
    const l = parseFloat(document.getElementById("laenge" + i)?.value) || 0;
    const b = parseFloat(document.getElementById("breite" + i)?.value) || 0;
    if (l > 0 && b > 0) raeume.push({ l, b });
    gesamt += l * b;
  }

  const verschnitt = gesamt * 0.10;
  const gesamtMitVerschnitt = gesamt + verschnitt;
  const anzahlPakete = Math.ceil(gesamtMitVerschnitt / m2ProPaket);
  const gesamtPreisBoden = anzahlPakete * m2ProPaket * preisProM2;

  // Sockelleisten: benötigte Laufmeter = Fläche + 10 % (gleicher Wert wie beim Boden).
  // Stangen à 4 m, Stückpreis = Preis pro Laufmeter x 4.
  const sockelleiste = document.getElementById("sockelleiste").value;
  const preisProLfm = sockelleistenPreisProLfm[sockelleiste] || 0;
  const preisProStange = preisProLfm * 4;
  const benoetigteLfm = gesamtMitVerschnitt;
  const anzahlStangen = Math.ceil(benoetigteLfm / 4);
  const gesamtPreisSockel = anzahlStangen * preisProStange;

  const total = gesamtPreisBoden + gesamtPreisSockel;

  return {
    raeume, gesamtMitVerschnitt, anzahlPakete, gesamtPreisBoden,
    sockelleiste, benoetigteLfm, anzahlStangen, preisProStange, gesamtPreisSockel, total,
  };
}

function zeigeErgebnis(r) {
  document.getElementById("ergebnis").innerHTML = `
    <div class="ergebnis-box">
      <h3>Bodenbelag</h3>
      <p><strong>Gesamtfläche (mit 10 % Verschnitt):</strong> ${r.gesamtMitVerschnitt.toFixed(2)} m²</p>
      <p><strong>Benötigte Pakete:</strong> ${r.anzahlPakete} Pakete</p>
      <p><strong>Preis Bodenbelag:</strong> CHF ${r.gesamtPreisBoden.toFixed(2)}</p>
    </div>
    <div class="ergebnis-box">
      <h3>Sockelleisten</h3>
      <p><strong>Modell:</strong> ${r.sockelleiste}</p>
      <p><strong>Benötigt:</strong> ca. ${r.benoetigteLfm.toFixed(2)} lfm → ${r.anzahlStangen} Stangen à 4 m</p>
      <p><strong>Preis Sockelleisten:</strong> CHF ${r.gesamtPreisSockel.toFixed(2)}</p>
    </div>
    <div class="ergebnis-total">
      <p>Total: CHF ${r.total.toFixed(2)}</p>
    </div>
    <p class="anfrage-hint">Preise exkl. Montage — Montagekosten fallen zusätzlich an.</p>
    <p class="anfrage-hint">Möchten Sie diese Kalkulation als Grundlage für eine unverbindliche Anfrage nutzen? Nutzen Sie den Button unten.</p>
`;
}

function berechne() {
  const r = berechneWerte();
  zeigeErgebnis(r);
  return r;
}

async function logoAlsDataUrl() {
  const res = await fetch("logo-pdf.png");
  const blob = await res.blob();
  const bitmap = await createImageBitmap(blob);
  const targetW = 360;
  const targetH = Math.round((bitmap.height / bitmap.width) * targetW);
  const canvas = document.createElement("canvas");
  canvas.width = targetW;
  canvas.height = targetH;
  canvas.getContext("2d").drawImage(bitmap, 0, 0, targetW, targetH);
  return canvas.toDataURL("image/png");
}

async function erstellePdf(r, produktName) {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const brand = [47, 79, 79];
  const ink = [40, 40, 40];
  const soft = [110, 110, 110];
  const pageW = 210;
  const marginL = 18;
  const marginR = 18;
  const contentW = pageW - marginL - marginR;
  let y = 18;

  try {
    const logo = await logoAlsDataUrl();
    const props = doc.getImageProperties(logo);
    const w = 46;
    const h = (props.height / props.width) * w;
    doc.addImage(logo, "PNG", (pageW - w) / 2, y, w, h);
    y += h + 6;
  } catch (e) {
    y += 4;
  }

  doc.setDrawColor(...brand);
  doc.setLineWidth(0.4);
  doc.line(marginL, y, pageW - marginR, y);
  y += 10;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(17);
  doc.setTextColor(...brand);
  doc.text(`Kalkulation ${produktName}`, marginL, y);
  y += 6;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9.5);
  doc.setTextColor(...soft);
  doc.text(new Date().toLocaleDateString("de-CH"), marginL, y);
  y += 10;

  if (r.raeume.length) {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11.5);
    doc.setTextColor(...ink);
    doc.text("Zimmer", marginL, y);
    y += 6;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    r.raeume.forEach((z, i) => {
      doc.text(`Zimmer ${i + 1}: ${z.l.toFixed(2)} m × ${z.b.toFixed(2)} m = ${(z.l * z.b).toFixed(2)} m²`, marginL, y);
      y += 5.5;
    });
    y += 4;
  }

  function box(title, lines) {
    const rowH = 6.2;
    const boxH = 10 + lines.length * rowH;
    doc.setFillColor(246, 246, 246);
    doc.roundedRect(marginL, y, contentW, boxH, 2, 2, "F");
    let iy = y + 8;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(...brand);
    doc.text(title, marginL + 6, iy);
    iy += 7;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(...ink);
    lines.forEach((line) => {
      const wrapped = doc.splitTextToSize(line, contentW - 12);
      doc.text(wrapped, marginL + 6, iy);
      iy += wrapped.length * 5;
    });
    y += boxH + 6;
  }

  box("Bodenbelag", [
    `Gesamtfläche (mit 10% Verschnitt): ${r.gesamtMitVerschnitt.toFixed(2)} m²`,
    `Benötigte Pakete: ${r.anzahlPakete}`,
    `Preis Bodenbelag: CHF ${r.gesamtPreisBoden.toFixed(2)}`,
  ]);

  box("Sockelleisten", [
    `Modell: ${r.sockelleiste}`,
    `Benötigt: ca. ${r.benoetigteLfm.toFixed(2)} lfm -> ${r.anzahlStangen} Stangen à 4 m`,
    `Preis Sockelleisten: CHF ${r.gesamtPreisSockel.toFixed(2)}`,
  ]);

  doc.setFillColor(...brand);
  doc.roundedRect(marginL, y, contentW, 16, 2, 2, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor(255, 255, 255);
  doc.text(`Total: CHF ${r.total.toFixed(2)}`, pageW / 2, y + 10.5, { align: "center" });
  y += 24;

  doc.setFont("helvetica", "italic");
  doc.setFontSize(8.5);
  doc.setTextColor(...soft);
  const disclaimer = doc.splitTextToSize(
    "Preise sind ohne Gewähr und verstehen sich exkl. MwSt. und exkl. Montage — Montagekosten fallen zusätzlich an. " +
    "Dieser Kalkulator dient der schnellen Orientierung. Zusatzkosten für Zubehör wie Trittschalldämmung sind möglich. " +
    "Holz ist ein Naturprodukt – Abweichungen in Farbe und Struktur zwischen Produktbild und Original sind möglich.",
    contentW
  );
  doc.text(disclaimer, marginL, y);
  y += disclaimer.length * 4 + 8;

  doc.setDrawColor(220, 220, 220);
  doc.setLineWidth(0.2);
  doc.line(marginL, y, pageW - marginR, y);
  y += 6;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(...soft);
  doc.text("Menuiserie Delley  ·  Haselweg 10, 2553 Safnern  ·  079 580 13 50  ·  info@menuiserie-delley.ch", pageW / 2, y, { align: "center" });

  return doc;
}

async function anfrageSenden() {
  const btn = document.getElementById("anfrage-btn");
  const produktName = document.querySelector("h1").textContent.trim();
  const r = berechne();

  btn.disabled = true;
  btn.innerText = "PDF wird erstellt …";
  try {
    const pdf = await erstellePdf(r, produktName);
    pdf.save(`Kalkulation_${produktName.replace(/\s+/g, "_")}.pdf`);
  } catch (e) {
    alert("PDF konnte nicht erstellt werden. Bitte kontaktieren Sie uns direkt.");
    btn.disabled = false;
    btn.innerText = "📩 Anfrage per E-Mail senden";
    return;
  }

  const betreff = encodeURIComponent(`Anfrage ${produktName}`);
  const zimmerText = r.raeume.map((z, i) => `Zimmer ${i + 1}: ${z.l} x ${z.b} m`).join("\n");
  const body = encodeURIComponent(
`Guten Tag

Ich interessiere mich für ${produktName} und habe folgende Kalkulation erstellt:

${zimmerText}

Fläche inkl. 10% Verschnitt: ${r.gesamtMitVerschnitt.toFixed(2)} m²
Benötigte Pakete: ${r.anzahlPakete}
Preis Bodenbelag: CHF ${r.gesamtPreisBoden.toFixed(2)}

Sockelleisten: ${r.sockelleiste}
Benötigt: ${r.anzahlStangen} Stangen à 4 m
Preis Sockelleisten: CHF ${r.gesamtPreisSockel.toFixed(2)}

Total: CHF ${r.total.toFixed(2)}

(Preise exkl. Montage — Montagekosten fallen zusätzlich an.)

(Die PDF-Kalkulation habe ich soeben heruntergeladen — bitte noch per Drag & Drop an diese E-Mail anhängen, bevor Sie sie senden.)

Freundliche Grüsse`
  );

  setTimeout(() => {
    window.location.href = `mailto:${emailEmpfaenger}?subject=${betreff}&body=${body}`;
    btn.disabled = false;
    btn.innerText = "📩 Anfrage per E-Mail senden";
  }, 500);
}

function setup() {
  const container = document.getElementById("calculator");

  const raumContainer = document.createElement("div");
  raumContainer.id = "raeume";
  container.appendChild(raumContainer);

  addRoomField();

  const button = document.createElement("button");
  button.innerText = "Weitere Zimmer hinzufügen";
  button.onclick = addRoomField;
  container.appendChild(button);

  const select = document.createElement("select");
  select.id = "sockelleiste";
  select.style.marginTop = "16px";
  for (const typ in sockelleistenPreisProLfm) {
    const opt = document.createElement("option");
    opt.value = typ;
    opt.innerText = typ;
    select.appendChild(opt);
  }
  container.appendChild(select);

  const berechnenBtn = document.createElement("button");
  berechnenBtn.innerText = "Berechnen";
  berechnenBtn.onclick = berechne;
  container.appendChild(document.createElement("br"));
  container.appendChild(berechnenBtn);

  container.appendChild(document.createElement("div")).id = "ergebnis";

  const anfrageBtn = document.createElement("button");
  anfrageBtn.id = "anfrage-btn";
  anfrageBtn.className = "anfrage-btn";
  anfrageBtn.innerText = "📩 Anfrage per E-Mail senden";
  anfrageBtn.onclick = anfrageSenden;
  container.appendChild(anfrageBtn);

  const hint = document.createElement("p");
  hint.className = "anfrage-hint";
  hint.innerText = "Lädt eine PDF-Zusammenfassung herunter und öffnet Ihr E-Mail-Programm mit einer vorausgefüllten Anfrage. Bitte die heruntergeladene PDF-Datei noch per Drag & Drop anhängen, da Browser aus Sicherheitsgründen keine Anhänge automatisch hinzufügen können.";
  container.appendChild(hint);
}

window.onload = setup;
