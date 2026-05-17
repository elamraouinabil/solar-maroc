// =====================================
// SOLAR SIMULATION
// =====================================

async function simulate() {

  const data = {

    fullname:
      document.getElementById(
        "fullname"
      ).value,

    city:
      document.getElementById(
        "city"
      ).value,

    phone:
      document.getElementById(
        "phone"
      ).value,

    electricity_bill:
      document.getElementById(
        "bill"
      ).value

  };

  const res =
    await fetch(

      "/api/simulate",

      {

        method: "POST",

        headers: {
          "Content-Type":
            "application/json"
        },

        body:
          JSON.stringify(
            data
          )

      }

    );

  const r =
    await res.json();

  document.getElementById(
    "result"
  ).innerHTML = `

    <h3>
      ✅ Résultat
    </h3>

    🔋 Panneaux:
    ${r.panels}

    <br><br>

    ⚡ Puissance:
    ${r.kw} kW

    <br><br>

    💰 Coût:
    ${r.cost} DH

    <br><br>

    📉 Économie:
    ${r.saving} DH/mois

    <br><br>

    📈 ROI:
    ${r.roi} ans

    <br><br>

    🧠 ${r.recommendation}

    <br><br>

    <a
      href="${r.pdf}"
      target="_blank"
    >
      📄 Télécharger PDF
    </a>

  `;

  // =====================================
  // WHATSAPP AUTO
  // =====================================

  const message = `

Bonjour Solar Maroc ☀️

Je souhaite une installation solaire.

👤 Nom: ${data.fullname}

📍 Ville: ${data.city}

⚡ Facture: ${data.electricity_bill} DH

🔋 Panneaux: ${r.panels}

⚡ Puissance: ${r.kw} kW

💰 Coût: ${r.cost} DH

📈 ROI: ${r.roi} ans

`;

  const phone =
    "212600000000";

  document.getElementById(
    "whatsappBtn"
  ).href =

  `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

}

// =====================================
// CHATBOT IA
// =====================================

async function chat() {

  const input =
    document.getElementById(
      "msg"
    );

  const message =
    input.value;

  if (!message) return;

  const chatbox =
    document.getElementById(
      "chatbox"
    );

  chatbox.innerHTML += `

    <div>
      <b>Vous:</b>
      ${message}
    </div>

  `;

  const res =
    await fetch(

      "/api/chatbot",

      {

        method: "POST",

        headers: {
          "Content-Type":
            "application/json"
        },

        body:
          JSON.stringify({
            message
          })

      }

    );

  const data =
    await res.json();

  chatbox.innerHTML += `

    <div
      style="
      margin-top:10px;
      color:#22c55e;
      "
    >
      <b>IA:</b>
      ${data.reply}
    </div>

    <hr>

  `;

  chatbox.scrollTop =
    chatbox.scrollHeight;

  input.value = "";

}
