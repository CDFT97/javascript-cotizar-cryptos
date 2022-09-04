const criptomonedasSelect =  document.querySelector('#criptomonedas');
const monedaSelect =  document.querySelector('#moneda');
const formulario = document.querySelector('#formulario');
const divResultado = document.querySelector('#resultado');

const objBusqueda = {
    moneda: '',
    criptomoneda: ''
}

// crear promise la cual espera a que toda la info de la peticion fetch este completa
const obtenerCriptomonedas = criptomonedas => new Promise(resolve =>{
    resolve(criptomonedas);
});

document.addEventListener('DOMContentLoaded', () =>{
    consultarCriptomonedas();    

    formulario.addEventListener('submit', submitFormulario);

    criptomonedasSelect.addEventListener('change', leerValor);

    monedaSelect.addEventListener('change', leerValor);
});

function consultarCriptomonedas(){
    
    const url= 'https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=USD';

    fetch(url)
        .then(respuesta => respuesta.json())
        .then(dato => obtenerCriptomonedas(dato.Data))
        .then( criptomonedas => llenarSelect(criptomonedas))
}

function llenarSelect(criptomonedas){
    criptomonedas.forEach(cripto => {
        const { FullName, Name} = cripto.CoinInfo;
        const option = document.createElement('option');
        option.value= Name;
        option.textContent =  FullName;
        criptomonedasSelect.appendChild(option);
    });
}

function leerValor(e){
    objBusqueda[e.target.name] = e.target.value;
}

function submitFormulario(e){
    e.preventDefault();

    // validar
    const {moneda, criptomoneda} = objBusqueda;

    if(moneda === '' || criptomoneda === ''){
        mostrarAlerta('Ambos campos son obligatorios');
        return;
    }

    // consultarAPI

    consultarAPI();
}

function mostrarAlerta(mensaje){

    const existeError = document.querySelector('.error');

    if(!existeError)
    {
        const divMensaje = document.createElement('div');
        divMensaje.classList.add('error');
        divMensaje.textContent =  mensaje;
        formulario.appendChild(divMensaje);

        setTimeout(() => {
            divMensaje.remove();
        }, 3000);
    }
}

function consultarAPI(){
    const {moneda,criptomoneda} = objBusqueda;

    mostrarSpinner();

    const url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${criptomoneda}&tsyms=${moneda}`;

    fetch(url)
        .then( respuesta => respuesta.json())
        .then( cotizacion => mostrarCotizacion(cotizacion.DISPLAY[criptomoneda][moneda]))

}

function mostrarCotizacion(cotizacion){
    // console.log(cotizacion);
    limpiarHTML();

    const { PRICE, HIGHDAY, LOWDAY, CHANGEPCT24HOUR, LASTUPDATE, CHANGE24HOUR, CHANGEHOUR} = cotizacion;


    const precio = document.createElement('p');
    precio.classList.add('precio');
    precio.innerHTML = `
        El precio es:  <span> ${PRICE} </span> <br>
        Precio más alto del día: <span> ${HIGHDAY} </span><BR>
        Precio más bajo del día: <span> ${LOWDAY} </span><BR>
        Variación últimas 24 horas: <span> ${CHANGEPCT24HOUR} % </span><br>
        Última actualización: <span> ${LASTUPDATE} </span> <br>
        Cambio el último día: <span> ${CHANGE24HOUR} </span>
        Cambio en la última hora: <span> ${CHANGEHOUR} </span>
    `;
    divResultado.appendChild(precio);
}

function limpiarHTML(){
    while (divResultado.firstChild) {
        divResultado.removeChild(divResultado.firstChild);
    }
}

function mostrarSpinner(){
    limpiarHTML();

    const spinner = document.createElement('div');
    spinner.classList.add('sk-chase');

    spinner.innerHTML = `
        <div class="sk-chase-dot"></div>
        <div class="sk-chase-dot"></div>
        <div class="sk-chase-dot"></div>
        <div class="sk-chase-dot"></div>
        <div class="sk-chase-dot"></div>
        <div class="sk-chase-dot"></div>
    `;

    divResultado.appendChild(spinner);
}