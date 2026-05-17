async function loadCRM() {

const token = localStorage.getItem("token");

const res = await fetch("/api/crm", {
headers: {
Authorization: "Bearer " + token
}
});

const data = await res.json();

stats.innerHTML = `
<h2>Leads: ${data.total}</h2>
<h2>Revenue: ${data.revenue} DH</h2>
`;

cities.innerHTML = data.topCities.map(c =>
`<p>${c[0]}: ${c[1]}</p>`
).join("");

leads.innerHTML = data.leads.map(l =>
`<div class="card">
<b>${l.fullname}</b> - Score: ${l.score}
</div>`
).join("");

}

loadCRM();
