const canvases = [
    document.getElementById("scope1"),
    document.getElementById("scope2"),
    document.getElementById("scope3"),
    document.getElementById("scope4")
];
const ctxs = canvases.map(c => c.getContext("2d"));

// dati iniziali
let dati = {
    f: [20,40,60,80,100,120,140,160,180,200],
    vin: [21.12,21.08,21.22,21.03,20.00,20.25,20.14,20.03,20.07,20.19],
    vout: [2.42,4.93,6.81,8.41,9.44,10.31,10.88,11.13,11.22,11.48],
    fase: [93.60,74.88,66.64,48.96,39.60,30.24,24.19,17.86,13.61,8.64]
};

// funzione per disegnare un grafico
function drawGraph(ctx, xData, yData, xLabel, yLabel, log=false) {
    ctx.canvas.width = ctx.canvas.clientWidth;
    ctx.canvas.height = ctx.canvas.clientHeight;
    const padding = 50;
    const width = ctx.canvas.width - padding*2;
    const height = ctx.canvas.height - padding*2;

    // calcola min/max
    const minX = log ? Math.log10(Math.min(...xData)) : Math.min(...xData);
    const maxX = log ? Math.log10(Math.max(...xData)) : Math.max(...xData);
    const minY = log ? Math.log10(Math.min(...yData)) : Math.min(...yData);
    const maxY = log ? Math.log10(Math.max(...yData)) : Math.max(...yData);

    // pulizia
    ctx.clearRect(0,0,ctx.canvas.width,ctx.canvas.height);

    // assi
    ctx.strokeStyle = "#00ff66";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(padding, ctx.canvas.height - padding);
    ctx.lineTo(ctx.canvas.width - padding, ctx.canvas.height - padding);
    ctx.lineTo(ctx.canvas.width - padding, padding);
    ctx.stroke();

    // curva liscia
    ctx.strokeStyle = "#00ff99";
    ctx.shadowBlur = 15;
    ctx.shadowColor = "#00ff66";
    ctx.lineWidth = 2;
    ctx.beginPath();

    for(let i=0; i<xData.length; i++){
        const xVal = log ? Math.log10(xData[i]) : xData[i];
        const yVal = log ? Math.log10(yData[i]) : yData[i];

        const x = padding + ((xVal - minX)/(maxX - minX))*width;
        const y = ctx.canvas.height - padding - ((yVal - minY)/(maxY - minY))*height;

        if(i===0) ctx.moveTo(x,y);
        else{
            const prevXVal = log ? Math.log10(xData[i-1]) : xData[i-1];
            const prevYVal = log ? Math.log10(yData[i-1]) : yData[i-1];
            const prevX = padding + ((prevXVal - minX)/(maxX - minX))*width;
            const prevY = ctx.canvas.height - padding - ((prevYVal - minY)/(maxY - minY))*height;
            const midX = (prevX + x)/2;
            const midY = (prevY + y)/2;
            ctx.quadraticCurveTo(prevX, prevY, midX, midY);
        }
    }
    ctx.stroke();

    // etichette
    ctx.shadowBlur = 0;
    ctx.fillStyle = "#00ff66";
    ctx.font = "12px monospace";
    ctx.fillText(xLabel, ctx.canvas.width/2 - 40, ctx.canvas.height - 10);
    ctx.save();
    ctx.translate(20, ctx.canvas.height/2 + 20);
    ctx.rotate(-Math.PI/2);
    ctx.fillText(yLabel, 0, 0);
    ctx.restore();
}

// aggiorna dati dai campi input
function aggiornaDati() {
    const freq = document.getElementById("freqInput").value.split(",").map(v=>parseFloat(v.trim()));
    const vin = document.getElementById("vinInput").value.split(",").map(v=>parseFloat(v.trim()));
    const vout = document.getElementById("voutInput").value.split(",").map(v=>parseFloat(v.trim()));
    const fase = document.getElementById("faseInput").value.split(",").map(v=>parseFloat(v.trim()));

    if(freq.length===vin.length && vin.length===vout.length && vout.length===fase.length){
        dati.f = freq;
        dati.vin = vin;
        dati.vout = vout;
        dati.fase = fase;
    } else alert("Errore: controlla i dati");
}

// click bottone
document.getElementById("updateBtn").addEventListener("click", ()=>{
    aggiornaDati();
});

// disegno continuo
function animate(){
    drawGraph(ctxs[0], dati.f, dati.vout.map((v,i)=>v/dati.vin[i]), "Frequenza (Hz)", "Vout / Vin");
    drawGraph(ctxs[1], dati.f, dati.fase, "Frequenza (Hz)", "Fase (°)");
    drawGraph(ctxs[2], dati.f, dati.vout.map((v,i)=>v/dati.vin[i]), "Frequenza (Hz)", "Vout / Vin", true);
    drawGraph(ctxs[3], dati.f, dati.fase, "Frequenza (Hz)", "Fase (°)", true);
    requestAnimationFrame(animate);
}

window.onload = ()=>{
    document.getElementById("updateBtn").click();
    animate();
};
