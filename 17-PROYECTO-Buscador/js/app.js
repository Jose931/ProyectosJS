//Capturamos los selectores del formulario
const year = document.querySelector("#year");
const marca = document.querySelector("#marca");
const minimo = document.querySelector("#minimo");
const maximo = document.querySelector("#maximo");
const puertas = document.querySelector("#puertas");
const transmision = document.querySelector("#transmision");

//Contenedor para los resultados
const resultado = document.querySelector("#resultado");

const color = document.querySelector("#color");

const maxYear = new Date().getFullYear();
const minYear = maxYear - 10;

//Generar objeto con la busqueda del formulario

const datosBusqueda = {
  marca: "",
  year: "",
  minimo: "",
  maximo: "",
  puertas: "",
  color: "",
  transmision: "",
};

document.addEventListener("DOMContentLoaded", () => {
  mostrarCoches(coches);

  //Llena el select de los años
  llenarSelect();
});

//-------------------EventListener para el formulario-----------------------
marca.addEventListener("change", (e) => {
  datosBusqueda.marca = e.target.value;
  flitrarCoche();
});

year.addEventListener("change", (e) => {
  datosBusqueda.year = parseInt(e.target.value);
  flitrarCoche();
});

maximo.addEventListener("change", (e) => {
  datosBusqueda.maximo = e.target.value;
  flitrarCoche();
});

minimo.addEventListener("change", (e) => {
  datosBusqueda.minimo = e.target.value;
  flitrarCoche();
});

puertas.addEventListener("change", (e) => {
  datosBusqueda.puertas = parseInt(e.target.value);
  flitrarCoche();
});

color.addEventListener("change", (e) => {
  datosBusqueda.color = e.target.value;
  flitrarCoche();
});

transmision.addEventListener("change", (e) => {
  datosBusqueda.transmision = e.target.value;
  flitrarCoche();
});

//---------------------------------FUNCIONES--------------------------------------------------

function mostrarCoches(coches) {
  limpiarHTML();
  coches.forEach((coche) => {
    const { marca, modelo, year, puertas, transmision, precio, color } = coche;
    const cocheHTML = document.createElement("P");

    cocheHTML.textContent = `
            ${marca} ${modelo} - ${year} - ${puertas} Puertas - Transmision:${transmision}
             - precio: ${precio} - color: ${color}
        `;

    resultado.appendChild(cocheHTML);
  });
}

//Limpiar HTML

function limpiarHTML() {
  while (resultado.firstChild) {
    resultado.removeChild(resultado.firstChild);
  }
}

function llenarSelect() {
  for (let i = maxYear; i > minYear; i--) {
    const opcion = document.createElement("option");
    opcion.value = i;
    opcion.textContent = i;
    year.appendChild(opcion);
  }
}

function flitrarCoche() {
  const resultado = coches
    .filter(filtrarMarca)
    .filter(filtrarYear)
    .filter(filtrarMinimo)
    .filter(filtrarMaximo)
    .filter(filtrarPuertas)
    .filter(filtrarTransmision)
    .filter(filtrarColor);

  if (resultado.length) {
    mostrarCoches(resultado);
  } else {
    noResultado();
  }
}

function noResultado() {
  limpiarHTML();

  const noResultado = document.createElement("DIV");
  noResultado.classList.add("alerta", "error");
  noResultado.textContent = "No hay resultados, intenta con otros terminos de busqueda";
  resultado.appendChild(noResultado);
}

//--------------------------------FUNCIONES FILTRO---------------------------

function filtrarMarca(coche) {
  if (datosBusqueda.marca) {
    return coche.marca === datosBusqueda.marca;
  }
  return coche;
}

function filtrarYear(coche) {
  if (datosBusqueda.year) {
    return coche.year === datosBusqueda.year;
  }
  return coche;
}

function filtrarMinimo(coche) {
  const { minimo } = datosBusqueda;

  if (minimo) {
    return coche.precio >= minimo;
  }

  return coche;
}

function filtrarMaximo(coche) {
  const { maximo } = datosBusqueda;

  if (maximo) {
    return coche.precio <= maximo;
  }

  return coche;
}

function filtrarPuertas(coche) {
  const { puertas } = datosBusqueda;

  if (puertas) {
    return coche.puertas === puertas;
  }

  return coche;
}

function filtrarTransmision(coche) {
  const { transmision } = datosBusqueda;

  if (transmision) {
    return coche.transmision === transmision;
  }

  return coche;
}

function filtrarColor(coche) {
  const { color } = datosBusqueda;

  if (color) {
    return coche.color === color;
  }

  return coche;
}
