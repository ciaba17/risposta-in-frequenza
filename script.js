const canvas = document.getElementById("scopeCanvas");
const ctx = canvas.getContext("2d");
canvas.width = canvas.clientWidth;
canvas.height = canvas.clientHeight;

// dati iniziali
let dati = [
    { f: 10, ratio: 0.99 },
    { f: 50, ratio: 0.97 },
    { f: 100, ratio: 0.93 },
    { f: 500, ratio: 0.75 },
    { f: 1000, ratio: 0.55 },
    { f: 5000, ratio: 0.2 }
];

function drawScope() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const padding = 60;
    const width = canvas.width - padding * 2;
    const height = canvas.height - padding * 2;

    const minF = Math.log10(dati[0].f);
    const maxF = Math.log10(dati[dati.length - 1].f);

    // assi
    ctx.strokeStyle = "#00ff66";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(padding, canvas.height - padding);
    ctx.lineTo(canvas.width - padding, canvas.height - padding);
    ctx.lineTo(canvas.width - padding, padding);
    ctx.stroke();

    // curva
    ctx.strokeStyle = "#00ff99";
    ctx.shadowBlur = 15;
    ctx.shadowColor = "#00ff66";
    ctx.lineWidth = 2;
    ctx.beginPath();

    dati.forEach((p, i) => {
        const x = padding + ((Math.log10(p.f) - minF) / (maxF - minF)) * width;
        const y = canvas.height - padding - p.ratio * height;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
    });
    ctx.stroke();

    // etichette
    ctx.shadowBlur = 0;
    ctx.fillStyle = "#00ff66";
    ctx.font = "12px monospace";
    ctx.fillText("Frequenza (Hz)", canvas.width / 2 - 70, canvas.height - 20);
    ctx.save();
    ctx.translate(20, canvas.height / 2 + 60);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText("Vout / Vin", 0, 0);
    ctx.restore();
}

// aggiorna dati
function aggiornaDati() {
    const freqValues = document.getElementById("freqInput").value
        .split(",")
        .map(v => parseFloat(v.trim()))
        .filter(v => !isNaN(v));

    const vinValues = document.getElementById("vinInput").value
        .split(",")
        .map(v => parseFloat(v.trim()))
        .filter(v => !isNaN(v));

    const voutValues = document.getElementById("voutInput").value
        .split(",")
        .map(v => parseFloat(v.trim()))
        .filter(v => !isNaN(v));

    if (
        freqValues.length === vinValues.length &&
        vinValues.length === voutValues.length &&
        freqValues.length > 1
    ) {
        dati = freqValues.map((f, i) => ({
            f,
            ratio: voutValues[i] / vinValues[i]
        }));
    } else {
        alert("Errore: controlla che gli array abbiano la stessa lunghezza e valori numerici validi.");
    }
}

// associa click al bottone
document.getElementById("updateBtn").addEventListener("click", aggiornaDati);

// **Simula click all’avvio**
window.onload = () => {
    document.getElementById("updateBtn").click();
};

function animate() {
    drawScope();
    requestAnimationFrame(animate);
}

animate();
