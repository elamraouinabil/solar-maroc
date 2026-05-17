const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const PDFDocument = require("pdfkit");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "../public")));

const PORT = process.env.PORT || 3000;

// ======================
// DATABASE SIMPLE JSON
// ======================

const DATA_DIR = path.join(__dirname, "data");

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR);
}

const LEADS_FILE = path.join(DATA_DIR, "leads.json");

if (!fs.existsSync(LEADS_FILE)) {
  fs.writeFileSync(LEADS_FILE, "[]");
}

// ======================
// PANNEAUX SOLAIRES
// ======================

const PANELS = [
  {
    name: "Jinko 585W",
    power: 585,
    price: 1900
  },
  {
    name: "Longi 600W",
    power: 600,
    price: 2100
  },
  {
    name: "Canadian Solar 550W",
    power: 550,
    price: 1750
  }
];

// ======================
// VILLES MAROC
// ======================

const SOLAR_CITIES = {
  Casablanca: 5.5,
  Rabat: 5.7,
  Marrakech: 6.2,
  Agadir: 6.5,
  Tanger: 5.2,
  Fes: 5.8,
  Oujda: 6.1
};

// ======================
// ROUTE TEST
// ======================

app.get("/", (req, res) => {
  res.send(`
    <h1>☀️ Solar Maroc SaaS</h1>
    <p>Server running successfully</p>
  `);
});

// ======================
// API PANELS
// ======================

app.get("/api/panels", (req, res) => {
  res.json(PANELS);
});

// ======================
// API SIMULATION SOLAIRE
// ======================

app.post("/api/simulate", (req, res) => {
  try {
    const {
      fullname,
      city,
      phone,
      electricity_bill
    } = req.body;

    if (!fullname || !city || !electricity_bill) {
      return res.status(400).json({
        error: "Missing fields"
      });
    }

    const sunHours = SOLAR_CITIES[city] || 5.5;

    const monthlyConsumption =
      electricity_bill / 1.4;

    const neededPower =
      monthlyConsumption / (sunHours * 30);

    const recommendedPanel = PANELS[1];

    const numberOfPanels = Math.ceil(
      (neededPower * 1000) /
      recommendedPanel.power
    );

    const installationCost =
      numberOfPanels *
      recommendedPanel.price;

    const yearlySavings =
      electricity_bill * 12 * 0.7;

    const roi =
      installationCost / yearlySavings;

    const result = {
      fullname,
      city,
      phone,
      electricity_bill,
      sunHours,
      recommended_panel:
        recommendedPanel.name,
      panel_power:
        recommendedPanel.power,
      number_of_panels:
        numberOfPanels,
      estimated_installation_cost:
        installationCost,
      yearly_savings:
        yearlySavings,
      estimated_roi_years:
        roi.toFixed(1),
      created_at:
        new Date()
    };

    const leads = JSON.parse(
      fs.readFileSync(LEADS_FILE)
    );

    leads.push(result);

    fs.writeFileSync(
      LEADS_FILE,
      JSON.stringify(leads, null, 2)
    );

    res.json(result);

  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: "Simulation error"
    });
  }
});

// ======================
// API LEADS CRM
// ======================

app.get("/api/leads", (req, res) => {
  try {
    const leads = JSON.parse(
      fs.readFileSync(LEADS_FILE)
    );

    res.json(leads);

  } catch (err) {
    res.status(500).json({
      error: "Cannot load leads"
    });
  }
});

// ======================
// API PDF DEVIS
// ======================

app.post("/api/pdf", (req, res) => {
  try {

    const data = req.body;

    const doc = new PDFDocument();

    const filename =
      `devis-${Date.now()}.pdf`;

    res.setHeader(
      "Content-Type",
      "application/pdf"
    );

    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${filename}"`
    );

    doc.pipe(res);

    doc.fontSize(24)
      .text("SOLAR MAROC", {
        align: "center"
      });

    doc.moveDown();

    doc.fontSize(18)
      .text("Devis Installation Solaire");

    doc.moveDown();

    doc.fontSize(12)
      .text(`Nom: ${data.fullname}`);

    doc.text(`Ville: ${data.city}`);

    doc.text(`Téléphone: ${data.phone}`);

    doc.text(
      `Facture électricité: ${data.electricity_bill} DH`
    );

    doc.moveDown();

    doc.text(
      `Panneau recommandé: ${data.recommended_panel}`
    );

    doc.text(
      `Nombre de panneaux: ${data.number_of_panels}`
    );

    doc.text(
      `Coût installation: ${data.estimated_installation_cost} DH`
    );

    doc.text(
      `Économie annuelle: ${data.yearly_savings} DH`
    );

    doc.text(
      `ROI estimé: ${data.estimated_roi_years} ans`
    );

    doc.moveDown();

    doc.text(
      "Merci de faire confiance à Solar Maroc ☀️",
      {
        align: "center"
      }
    );

    doc.end();

  } catch (err) {

    console.error(err);

    res.status(500).json({
      error: "PDF generation error"
    });
  }
});

// ======================
// 404
// ======================

app.use((req, res) => {
  res.status(404).json({
    error: "Route not found"
  });
});

// ======================
// START SERVER
// ======================

app.listen(PORT, "0.0.0.0", () => {
  console.log(
    `☀️ Solar Maroc running on port ${PORT}`
  );
});
