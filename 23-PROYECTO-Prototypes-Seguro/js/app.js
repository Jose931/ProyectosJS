//Constructores

function Seguro(marca, year, tipo) {
  this.marca = marca;
  this.year = year;
  this.tipo = tipo;
}

function UI() {}
//-------------------------------PROTOTYPES--------------------------------------------------------

//Realiza la cotizacion segun los datos
Seguro.prototype.cotizarSeguro = function () {
  let cantidad;
  const base = 2000;

  switch (this.marca) {
    case "1":
      cantidad = base * 1.15;
      break;
    case "2":
      cantidad = base * 1.05;
      break;
    case "3":
      cantidad = base * 1.35;
      break;
    default:
      break;
  }

  //Leer el año -> Cada año que la diferencia es mayor el coste se reduce un 3%
  const diferencia = new Date().getFullYear() - this.year;
  cantidad -= (diferencia * 3 * cantidad) / 100;

  /*
    Si el seguro es basico se multiplica un 30% mas
    Si el seguro es basico se multiplica un 50% mas
  */

  if (this.tipo === "basico") {
    cantidad *= 1.3;
  } else {
    cantidad *= 1.5;
  }

  return cantidad;
};

//Llena las opciones de los años
UI.prototype.llenarOpciones = () => {
  const max = new Date().getFullYear();
  const min = max - 20;

  const selectYear = document.querySelector("#year");

  for (let i = max; i > min; i--) {
    let option = document.createElement("option");
    option.value = i;
    option.textContent = i;
    selectYear.appendChild(option);
  }
};

//Muestra alertas en pantalla
UI.prototype.mostrarMensaje = (mensaje, tipo) => {
  const div = document.createElement("DIV");
  if (tipo === "error") {
    div.classList.add("error");
  } else {
    div.classList.add("correcto");
  }

  div.classList.add("mensaje", "mt-10");
  div.textContent = mensaje;

  //Insertar el HTML
  const formulario = document.querySelector("#cotizar-seguro");
  formulario.insertBefore(div, document.querySelector("#resultado"));
  setTimeout(() => {
    div.remove();
  }, 3000);
};

UI.prototype.mostrarResultado = (total, seguro) => {
  const { marca, year, tipo } = seguro;

  let textoMarca;

  switch (marca) {
    case "1":
        textoMarca = 'Americano';
      break;
    case "2":
        textoMarca = 'Asiatico';
      break;
    case "3":
        textoMarca = 'Europeo';
      break;
    default:
      break;
  }
  //Creando el resultado
  const div = document.createElement("DIV");
  div.classList.add("mt-10");
  div.innerHTML = `
        <p class="header">Tu Resumen</p>
        <p class="font-bold">Marca: <span class="font-normal">${textoMarca}</span></p>
        <p class="font-bold">Año: <span class="font-normal">${year}</span></p>
        <p class="font-bold">Tipo: <span class="font-normal capitalize">${tipo}</span></p>
        <p class="font-bold">Total: <span class="font-normal">${total}€</span></p>
    `;

  const resultadoDiv = document.querySelector("#resultado");

  //Mostrar el spinner

  const spinner = document.querySelector("#cargando");
  spinner.style.display = "block";
  setTimeout(() => {
    spinner.style.display = "none";
    resultadoDiv.appendChild(div);
  }, 3000);
};

//Instanciar UI
const ui = new UI();

document.addEventListener("DOMContentLoaded", () => {
  ui.llenarOpciones();
});

enventListeners();
function enventListeners() {
  const formulario = document.querySelector("#cotizar-seguro");
  formulario - addEventListener("submit", cotizarSeguro);
}

function cotizarSeguro(e) {
  e.preventDefault();
  const marca = document.querySelector("#marca").value;
  const year = document.querySelector("#year").value;
  const tipo = document.querySelector('input[name="tipo"]:checked').value;

  if (marca === "" || year === "" || tipo === "") {
    ui.mostrarMensaje("Todos los campos son obligatorios", "error");
    return;
  }

  ui.mostrarMensaje("Cotizando...", "exito");

  //Ocultar las cotizacione previas
  const resultados = document.querySelector("#resultado div");
  if (resultados != null) {
    resultados.remove();
  }

  //Instanciar Seguro
  const seguro = new Seguro(marca, year, tipo);
  const total = seguro.cotizarSeguro();

  //Utilizar el protoype que va a cotizar
  ui.mostrarResultado(total, seguro);
}
