// Karte erstellen
const map = L.map("map").setView([51.1657, 10.4515], 6);

// Dunkle Karte
L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
    attribution: "&copy; OpenStreetMap & CARTO",
    subdomains: "abcd",
    maxZoom: 19
}).addTo(map);

// Deutschland begrenzen
map.setMaxBounds([
    [47.2, 5.5],
    [55.2, 15.7]
]);

// Daten laden
fetch("data.json")
.then(response => response.json())
.then(orte => {

    let gesamtFaelle = 0;
    const bundeslaender = new Set();
    const markerListe = [];

    orte.forEach(ort => {

        gesamtFaelle += ort.faelle;
        bundeslaender.add(ort.bundesland);

        const marker = L.marker([ort.lat, ort.lng])
            .addTo(map)
            .bindPopup(`
                <h3>${ort.stadt}</h3>
                <p><b>Dokumentierte Fälle:</b> ${ort.faelle}</p>
                <p><b>Bundesland:</b> ${ort.bundesland}</p>
                <p><b>Datum:</b> ${ort.datum}</p>
            `);

        markerListe.push({
            marker,
            ort
        });

    });

    document.getElementById("caseCount").textContent = gesamtFaelle;
    document.getElementById("cityCount").textContent = orte.length;
    document.getElementById("stateCount").textContent = bundeslaender.size;

    const suche = document.getElementById("search");

    suche.addEventListener("input", function () {

        const text = this.value.toLowerCase();

        const treffer = markerListe.find(e =>
            e.ort.stadt.toLowerCase().includes(text)
        );

        if (treffer) {
            map.flyTo([treffer.ort.lat, treffer.ort.lng], 10);
            treffer.marker.openPopup();
        }

    });

});