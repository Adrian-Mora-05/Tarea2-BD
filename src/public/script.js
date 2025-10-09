// --------------------- CARGAR EMPLEADOS ---------------------
async function cargarEmpleados() {
  try {
    const res = await fetch('/empleados');
    const empleados = await res.json();
    const tbody = document.querySelector('#empleadosTable tbody');
    tbody.innerHTML = '';

    empleados.forEach(empleado => {
      const fila = document.createElement('tr');
      fila.innerHTML = `
        <td>${empleado.id}</td>
        <td>${empleado.Nombre}</td>
        <td>${empleado.Salario}</td>
      `;
      tbody.appendChild(fila);
    });
  } catch (error) {
    console.error('Error al cargar empleados:', error);
  }
}

window.onload = cargarEmpleados;

// --------------------- MODALES Y VALIDACIÓN ---------------------

function abrirModal() {
  document.getElementById("modalInsertar").style.display = "block";
}

function cerrarModal() {
  document.getElementById("modalInsertar").style.display = "none";
  limpiarFormulario();
}

function limpiarFormulario() {
  document.getElementById("nombre").value = "";
  document.getElementById("salario").value = "";
  document.getElementById("error-nombre").innerText = "";
  document.getElementById("error-salario").innerText = "";
}

function validarFormulario() {
  const nombreInput = document.getElementById("nombre");
  const salarioInput = document.getElementById("salario");
  const nombre = nombreInput.value.trim();
  const salario = salarioInput.value.replace(/,/g, '').trim();

  const errorNombre = document.getElementById("error-nombre");
  const errorSalario = document.getElementById("error-salario");

  errorNombre.innerText = "";
  errorSalario.innerText = "";

  const regexNombre = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\- ]+$/;
  const regexSalario = /^\d{1,3}(,\d{3})*(\.\d{1,2})?$|^\d+(\.\d{1,2})?$/;

  let esValido = true;

  if (nombre === "") {
    errorNombre.innerText = "Por favor llenar este campo";
    esValido = false;
  } else if (!regexNombre.test(nombre)) {
    errorNombre.innerText = "El nombre solo debe contener letras o guiones";
    esValido = false;
  }

  if (salario === "") {
    errorSalario.innerText = "Por favor llenar este campo";
    esValido = false;
  } else if (!regexSalario.test(salario)) {
    errorSalario.innerText = "Ingrese un valor monetario válido";
    esValido = false;
  }

  if (!esValido) return;

  fetch('/empleados', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ Nombre: nombre, Salario: salario })
  })
    .then(async (response) => {
      const data = await response.json();

      if (response.ok && data.success) {
        cerrarModal();
        mostrarModalExito();
        cargarEmpleados();
      } else {
        if (data.codigo === 50002) {
          cerrarModal();
          mostrarModalError();
        } else {
          alert(data.message || 'Error al insertar el empleado.');
        }
      }
    })
    .catch((error) => {
      console.error('Error al insertar empleado:', error);
      alert('Error de servidor al insertar.');
    });
}

window.onclick = function(event) {
  const modal = document.getElementById("modalInsertar");
  if (event.target === modal) {
    modal.style.display = "none";
    limpiarFormulario();
  }
};

document.addEventListener("DOMContentLoaded", function () {
  const nombreInput = document.getElementById("nombre");
  const salarioInput = document.getElementById("salario");

  const regexNombre = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\- ]+$/;
  const regexSalario = /^\d{1,3}(,\d{3})*(\.\d{1,2})?$|^\d+(\.\d{1,2})?$/;

  nombreInput.addEventListener("input", function () {
    const nombre = this.value.trim();
    if (nombre === "") {
      document.getElementById("error-nombre").innerText = "Por favor llenar este campo";
    } else if (!regexNombre.test(nombre)) {
      document.getElementById("error-nombre").innerText = "El nombre solo debe contener letras o guiones";
    } else {
      document.getElementById("error-nombre").innerText = "";
    }
  });

  salarioInput.addEventListener("input", function () {
    let rawValue = this.value.replace(/,/g, '');
    rawValue = rawValue.replace(/[^0-9.]/g, '');
    const parts = rawValue.split('.');

    if (parts.length > 2) rawValue = parts[0] + '.' + parts.slice(1).join('');
    let intPart = parts[0] || "";
    let decPart = parts[1] || "";

    if (intPart) intPart = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

    let formatted = parts.length === 2
      ? intPart + '.' + decPart.slice(0, 2)
      : intPart;

    this.value = formatted;

    if (!regexSalario.test(formatted)) {
      document.getElementById("error-salario").innerText =
        "Ingrese un valor monetario válido (ej: 1,000.00)";
    } else {
      document.getElementById("error-salario").innerText = "";
    }
  });
});

function mostrarModalExito() {
  document.getElementById("modalExito").style.display = "block";
}

function cerrarModalExito() {
  document.getElementById("modalExito").style.display = "none";
}

function mostrarModalError() {
  document.getElementById("modalError").style.display = "block";
}

function cerrarModalError() {
  document.getElementById("modalError").style.display = "none";
  abrirModal();
  limpiarFormulario();
}
