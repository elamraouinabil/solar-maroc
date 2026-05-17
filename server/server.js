const express = require("express");
const fs = require("fs");
const cors = require("cors");
const path = require("path");
const PDFDocument = require("pdfkit");

const app = express();

const PORT = 3000;

// =====================================
// MIDDLEWARE
// =====================================

app.use(cors());

app.use(express.json());

app.use(
  express.static(
    path.join(__dirname, "../public")
  )
);

// =====================================
// FILES
// =====================================

const LEADS_FILE =
  path.join(__dirname, "leads.json");

if (
  !fs.existsSync(LEADS_FILE)
) {

  fs.writeFileSync(
    LEADS_FILE,
    "[]"
  );

}

// =====================================
// HOME
// =====================================

app.get("/", (req, res) => {

  res.sendFile(
    path.join(
      __dirname,
      "../public/index.html"
    )
  );

});

// =====================================
// SOLAR SIMULATION
// =====================================

app.post(
  "/api/simulate",

  (req, res) => {

    const {

      fullname,

      city,

      phone,

      electricity_bill

    } = req.body;

    const bill =
      Number(
        electricity_bill
      );

    const panels =
      Math.ceil(
        bill / 75
      );

    const kw =
      (
        panels * 0.55
      ).toFixed(2);

    const cost =
      Math.round(
        kw * 9500
      );

    const saving =
      Math.round(
        bill * 0.70
      );

    const roi =
      (
        cost /
        (saving * 12)
      ).toFixed(1);

    const recommendation =
      bill > 900
        ? "Installation Premium recommandée"
        : "Installation Standard recommandée";

    const lead = {

      id:
        Date.now(),

      fullname,

      city,

      phone,

      electricity_bill:
        bill,

      panels,

      kw,

      cost,

      saving,

      roi,

      recommendation,

      created_at:
        new Date()

    };

    const leads =
      JSON.parse(
        fs.readFileSync(
          LEADS_FILE
        )
      );

    leads.push(
      lead
    );

    fs.writeFileSync(

      LEADS_FILE,

      JSON.stringify(
        leads,
        null,
        2
      )

    );

    res.json({

      success: true,

      ...lead,

      pdf:
        "/api/pdf/" +
        lead.id

    });

  }
);

// =====================================
// PDF DEVIS
// =====================================

app.get(
  "/api/pdf/:id",

  (req, res) => {

    const leads =
      JSON.parse(
        fs.readFileSync(
          LEADS_FILE
        )
      );

    const lead =
      leads.find(
        l =>
          l.id ==
          req.params.id
      );

    if (!lead) {

      return res
        .status(404)
        .send(
          "Lead not found"
        );

    }

    const doc =
      new PDFDocument();

    res.setHeader(
      "Content-Type",
      "application/pdf"
    );

    res.setHeader(
      "Content-Disposition",
      "inline; filename=devis.pdf"
    );

    doc.pipe(res);

    doc
      .fontSize(24)
      .fillColor("#22c55e")
      .text(
        "SOLAR MAROC AI",
        {
          align:
            "center"
        }
      );

    doc.moveDown();

    doc
      .fontSize(18)
      .fillColor("black")
      .text(
        "DEVIS SOLAIRE"
      );

    doc.moveDown();

    doc.text(
      "Nom: " +
      lead.fullname
    );

    doc.text(
      "Ville: " +
      lead.city
    );

    doc.text(
      "Téléphone: " +
      lead.phone
    );

    doc.text(
      "Facture: " +
      lead.electricity_bill +
      " DH"
    );

    doc.moveDown();

    doc.text(
      "Panneaux: " +
      lead.panels
    );

    doc.text(
      "Puissance: " +
      lead.kw +
      " kW"
    );

    doc.text(
      "Coût installation: " +
      lead.cost +
      " DH"
    );

    doc.text(
      "Économie estimée: " +
      lead.saving +
      " DH/mois"
    );

    doc.text(
      "ROI estimé: " +
      lead.roi +
      " ans"
    );

    doc.moveDown();

    doc.text(
      "Recommandation:"
    );

    doc.text(
      lead.recommendation
    );

    doc.end();

  }
);

// =====================================
// CHATBOT IA
// =====================================

app.post(
  "/api/chatbot",

  (req, res) => {

    const msg =
      req.body.message
        .toLowerCase();

    let reply =
      "Je peux vous aider ☀️";

    if (
      msg.includes(
        "prix"
      )
    ) {

      reply =
        "💰 Le prix dépend de votre facture électrique.";

    }

    else if (
      msg.includes(
        "installation"
      )
    ) {

      reply =
        "🔧 Installation solaire partout au Maroc.";

    }

    else if (
      msg.includes(
        "roi"
      )
    ) {

      reply =
        "📈 ROI moyen entre 3 et 6 ans.";

    }

    else if (
      msg.includes(
        "bonjour"
      )
    ) {

      reply =
        "Bonjour 👋 bienvenue chez Solar Maroc AI.";

    }

    else if (
      msg.includes(
        "whatsapp"
      )
    ) {

      reply =
        "📲 Nous pouvons vous contacter sur WhatsApp.";

    }

    res.json({

      success: true,

      reply

    });

  }
);

// =====================================
// CRM LEADS
// =====================================

app.get(
  "/api/leads",

  (req, res) => {

    const leads =
      JSON.parse(
        fs.readFileSync(
          LEADS_FILE
        )
      );

    res.json(leads);

  }
);

// =====================================
// START
// =====================================

app.listen(
  PORT,
  "0.0.0.0",

  () => {

    console.log(
      "☀ Solar Maroc running on http://127.0.0.1:" +
      PORT
    );

  }
);
