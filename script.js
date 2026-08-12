
const m2ProPaket = 1.742;
const preisProM2 = 55.00;
const emailEmpfaenger = "info@menuiserie-delley.ch";
const whatsappNummer = "41788297477";

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
  doc.text("Menuiserie Delley  ·  Haselweg 10, 2553 Safnern  ·  078 829 74 77  ·  info@menuiserie-delley.ch", pageW / 2, y, { align: "center" });

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

  const produktName = document.querySelector("h1").textContent.trim();
  const whatsappText = encodeURIComponent(`Hallo, ich interessiere mich für ${produktName} und möchte gerne mehr erfahren.`);
  const whatsappBtn = document.createElement("a");
  whatsappBtn.id = "whatsapp-btn";
  whatsappBtn.className = "whatsapp-btn";
  whatsappBtn.href = `https://wa.me/${whatsappNummer}?text=${whatsappText}`;
  whatsappBtn.target = "_blank";
  whatsappBtn.rel = "noopener";
  whatsappBtn.innerHTML = `<svg viewBox="0 0 32 32" width="20" height="20" fill="#fff" xmlns="http://www.w3.org/2000/svg"><path d="M16 .396C7.163.396 0 7.559 0 16.396c0 2.837.744 5.5 2.04 7.805L.396 32l7.995-2.098A15.9 15.9 0 0 0 16 32.396c8.837 0 16-7.163 16-16S24.837.396 16 .396zm0 29.257c-2.51 0-4.868-.68-6.9-1.87l-.495-.293-4.744 1.245 1.267-4.63-.322-.51A13.19 13.19 0 0 1 2.8 16.396C2.8 9.06 8.664 3.196 16 3.196s13.2 5.864 13.2 13.2-5.864 13.257-13.2 13.257zm7.24-9.9c-.396-.198-2.34-1.155-2.703-1.287-.363-.132-.627-.198-.891.198-.264.396-1.023 1.287-1.254 1.551-.231.264-.462.297-.858.099-.396-.198-1.672-.616-3.184-1.964-1.177-1.05-1.972-2.347-2.203-2.743-.231-.396-.025-.61.173-.807.178-.177.396-.462.594-.693.198-.231.264-.396.396-.66.132-.264.066-.495-.033-.693-.099-.198-.891-2.148-1.221-2.94-.322-.77-.65-.666-.891-.679-.231-.011-.495-.013-.759-.013-.264 0-.693.099-1.056.495-.363.396-1.386 1.353-1.386 3.301s1.419 3.83 1.617 4.095c.198.264 2.793 4.264 6.77 5.98.946.409 1.684.653 2.259.836.949.302 1.813.259 2.496.157.761-.114 2.34-.957 2.67-1.881.33-.924.33-1.716.231-1.881-.099-.165-.363-.264-.759-.462z"/></svg> WhatsApp Kontakt`;
  container.appendChild(whatsappBtn);
}

window.onload = setup;
