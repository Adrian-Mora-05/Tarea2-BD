document.addEventListener("DOMContentLoaded", () => {
  const tabla = document.getElementById("empleadosTable").querySelector("tbody");
  const filtroInput = document.getElementById("filtroInput");
  const btnFiltrar = document.getElementById("btnFiltrar");

  const btnInsertar = document.getElementById("btnInsertar");
  const btnActualizar = document.getElementById("btnActualizar");
  const btnEliminar = document.getElementById("btnEliminar");
  const btnListarMov = document.getElementById("btnListarMov");
  const btnInsertarMov = document.getElementById("btnInsertarMov");

  let empleados = [];
  let seleccionado = null;

  // 🔹 Cargar todos los empleados al inicio
  async function cargarEmpleados() {
    try {
      const res = await fetch("/empleados/inicio");
      if (!res.ok) throw new Error("Error al cargar empleados");
      empleados = await res.json();
      mostrarEmpleados(empleados);
    } catch (error) {
      console.error(error);
      alert("No se pudieron cargar los empleados.");
    }
  }

  // 🔹 Mostrar empleados en la tabla
  function mostrarEmpleados(lista) {
    tabla.innerHTML = "";

    lista.forEach(emp => {
      const fila = document.createElement("tr");
      fila.innerHTML = `
        <td><input type="radio" name="seleccionEmpleado" value="${emp.ValorDocumentoIdentidad}"></td>
        <td>${emp.Nombre}</td>
        <td>${emp.DocumentoIdentidad}</td>
        <td>${emp.NombrePuesto || ""}</td>
        <td>${emp.FechaContratacion ? new Date(emp.FechaContratacion).toLocaleDateString() : ""}</td>
        <td>${emp.SaldoVacaciones?.toFixed(2) ?? "0.00"}</td>
        <td>${emp.EsActivo === 1 ? "Inactivo" : "Activo"}</td>
        <td class="acciones">
          <button class="btn-accion actualizar" title="Actualizar" data-id="${emp.ValorDocumentoIdentidad}">✏️</button>
          <button class="btn-accion borrar" title="Borrar" data-id="${emp.ValorDocumentoIdentidad}">🗑️</button>
          <button class="btn-accion insertar-mov" title="Insertar Movimiento" data-id="${emp.ValorDocumentoIdentidad}">➕</button>
          <button class="btn-accion listar-mov" title="Listar Movimientos" data-id="${emp.ValorDocumentoIdentidad}">📋</button>
        </td>
      `;
      tabla.appendChild(fila);
    });

    // Actualizar selección
    document.querySelectorAll("input[name='seleccionEmpleado']").forEach(radio => {
      radio.addEventListener("change", (e) => {
        seleccionado = e.target.value;
      });
    });
  }

  // 🔹 Filtrar empleados
  btnFiltrar.addEventListener("click", async () => {
    const filtro = filtroInput.value.trim();
    let url = "/empleados/listar";

    if (filtro !== "") {
      url += `?filtro=${encodeURIComponent(filtro)}`;
    }

    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error("Error al filtrar");
      const data = await res.json();
      mostrarEmpleados(data);
    } catch (err) {
      console.error(err);
      alert("No se pudieron filtrar los empleados.");
    }
  });

  // 🔹 Validar selección única
  function validarSeleccion() {
    if (!seleccionado) {
      alert("Debe seleccionar un empleado primero.");
      return false;
    }
    return true;
  }

  // 🔹 Acciones
  btnInsertar.addEventListener("click", () => {
    // Aquí abrís un modal o formulario de inserción
    alert("Insertar nuevo empleado (falta implementar modal/formulario).");
  });

  btnActualizar.addEventListener("click", () => {
    if (!validarSeleccion()) return;
    alert(`Actualizar empleado con documento: ${seleccionado}`);
  });

  btnEliminar.addEventListener("click", async () => {
    if (!validarSeleccion()) return;
    if (!confirm("¿Seguro que desea eliminar este empleado?")) return;

    try {
      const res = await fetch(`/empleados/${seleccionado}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Error al eliminar empleado");
      alert("Empleado eliminado correctamente.");
      cargarEmpleados();
    } catch (err) {
      console.error(err);
      alert("No se pudo eliminar el empleado.");
    }
  });

  btnListarMov.addEventListener("click", async () => {
    if (!validarSeleccion()) return;
    alert(`Listar movimientos del empleado ${seleccionado}`);
  });

  btnInsertarMov.addEventListener("click", () => {
    if (!validarSeleccion()) return;
    alert(`Insertar movimiento para empleado ${seleccionado}`);
  });

  


  // 🔹 Acciones por fila (usando delegación de eventos)
  document.getElementById("empleadosTable").addEventListener("click", async (e) => {
    const btn = e.target.closest(".btn-accion");
    if (!btn) return; // si no clickeó un botón, salir

    const id = btn.dataset.id;

    if (btn.classList.contains("actualizar")) {
      alert(`Actualizar empleado con ID ${id}`);
      // acá luego llamás tu función de actualización
    } 
    else if (btn.classList.contains("borrar")) {
      if (!confirm("¿Seguro que desea eliminar este empleado?")) return;
      try {
        const res = await fetch(`/empleados/${id}`, { method: "DELETE" });
        if (!res.ok) throw new Error("Error al eliminar empleado");
        alert("Empleado eliminado correctamente.");
        cargarEmpleados();
      } catch (err) {
        console.error(err);
        alert("No se pudo eliminar el empleado.");
      }
    } 
    else if (btn.classList.contains("insertar-mov")) {
      alert(`Insertar movimiento para el empleado ${id}`);
    } 
    else if (btn.classList.contains("listar-mov")) {
      alert(`Listar movimientos del empleado ${id}`);
    }
  });




  // Cargar al iniciar
  cargarEmpleados();
});
