let woorden = [];
let huidigeIndex = 0;
let huidigeWoord = "";
let blanks = [];
let keuzesIndex = 0;
let foutenLijst = [];
let herhaalWachtrij = [];
let beurtTeller = 0;

document.addEventListener("DOMContentLoaded", () => {
    fetch("woorden.xlsx")
        .then(res => res.arrayBuffer())
        .then(data => {
            const workbook = XLSX.read(data, { type: "array" });
            const sheet = workbook.Sheets[workbook.SheetNames[0]];
            const json = XLSX.utils.sheet_to_json(sheet, { header: ["woord", "commentaar"], defval: "" });
            woorden = json.filter(row => row.woord);
            startSpel();
        })
        .catch(err => {
            document.getElementById("woord-container").innerText = "Fout bij laden van woordenlijst.";
            console.error(err);
        });
});

function startSpel() {
    huidigeIndex = 0;
    foutenLijst = [];
    herhaalWachtrij = [];
    beurtTeller = 0;
    woorden = woorden.sort(() => Math.random() - 0.5);
    toonVolgendWoord();
}

function toonVolgendWoord() {
    beurtTeller++;

    // Kijk of er een woord in de wachtrij zit dat lang genoeg heeft gewacht
    let herhaalIndex = herhaalWachtrij.findIndex(item => beurtTeller - item.foutBeurt >= 2);
    if (herhaalIndex !== -1) {
        const item = herhaalWachtrij.splice(herhaalIndex, 1)[0];
        huidigeWoord = item.woord;
        document.getElementById("commentaar").innerText = `Hint: ${item.commentaar}`;
        blanks = [item.juiste];
        keuzesIndex = 0;

        let start = huidigeWoord.indexOf(item.juiste);
        let eind = start + item.juiste.length;

        let parts = [
            huidigeWoord.slice(0, start),
            "__",
            huidigeWoord.slice(eind)
        ];

        document.getElementById("woord-container").innerHTML = parts.join("");
        document.getElementById("feedback").innerText = "";
        return;
    }

    if (huidigeIndex >= woorden.length) {
        document.getElementById("woord-container").innerText = "Klaar!";
        document.getElementById("keuzes").style.display = "none";
        toonFouten();
        return;
    }

    const item = woorden[huidigeIndex];
    huidigeWoord = item.woord;
    document.getElementById("commentaar").innerText = `Hint: ${item.commentaar}`;
    blanks = [];
    keuzesIndex = 0;

    let temp = huidigeWoord;
    let regex = /(ei|ij)/;
    let match = regex.exec(temp);

    if (match) {
        let start = match.index;
        let eind = start + match[0].length;
        blanks.push(match[0]);

        let parts = [
            temp.slice(0, start),
            "__",
            temp.slice(eind)
        ];

        document.getElementById("woord-container").innerHTML = parts.join("");
    } else {
        document.getElementById("woord-container").innerText = temp;
    }

    document.getElementById("feedback").innerText = "";
}

function kies(keuze) {
    const juiste = blanks[keuzesIndex];
    const woordEl = document.getElementById("woord-container");

    let regex = /(ei|ij)/;
    let match = regex.exec(huidigeWoord);

    if (match) {
        let start = match.index;
        let eind = start + match[0].length;

        let gemarkeerd;

        if (keuze === juiste) {
            gemarkeerd = huidigeWoord;
        } else {
            gemarkeerd =
                huidigeWoord.slice(0, start) +
                `<span class="incorrect">${juiste}</span>` +
                huidigeWoord.slice(eind);
        }

        woordEl.innerHTML = gemarkeerd;
    }

    if (keuze !== juiste && !foutenLijst.some(f => f.woord === huidigeWoord)) {
        foutenLijst.push({
            woord: huidigeWoord,
            gekozen: keuze,
            correct: juiste
        });

        herhaalWachtrij.push({
            woord: huidigeWoord,
            juiste: juiste,
            commentaar: document.getElementById("commentaar").innerText.replace("Hint: ", ""),
            foutBeurt: beurtTeller
        });
    }

    keuzesIndex++;
    if (keuzesIndex >= blanks.length) {
        setTimeout(() => {
            huidigeIndex++;
            toonVolgendWoord();
        }, 1500);
    }
}

function toonFouten() {
    const foutenContainer = document.getElementById("fouten-lijst");
    if (foutenLijst.length === 0) {
        foutenContainer.innerText = "Goed gedaan! Geen fouten gemaakt.";
        return;
    }

    let html = "<h3>Fout beantwoorde woorden:</h3><ul>";
    foutenLijst.forEach(fout => {
        html += `<li>${fout.woord}</li>`;
    });
    html += "</ul>";
    foutenContainer.innerHTML = html;
}
