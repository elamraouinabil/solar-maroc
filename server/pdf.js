const PDFDocument = require('pdfkit');

function generateQuotePDF(data, res) {

  const doc = new PDFDocument({ margin: 50 });

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader(
    'Content-Disposition',
    'inline; filename=devis-solaire.pdf'
  );

  doc.pipe(res);

  // =============================
  // HEADER
  // =============================
  doc
    .fontSize(22)
    .text('☀️ Solar Maroc - Devis Installation Solaire', {
      align: 'center'
    });

  doc.moveDown();

  doc
    .fontSize(12)
    .text(`Date: ${new Date().toLocaleDateString()}`);

  doc.moveDown();

  // =============================
  // CLIENT
  // =============================
  doc.fontSize(16).text('👤 Client');

  doc.fontSize(12)
    .text(`Nom: ${data.fullname}`)
    .text(`Ville: ${data.city}`)
    .text(`Téléphone: ${data.phone}`);

  doc.moveDown();

  // =============================
  // TECHNIQUE
  // =============================
  doc.fontSize(16).text('⚡ Configuration solaire');

  doc.fontSize(12)
    .text(`Consommation: ${data.consumption} kWh/mois`)
    .text(`Panneaux nécessaires: ${data.panels}`)
    .text(`Puissance installée: ${data.kw} kW`);

  doc.moveDown();

  // =============================
  // PRIX
  // =============================
  doc.fontSize(16).text('💰 Estimation financière');

  doc.fontSize(12)
    .text(`Coût total: ${data.cost} DH`)
    .text(`Économie mensuelle: ${data.saving} DH`)
    .text(`Retour sur investissement: ${data.roi} ans`);

  doc.moveDown();

  // =============================
  // FOOTER
  // =============================
  doc
    .fontSize(10)
    .text(
      'Document généré automatiquement par Solar Maroc SaaS',
      { align: 'center' }
    );

  doc.end();
}

module.exports = { generateQuotePDF };
