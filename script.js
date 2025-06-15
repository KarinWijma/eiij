let woorden = [];
let huidigeIndex = 0;
let huidigeWoord = "";
let blanks = [];
let keuzesIndex = 0;

document.addEventListener("DOMContentLoaded", () => {
    fetch("woorden.xlsx")
        .then(res => res.arrayBuffer())
        .then(data => {
            const workbook = XLSX.read(data, { type: "array" });
            const sheet = workbook.Sheets[workbook.SheetNames[0]];
            const json = XLSX.utils.sheet_to_json(sheet, { header: ["woord", "commentaar"], defval: "" });
            woorden = json.filter(row => row.woord); // filter lege rijen
            startSpel();
        })
        .catch(err => {
            document.getElementById("woord-container").innerText = "Fout bij laden van woordenlijst.";
            console.error(err);
        });
});

function startSpel() {
    huidigeIndex = 0;
    toonVolgendWoord();
}

function toonVolgendWoord() {
    if (huidigeIndex >= woorden.length) {
        document.getElementById("woord-container").innerText = "Klaar!";
        document.getElementById("keuzes").style.display = "none";
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
        // Geen ei/ij gevonden, toon het woord gewoon
        document.getElementById("woord-container").innerText = temp;
    }

    document.getElementById("feedback").innerText = "";
}

function kies(keuze) {
    const juiste = blanks[keuzesIndex];
    const woordEl = document.getElementById("woord-container");
    const huidigHTML = woordEl.innerHTML;
    const split = huidigHTML.split("__");
    let kleur = keuze === juiste ? "correct" : "incorrect";
    let correctie = `<span class="${kleur}">${juiste}</span>`;
    split[keuzesIndex] += correctie;
    woordEl.innerHTML = split.join("__");
    keuzesIndex++;
    if (keuzesIndex >= blanks.length) {
        setTimeout(() => {
            huidigeIndex++;
            toonVolgendWoord();
        }, 1500);
    }
}
