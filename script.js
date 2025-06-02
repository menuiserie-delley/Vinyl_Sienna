
const m2ProPaket = 2.89;
const preisProM2 = 78.50;
const sockelleisten = {
  "Oeko-Sockelleiste konisch Eiche furniert lackiert": 4.0,
  "Oeko-Sockelleiste konisch weiss deckend RAL 9010": 4.0,
  "Oeko-Sockelleiste konisch Eiche furniert geölt": 4.0,
  "Oeko-Sockelleiste konisch Buche gedämpft furniert lackiert": 4.0,
  "Oeko-Sockelleiste konisch Ahorn furniert lackiert": 4.0,
  "Oeko-Sockelleiste konisch Nussbaum ami furniert lackiert": 4.0,
  "Sockelleiste konisch Eiche massiv lackiert": 4.0,
  "Sockelleiste konisch Eiche massiv geölt": 4.0,
  "Sockelleiste konisch Buche weiss deckend RAL 9010": 4.0,
  "Sockelleiste konisch Buche weiss deckend RAL 9003": 4.0,
  "Sockelleiste parallel B-40 Kiefer massiv, weiss RAL 9010, lackiert": 4.0,
  "Sockelleiste parallel B-60 Kiefer massiv, weiss RAL 9010, lackiert": 4.0,
  "Sockelleiste konisch Kiefer massiv, weiss RAL 9016, lackiert": 4.0,
  "Sockelleiste parallel B-40 Kiefer massiv, weiss RAL 9016, lackiert": 4.0,
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

  const sockelleiste = document.getElementById("sockelleiste").value;
  const preisSockelleiste = sockelleisten[sockelleiste] || 0;
  const sockelLaenge = Math.ceil((gesamtMitVerschnitt * 1.10) / 4);
  const gesamtPreisSockel = sockelLaenge * preisSockelleiste;

  const total = gesamtPreisBoden + gesamtPreisSockel;

  document.getElementById("ergebnis").innerHTML = `
    <p><strong>Gesamtfläche (mit 10 % Verschnitt):</strong> ${gesamtMitVerschnitt.toFixed(2)} m²</p>
    <p><strong>Benötigte Pakete:</strong> ${anzahlPakete} Pakete</p>
    <p><strong>Gesamtpreis Boden:</strong> CHF ${gesamtPreisBoden.toFixed(2)}</p>
    <p><strong>Sockelleisten:</strong> ${sockelLaenge} Stück (à 4 m) – ${sockelleiste}</p>
    <p><strong>Gesamtpreis Sockelleisten:</strong> CHF ${gesamtPreisSockel.toFixed(2)}</p>
    <p><strong>Total:</strong> CHF ${total.toFixed(2)}</p>
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
  for (const typ in sockelleisten) {
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
