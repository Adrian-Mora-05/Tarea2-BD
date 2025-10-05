// Función asincrónica para cargar la lista de empleados desde el backend
async function cargarEmpleados() {
    try {
        // Realiza una petición HTTP GET al endpoint /empleados
        const res = await fetch('/empleados');

        // Convierte la respuesta a formato JSON
        const empleados = await res.json();

        // Selecciona el cuerpo de la tabla (tbody) donde se insertarán los empleados
        const tbody = document.querySelector('#empleadosTable tbody');
        
        // Limpia el contenido previo de la tabla para evitar duplicados
        tbody.innerHTML = '';  
 
        // Recorre cada empleado recibido desde el servidor
        empleados.forEach(empleado => {
             // Crea una nueva fila (tr) para cada empleado
            const fila = document.createElement('tr');
            // Inserta las celdas (td) con los datos del empleado
            fila.innerHTML = `
                <td>${empleado.id}</td>
                <td>${empleado.Nombre}</td>
                <td>${empleado.Salario}</td>
            `;
            // Agrega la fila al cuerpo de la tabla
            tbody.appendChild(fila);

    });
 } catch (error) {
    // Si ocurre un error, lo muestra en consola
        console.error('Error al cargar empleados:', error);
    }   
}


 

// Llamar la función al cargar la página
window.onload = cargarEmpleados;

 