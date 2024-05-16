import { actualizarCliente, obtenerCLiente } from "./API.js";
import { validar, mostrarAlerta } from "./funciones.js";

(function () {
  //Campos del formulario
  const nombreInput = document.querySelector("#nombre");
  const emailInput = document.querySelector("#email");
  const telefonoInput = document.querySelector("#telefono");
  const empresaInput = document.querySelector("#empresa");
  const idInput = document.querySelector("#id");

  document.addEventListener("DOMContentLoaded", async () => {
    const parametroURL = new URLSearchParams(window.location.search);

    const idCliente = parseInt(parametroURL.get("id"));

    const cliente = await obtenerCLiente(idCliente);

    mostrarCliente(cliente);

    const formulario = document.querySelector('#formulario');
    formulario.addEventListener('submit', validarCliente);
  });

  function mostrarCliente(cliente) {
    const { nombre, empresa, email, telefono, id } = cliente;

    nombreInput.value = nombre;
    emailInput.value = email;
    telefonoInput.value = telefono;
    empresaInput.value = empresa;
    idInput.value = id;
  }

  function validarCliente(e) {
    e.preventDefault();

    const cliente = {
        nombre: nombreInput.value,
        email: emailInput.value,
        telefono: telefonoInput.value,
        empresa: empresaInput.value,
        id:parseInt(idInput.value)
    }

    if(!validar(cliente)){
        mostrarAlerta('Todos los campos son obligatorios');
        return;
    }

    //Reescribe el objeto
    actualizarCliente(cliente);
  }
})();
