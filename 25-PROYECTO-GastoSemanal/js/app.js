//---------------------------------Variables y selectores-------------------------------------------
const formulario = document.querySelector("#agregar-gasto");
const gastoListado = document.querySelector("#gastos ul");

//-------------------------------------Eventos------------------------------------------------------
eventListeners();

function eventListeners() {
  document.addEventListener("DOMContentLoaded", preguntasPresupuesto);
  formulario.addEventListener("submit", agregarGasto);
}

//---------------------------------------Clases-----------------------------------------------------
class Presupuesto {
  constructor(presupuesto) {
    this.presupuesto = Number(presupuesto);
    this.restante = Number(presupuesto);
    this.gastos = [];
  }

  nuevoGasto(gasto) {
    this.gastos = [...this.gastos, gasto];
    this.calcularRestante();
  }

  calcularRestante() {
    const gastado = this.gastos.reduce(
      (total, gasto) => total + gasto.cantidad,
      0
    );
    this.restante = this.presupuesto - gastado;
  }

  eliminarGasto(id) {
    this.gastos = this.gastos.filter((gasto) => gasto.id !== id);
    this.calcularRestante();
  }
}

class UI {
  insertarPresupuesto(cantidad) {
    const { presupuesto, restante } = cantidad;

    document.querySelector("#total").textContent = presupuesto;
    document.querySelector("#restante").textContent = restante;
  }

  imprimirAlerta(mensaje, tipo) {
    const divMensaje = document.createElement("DIV");
    divMensaje.classList.add("text-center", "alert");

    if (tipo === "error") {
      divMensaje.classList.add("alert-danger");
    } else {
      divMensaje.classList.add("alert-success");
    }

    divMensaje.textContent = mensaje;

    document.querySelector(".primario").insertBefore(divMensaje, formulario);

    setTimeout(() => {
      divMensaje.remove();
    }, 3000);
  }

  mostrarGastoListados(gastos) {
    this.limpiarHTML();

    gastos.forEach((gasto) => {
      const { nombre, cantidad, id } = gasto;
      const nuevoGasto = document.createElement("li");
      nuevoGasto.className =
        "list-group-item d-flex justify-content-between align-items-center";
      nuevoGasto.dataset.id = id;

      nuevoGasto.innerHTML = `
                ${nombre} <span class="badge badge-primary badge-pill">${cantidad}€</span>
            `;

      const btnBorrar = document.createElement("button");
      btnBorrar.innerHTML = "Borrar &times;";
      btnBorrar.onclick = () => {
        eliminarGasto(id);
      };
      btnBorrar.classList.add("btn", "btn-danger", "borrar-gasto");

      nuevoGasto.appendChild(btnBorrar);
      gastoListado.appendChild(nuevoGasto);
    });
  }

  limpiarHTML() {
    while (gastoListado.firstChild) {
      gastoListado.removeChild(gastoListado.firstChild);
    }
  }

  actualizarRestante(restante) {
    document.querySelector("#restante").textContent = restante;
  }

  comprobarPresupuesto(presupuestoObj) {
    const { presupuesto, restante } = presupuestoObj;
    const restanteDiv = document.querySelector(".restante");

    //Comprobar 25%
    if (presupuesto / 4 > restante) {
      restanteDiv.classList.remove("alert-success", "alert-warning");
      restanteDiv.classList.add("alert-danger");
    } else if (presupuesto / 2 > restante) {
      //Comprueba el 50%
      restanteDiv.classList.remove("alert-success");
      restanteDiv.classList.add("alert-warning");
    } else {
      restanteDiv.classList.remove("alert-danger", "alert-warning");
      restanteDiv.classList.add("alert-success");
    }

    if (restante <= 0) {
      ui.imprimirAlerta("El presupuesto se ha agotado", "error");
      formulario.querySelector('button[type="submit"]').disabled = true;
    }
  }
}
//-------------------------------------Instancias--------------------------------------------------

let presupuesto;
const ui = new UI();
//--------------------------------------Funciones---------------------------------------------------

function preguntasPresupuesto() {
  const presupuestoUsuario = Number(prompt("¿Cual es tu presupuesto?"));

  if (
    presupuestoUsuario === "" ||
    presupuestoUsuario === null ||
    isNaN(presupuestoUsuario) ||
    presupuestoUsuario <= 0
  ) {
    window.location.reload();
  }

  presupuesto = new Presupuesto(presupuestoUsuario);

  ui.insertarPresupuesto(presupuesto);
}

function agregarGasto(e) {
  e.preventDefault();

  const nombre = document.querySelector("#gasto").value;
  const cantidad = Number(document.querySelector("#cantidad").value);

  //Validar
  if (nombre === "" || cantidad === "") {
    ui.imprimirAlerta("Ambos campos son obligatorios", "error");
    return;
  } else if (cantidad <= 0 || isNaN(cantidad)) {
    ui.imprimirAlerta("Cantidad no valida", "error");
    return;
  }

  //Generar un objeto con el gasto

  const gasto = { nombre, cantidad, id: Date.now() };
  presupuesto.nuevoGasto(gasto);

  ui.imprimirAlerta("Gasto agregado correctamente");

  const { gastos, restante } = presupuesto;
  ui.actualizarRestante(restante);
  ui.mostrarGastoListados(gastos);
  ui.comprobarPresupuesto(presupuesto);

  formulario.reset();
}

function eliminarGasto(id) {
  presupuesto.eliminarGasto(id);
  const { gastos, restante } = presupuesto;
  ui.mostrarGastoListados(gastos);
  ui.actualizarRestante(restante);
  console.log(presupuesto);
  ui.comprobarPresupuesto(presupuesto);
}
