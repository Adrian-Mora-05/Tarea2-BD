// Importa la función getConnection que administra la conexión a la base de datos
import {getConnection} from '../database/connection.js';
// Importa la librería mssql para interactuar con SQL Server
import sql from 'mssql';

/* ==========================================================
   Controlador para obtener todos los empleados
   Llama al procedimiento almacenado SPConsultar_Empleado
   y devuelve los resultados en formato JSON.
========================================================== */
export const getEmpleados = async (req, res) => {
    try {
       // Establece la conexión con la base de datos
        const pool = await getConnection();
        const request = pool.request();

         // Define un parámetro de salida (para capturar códigos del SP)
        request.output('outResultCode', sql.Int);

         // Ejecuta el procedimiento almacenado SPConsultar_Empleado
        const result = await request.execute('SPConsultar_Empleado');

         // Recupera el valor del parámetro de salida
        const outResult = result.output.outResultCode;

        // Si el SP devuelve un código diferente de 0, se considera error
         if (outResult !== 0) {
            return res.status(500).json({ error: `SP retornó código ${outResult}` });
        }

        // Devuelve el resultado en formato JSON al cliente
        res.json(result.recordset);
        
        } catch (error) {
          // Manejo de errores: imprime en consola y responde al cliente
            console.error(error);
            res.status(500).json({ error: 'Error al obtener empleados' });
    }
}


/* ==========================================================
   Controlador para crear un nuevo empleado
   Llama al procedimiento almacenado SPInsertar_Empleado
   y evalúa el código de salida para determinar el resultado.
========================================================== */
export const createEmpleado = async (req, res) => {
  try {
     // Extrae datos enviados en el cuerpo de la solicitud
    const { Nombre, Salario } = req.body;

    // Establece la conexión con la base de datos
    const pool = await getConnection();
    const result = await pool
            .request()
            .input('inNombre', sql.VarChar(64), Nombre)
            .input('inSalario', sql.Money, Salario)
            .output('outResultCode', sql.Int) // Parámetro de salida
             // Ejecuta el procedimiento almacenado SPInsertar_Empleado
            .execute('SPInsertar_Empleado');

    const outResult = result.output.outResultCode; // Captura el código de salida

     // Evalúa el código de salida para determinar la respuesta adecuada:
    if (outResult === 0) {
            return res.status(200).json({ success: true, message: 'Inserción exitosa', codigo: outResult });
        } else if (outResult === 50002) {
            return res.status(400).json({ success: false, message: 'Empleado ya existe', codigo: outResult });
        } else if (outResult === 50001) {
            return res.status(500).json({ success: false, message: 'Tabla Empleado no existe', codigo: outResult });
        } else {
            return res.status(500).json({ success: false, message: 'Error inesperado al insertar', codigo: outResult });
        }
    } catch (error) { // Manejo de errores
        console.error('Error al insertar empleado:', error);
        return res.status(500).json({ success: false, message: 'Error del servidor', error });
    }
};
 


  