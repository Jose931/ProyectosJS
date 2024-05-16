let cliente = {
  mesa: "",
  hora: "",
  pedido: [],
};

const categorias = {
  1: "Comida",
  2: "Bebidas",
  3: "Postres",
};

const btnGuardarCliente = document.querySelector("#guardar-cliente");
btnGuardarCliente.addEventListener("click", guardarCLiente);

function guardarCLiente() {
  const mesa = document.querySelector("#mesa").value;
  const hora = document.querySelector("#hora").value;

  //Revisa si hay campos vacios
  const camposVacios = [mesa, hora].some((campo) => campo === "");

  if (camposVacios) {
    const existeAlerta = document.querySelector(".invalid-feedback");

    if (!existeAlerta) {
      const alerta = document.createElement("DIV");
      alerta.classList.add("invalid-feedback", "d-block", "text-center");
      alerta.textContent = "Todos los campos son obligatorios";
      document.querySelector(".modal-body form").appendChild(alerta);

      setTimeout(() => {
        alerta.remove();
      }, 3000);
    }
    return;
  }

  cliente = { ...cliente, mesa, hora };

  //Ocultar modal

  const modalFormulario = document.querySelector("#formulario");
  const modalBootstrap = bootstrap.Modal.getInstance(modalFormulario);
  modalBootstrap.hide();

  //Mostrar las secciones
  mostrarSecciones();

  obtenerPlatos();
}

function mostrarSecciones() {
  const seccionesOcultas = document.querySelectorAll(".d-none");
  seccionesOcultas.forEach((seccion) => seccion.classList.remove("d-none"));
}

function obtenerPlatos() {
  const url = "http://localhost:4000/platillos";

  fetch(url)
    .then((response) => response.json())
    .then((data) => mostrarPlatos(data))
    .catch((error) => console.log(error));
}

function mostrarPlatos(platos) {
  const contenido = document.querySelector("#platillos .contenido");

  platos.forEach((plato) => {
    const row = document.createElement("DIV");
    row.classList.add("row", "py-3", "border-top");

    const nombre = document.createElement("DIV");
    nombre.classList.add("col-md-4");
    nombre.textContent = plato.nombre;

    const precio = document.createElement("DIV");
    precio.classList.add("col-md-3", "fw-bold");
    precio.textContent = `${plato.precio} €`;

    const categoria = document.createElement("DIV");
    categoria.classList.add("col-md-3");
    categoria.textContent = categorias[plato.categoria];

    const inputCantidad = document.createElement("INPUT");
    inputCantidad.type = "number";
    inputCantidad.min = 0;
    inputCantidad.value = 0;
    inputCantidad.id = `producto-${plato.id}`;
    inputCantidad.classList.add("form-control");

    //Funcion que detecta la cantidad y el plato que se agrega
    inputCantidad.onchange = function () {
      const cantidad = parseInt(inputCantidad.value);
      agregarPlato({ ...plato, cantidad });
    };

    const agregar = document.createElement("DIV");
    agregar.classList.add("col-md-2");
    agregar.appendChild(inputCantidad);

    row.appendChild(nombre);
    row.appendChild(precio);
    row.appendChild(categoria);
    row.appendChild(agregar);
    contenido.appendChild(row);
  });
}

function agregarPlato(plato) {
  let { pedido } = cliente;

  if (plato.cantidad > 0) {
    //Comprueba si el elemento ya existe en el array
    if (pedido.some((articulo) => articulo.id === plato.id)) {
      const pedidoActualizado = pedido.map((articulo) => {
        if (articulo.id === plato.id) {
          articulo.cantidad = plato.cantidad;
        }
        return articulo;
      });

      cliente.pedido = [...pedidoActualizado];
    } else {
      cliente.pedido = [...pedido, plato];
    }
  } else {
    //Eliminar elementos cuando la cantidad es 0
    const resultado = pedido.filter((articulo) => articulo.id !== plato.id);
    cliente.pedido = [...resultado];
  }
  //Limpiar el codigo HTML previo
  limpiarHTML();

  if (cliente.pedido.length) {
    //Mostrar el resumen
    actualizarResumen();
  }else{
    mensajePedidoVacio();
  }
}

function actualizarResumen() {
  const contenido = document.querySelector("#resumen .contenido");

  const resumen = document.createElement("DIV");
  resumen.classList.add("col-md-6", "card", "py-5", "px-3", "shadow");

  //Informacion de la mesa
  const mesa = document.createElement("P");
  mesa.textContent = "Mesa: ";
  mesa.classList.add("fw-bold");

  const mesaSpan = document.createElement("SPAN");
  mesaSpan.textContent = cliente.mesa;
  mesaSpan.classList.add("fw-normal");

  //Informacion de la hora
  const hora = document.createElement("P");
  hora.textContent = "Hora: ";
  hora.classList.add("fw-bold");

  const horaSpan = document.createElement("SPAN");
  horaSpan.textContent = cliente.hora;
  horaSpan.classList.add("fw-normal");

  //Agregar a los elementos padre
  mesa.appendChild(mesaSpan);
  hora.appendChild(horaSpan);

  //Titulo de la seccion
  const heading = document.createElement("H3");
  heading.textContent = "Platos consumidos";
  heading.classList.add("my-2", "text-center");

  //Iterar el array de pedidos
  const grupo = document.createElement("UL");
  grupo.classList.add("list-group");

  const { pedido } = cliente;
  pedido.forEach((articulo) => {
    const { nombre, cantidad, precio, id } = articulo;

    const lista = document.createElement("LI");
    lista.classList.add("list-group-item");

    const nombreElemento = document.createElement("H4");
    nombreElemento.classList.add("my-4");
    nombreElemento.textContent = nombre;

    //Cantidad del articulo
    const cantidadElemento = document.createElement("P");
    cantidadElemento.classList.add("fw-bold");
    cantidadElemento.textContent = "Cantidad: ";

    const cantidadValor = document.createElement("SPAN");
    cantidadValor.classList.add("fw-normal");
    cantidadValor.textContent = cantidad;

    //Precio del articulo
    const precioElemento = document.createElement("P");
    precioElemento.classList.add("fw-bold");
    precioElemento.textContent = "Precio: ";

    const precioValor = document.createElement("SPAN");
    precioValor.classList.add("fw-normal");
    precioValor.textContent = `${precio} €`;

    //Subtotal del articulo
    const subtotalElemento = document.createElement("P");
    subtotalElemento.classList.add("fw-bold");
    subtotalElemento.textContent = "Subtotal: ";

    const subtotalValor = document.createElement("SPAN");
    subtotalValor.classList.add("fw-normal");
    subtotalValor.textContent = calcularSubtotal(precio, cantidad);

    //Boton Eliminar
    const btnEliminar = document.createElement("BUTTON");
    btnEliminar.classList.add("btn", "btn-danger");
    btnEliminar.textContent = "Eliminar del pedido";
    btnEliminar.onclick = function () {
      eliminarProducto(id);
    };

    //Agregar valores a sus contenedores
    cantidadElemento.appendChild(cantidadValor);
    precioElemento.appendChild(precioValor);
    subtotalElemento.appendChild(subtotalValor);

    //Agregar Elementos al LI
    lista.appendChild(nombreElemento);
    lista.appendChild(cantidadElemento);
    lista.appendChild(precioElemento);
    lista.appendChild(subtotalElemento);
    lista.appendChild(btnEliminar);

    //Agregar lista al grupo principal
    grupo.appendChild(lista);
  });

  //Agregar al contenido
  resumen.appendChild(heading);
  resumen.appendChild(mesa);
  resumen.appendChild(hora);
  resumen.appendChild(grupo);

  contenido.appendChild(resumen);

  formularioPropinas();
}

function limpiarHTML() {
  const contenido = document.querySelector("#resumen .contenido");

  while (contenido.firstChild) {
    contenido.removeChild(contenido.firstChild);
  }
}

function calcularSubtotal(precio, cantidad) {
  return `${precio * cantidad} €`;
}

function eliminarProducto(id) {
  const { pedido } = cliente;
  const resultado = pedido.filter((articulo) => articulo.id !== id);
  cliente.pedido = [...resultado];

  limpiarHTML(); 
  
  if (cliente.pedido.length) {
    //Mostrar el resumen
    actualizarResumen();
  }else{
    mensajePedidoVacio();
  }

  //El producto se elimino. Se actualiza la cantidad en el formulario
  const productoEliminado = `#producto-${id}`;
  const inputEliminado = document.querySelector(productoEliminado);
  inputEliminado.value = 0;

}

function mensajePedidoVacio() {
  const contenido = document.querySelector("#resumen .contenido");

  const texto = document.createElement("P");
  texto.classList.add("text-center");
  texto.textContent = "Añade los elementos al pedido";

  contenido.appendChild(texto);
}

function formularioPropinas() {
  const contenido = document.querySelector('#resumen .contenido');

  const formulario = document.createElement('DIV');
  formulario.classList.add('col-md-6', 'formulario');

  const divFormulario = document.createElement('DIV');
  divFormulario.classList.add('card', 'py-4', 'px-3', 'shadow')

  const heading = document.createElement('H3');
  heading.classList.add('my-4', 'text-center');
  heading.textContent = 'Propina';

  //Radio Button 10%
  const radio10 = document.createElement('INPUT');
  radio10.type = 'radio';
  radio10.name = 'propina';
  radio10.value = "10";
  radio10.classList.add('form-check-input');
  radio10.onclick = calcularPropina;

  const radio10Label = document.createElement('LABEL');
  radio10Label.textContent = '10%';
  radio10Label.classList.add('form-check-label');

  const radio10Div = document.createElement('DIV');
  radio10Div.classList.add('form-check');

  radio10Div.appendChild(radio10);
  radio10Div.appendChild(radio10Label);

  //Radio Button 25%
  const radio25 = document.createElement('INPUT');
  radio25.type = 'radio';
  radio25.name = 'propina';
  radio25.value = "25";
  radio25.classList.add('form-check-input');
  radio25.onclick = calcularPropina;


  const radio25Label = document.createElement('LABEL');
  radio25Label.textContent = '25%';
  radio25Label.classList.add('form-check-label');

  const radio25Div = document.createElement('DIV');
  radio25Div.classList.add('form-check');

  radio25Div.appendChild(radio25);
  radio25Div.appendChild(radio25Label);

  //Radio Button 50%
  const radio50 = document.createElement('INPUT');
  radio50.type = 'radio';
  radio50.name = 'propina';
  radio50.value = "50";
  radio50.classList.add('form-check-input');
  radio50.onclick = calcularPropina;


  const radio50Label = document.createElement('LABEL');
  radio50Label.textContent = '50%';
  radio50Label.classList.add('form-check-label');

  const radio50Div = document.createElement('DIV');
  radio50Div.classList.add('form-check');

  radio50Div.appendChild(radio50);
  radio50Div.appendChild(radio50Label);

  formulario.appendChild(divFormulario);

  divFormulario.appendChild(heading);
  divFormulario.appendChild(radio10Div);
  divFormulario.appendChild(radio25Div);
  divFormulario.appendChild(radio50Div);

  contenido.appendChild(formulario);
}

function calcularPropina() {
  const {pedido} = cliente;
  
  let subtotal = 0;

  pedido.forEach( articulo => {
    subtotal += articulo.cantidad * articulo.precio;
  });

  const propinaSeleccionada = document.querySelector('[name="propina"]:checked').value;

  //Calcular la propina
  const propina = ((subtotal * parseInt(propinaSeleccionada)) / 100);

  //Calcular el total a pagar

  const total = subtotal + propina;

  mostrarTotalHTML(subtotal, total, propina);

}

function mostrarTotalHTML(subtotal, total, propina){
const divTotales = document.createElement('DIV');
divTotales.classList.add('total-pagar', 'my-5');

//Subtotal
  const subtotalParrafo = document.createElement('P');
  subtotalParrafo.classList.add('fs-4', 'fw-bold', 'mt-2');
  subtotalParrafo.textContent = 'Subtotal Consumo: ';

  const subtotalSpan = document.createElement('SPAN');
  subtotalSpan.classList.add('fw-normal');
  subtotalSpan.textContent = `${subtotal} €`;

  subtotalParrafo.appendChild(subtotalSpan);
  divTotales.appendChild(subtotalParrafo);

  //Propina
  const propinaParrafo = document.createElement('P');
  propinaParrafo.classList.add('fs-4', 'fw-bold', 'mt-2');
  propinaParrafo.textContent = 'Propina: ';

  const propinaSpan = document.createElement('SPAN');
  propinaSpan.classList.add('fw-normal');
  propinaSpan.textContent = `${propina} €`;

  propinaParrafo.appendChild(propinaSpan);
  divTotales.appendChild(propinaParrafo);

  //Total
  const totalParrafo = document.createElement('P');
  totalParrafo.classList.add('fs-4', 'fw-bold', 'mt-2');
  totalParrafo.textContent = 'Total a pagar: ';

  const totalSpan = document.createElement('SPAN');
  totalSpan.classList.add('fw-normal');
  totalSpan.textContent = `${total} €`;

  totalParrafo.appendChild(totalSpan);
const totalPagarDiv = document.querySelector('.total-pagar');

if(totalPagarDiv) {
  totalPagarDiv.remove();
}

  divTotales.appendChild(totalParrafo);
  const formulario = document.querySelector('.formulario > div');
  formulario.appendChild(divTotales);
}
