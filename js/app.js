// Constructores
function Seguro(marca, year, tipo) {
    this.marca = marca;
    this.year = year;
    this.tipo = tipo;
}

Seguro.prototype.cotizarSeguro = function() {
    /**
     * 1 = Americano 1.15
     * 2 = Asiatico 1.05
     * 3 = Europeo 1.35
     */
    let cantidad;
    const base = 2000;

    switch (this.marca) {
        case '1':
            cantidad = base * 1.15;
            break;
        case '2':
            cantidad = base * 1.05;
            break;
        case '3':
            cantidad = base * 1.35;
            break;
        default:
            break;
    }

    // Leer el año
    const yearActual = new Date().getFullYear();
    // console.log(yearActual);

    // Cada año que la diferencia es mayor, el costo va a reducirse un 3%
    const diferencia = yearActual - this.year;
    cantidad -= cantidad * ( ( diferencia * 3) / 100 )

    /**
     * Si el seguro es basico se multiplica por un 30% más
     * Si el seguro es basico se multiplica por un 50% más
     */

    if (this.tipo === 'basico') {
        cantidad *= 1.3;
    } else {
        cantidad *= 1.5;
    }

    return cantidad;
}

function UI() {}

// Llenar las opciones de los años
UI.prototype.llenarOpciones = () => {
    const max = new Date().getFullYear(); // 2023
    const min = max - 20;                 // 2003
    const year = document.querySelector('#year');

    for(let i = max; i >= min; i--) {
        const opcion = document.createElement('OPTION');
        opcion.textContent = i;
        opcion.value = i;
        year.appendChild(opcion);
    }

}

UI.prototype.mostrarMensaje = (mensaje, tipo) => {

    const mensajeError = document.createElement('DIV');

    if (tipo == 'error') {
        mensajeError.classList.add('error');
    } else {
        mensajeError.classList.add('correcto');
    }

    mensajeError.classList.add('mensaje', 'mt-10');
    mensajeError.textContent = mensaje;
    
    const formulario = document.querySelector('#cotizar-seguro');
    formulario.insertBefore(mensajeError, document.querySelector('#resultado'))

    setTimeout(() => {
        mensajeError.remove();
    }, 3000);
}

UI.prototype.mostrarResultado = (seguro, total) => {

    const {marca, year, tipo} = seguro;
    let textoMarca;

    switch (marca) {
        case '1':
            textoMarca = 'Americano'
            break;
        case '2':
            textoMarca = 'Asiatico'
            break;
        case '3':
            textoMarca = 'Europeo'
            break;
        default:
            break;
    }

    const div = document.createElement('DIV');
    div.classList.add('mt-10');

    div.innerHTML = `
        <p class="header">Tu resumen</p>
        <p class="font-bold">Marca: <span class="font-normal">${textoMarca}</span></p>
        <p class="font-bold">Año: <span class="font-normal">${year}</span></p>
        <p class="font-bold">Tipo: <span class="font-normal capitalize">${tipo}</span></p>
        <p class="font-bold">Total: <span class="font-normal">$${total}</span></p>
    `;

    const resultadoDiv = document.querySelector('#resultado');
    
    const spinner = document.querySelector('#cargando');
    spinner.style.display = 'block';
    
    setTimeout(() => {
        spinner.style.display = 'none';
        resultadoDiv.appendChild(div);
    }, 3000);
}

// Instanciar UI
const ui = new UI();

document.addEventListener('DOMContentLoaded', () => {
    ui.llenarOpciones(); // Llenar el Select de año
})

eventListeners();
function eventListeners() {
    const formulario = document.querySelector('#cotizar-seguro');
    formulario.addEventListener('submit', cotizarSeguro);
}

function cotizarSeguro(e) {
    e.preventDefault();

    const marca = document.querySelector('#marca').value;
    // console.log(marca);

    const year = document.querySelector('#year').value;
    // console.log(year);

    const tipo = document.querySelector('input[name="tipo"]:checked').value;

    if ( marca === '' || year === '' || tipo === '') {
        ui.mostrarMensaje('Faltan datos, no pueden ir vacíos...', 'error');
        return;
    }

    const resultados = document.querySelector('#resultado div');
    console.log(resultados);

    if (resultados != null) {
        resultados.remove();
    }

    ui.mostrarMensaje('Procesando', 'correcto');

    // Instanciar el seguro
    const seguro = new Seguro(marca, year, tipo);
    const total = seguro.cotizarSeguro();

    // Utilizar prototype que va a cotizar
    ui.mostrarResultado(seguro, total);
}