let inicioTiempo = 0
let intervalo

let tiempos = []
let finalizados = []
let primerLugar = null
let totalCorredores = 0
let carreraIniciada = false


function crearCorredores(){

    const contenedor = document.getElementById("corredores")
    const panel = document.getElementById("panelBotones")

    contenedor.innerHTML = ""
    panel.innerHTML = ""

    totalCorredores = parseInt(document.getElementById("numCorredores").value)

    
    if(isNaN(totalCorredores) || totalCorredores <= 0){
        alert("Ingrese un número válido de corredores (mayor que 0)")
        return
    }

    tiempos = new Array(totalCorredores).fill(0)
    finalizados = new Array(totalCorredores).fill(false)

    primerLugar = null
    carreraIniciada = false

    clearInterval(intervalo)

    for(let i=0;i<totalCorredores;i++){

        const div = document.createElement("div")
        div.className = "corredor"

        div.innerHTML = `
            <h3>Corredor ${i+1}</h3>
            <div class="tiempo" id="tiempo${i}">00:00.000</div>
            <div id="dif${i}"></div>
        `

        contenedor.appendChild(div)

        
        const boton = document.createElement("button")

        boton.innerText = "Detener Corredor " + (i+1)

        boton.onclick = function(){
            detener(i)
        }

        panel.appendChild(boton)
    }
}


function iniciarCarrera(){

    if(totalCorredores === 0) return

    
    primerLugar = null

    for(let i=0;i<totalCorredores;i++){

        finalizados[i] = false
        tiempos[i] = 0

        let tiempoElemento = document.getElementById("tiempo"+i)
        let difElemento = document.getElementById("dif"+i)

        if(tiempoElemento) tiempoElemento.innerText = "00:00.000"
        if(difElemento) difElemento.innerText = ""
    }

    inicioTiempo = Date.now()
    carreraIniciada = true

    clearInterval(intervalo)

    intervalo = setInterval(()=>{

        let ahora = Date.now()

        for(let i=0;i<totalCorredores;i++){

            if(!finalizados[i]){

                let t = ahora - inicioTiempo

                let elemento = document.getElementById("tiempo"+i)

                if(elemento){
                    elemento.innerText = formatearTiempo(t)
                }

            }

        }

    },10)

}


function detener(i){

    if(!carreraIniciada) return

    if(finalizados[i]) return

    const tiempoFinal = Date.now() - inicioTiempo

    tiempos[i] = tiempoFinal
    finalizados[i] = true

    document.getElementById("tiempo"+i).innerText =
        formatearTiempo(tiempoFinal)

    if(primerLugar === null){

        primerLugar = tiempoFinal

        document.getElementById("dif"+i).innerText =
            "🥇 Primer lugar"

    }else{

        let dif = tiempoFinal - primerLugar

        document.getElementById("dif"+i).innerText =
            "Diferencia: +" + formatearTiempo(dif)
    }

}


function formatearTiempo(ms){

    let minutos = Math.floor(ms/60000)
    let segundos = Math.floor((ms%60000)/1000)
    let miliseg = ms%1000

    return `${String(minutos).padStart(2,'0')}:`+
           `${String(segundos).padStart(2,'0')}.`+
           `${String(miliseg).padStart(3,'0')}`
}
function exportarPDF(){

    const { jsPDF } = window.jspdf

    let doc = new jsPDF()

    doc.setFontSize(18)
    doc.text("Resultados de la Carrera", 20, 20)

    let y = 40

    for(let i=0;i<totalCorredores;i++){

        let tiempo = formatearTiempo(tiempos[i])

        let texto = ""

        if(tiempos[i] === 0){
            texto = "Corredor " + (i+1) + ": No finalizó"
        }
        else if(tiempos[i] === primerLugar){
            texto = "Corredor " + (i+1) + ": " + tiempo + " (Primer lugar)"
        }
        else{
            let dif = tiempos[i] - primerLugar
            texto = "Corredor " + (i+1) + ": " + tiempo +
                    "  Diferencia: +" + formatearTiempo(dif)
        }

        doc.text(texto, 20, y)

        y += 10
    }

    doc.save("resultados_carrera.pdf")
}