
const m2ProPaket = 1.742;
const preisProM2 = 55.00;

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

function berechne() {
  let gesamt = 0;
  for (let i = 1; i < raumIndex; i++) {
    const l = parseFloat(document.getElementById("laenge" + i)?.value) || 0;
    const b = parseFloat(document.getElementById("breite" + i)?.value) || 0;
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

  document.getElementById("ergebnis").innerHTML = `
    <div class="ergebnis-box">
      <h3>Bodenbelag</h3>
      <p><strong>Gesamtfläche (mit 10 % Verschnitt):</strong> ${gesamtMitVerschnitt.toFixed(2)} m²</p>
      <p><strong>Benötigte Pakete:</strong> ${anzahlPakete} Pakete</p>
      <p><strong>Preis Bodenbelag:</strong> CHF ${gesamtPreisBoden.toFixed(2)}</p>
    </div>
    <div class="ergebnis-box">
      <h3>Sockelleisten</h3>
      <p><strong>Modell:</strong> ${sockelleiste}</p>
      <p><strong>Benötigt:</strong> ca. ${benoetigteLfm.toFixed(2)} lfm → ${anzahlStangen} Stangen à 4 m</p>
      <p><strong>Preis Sockelleisten:</strong> CHF ${gesamtPreisSockel.toFixed(2)}</p>
    </div>
    <div class="ergebnis-total">
      <p>Total: CHF ${total.toFixed(2)}</p>
    </div>
`;
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
}

window.onload = setup;

function downloadPDF() {
  window.print();
}
