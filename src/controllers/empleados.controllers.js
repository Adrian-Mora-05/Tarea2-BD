import * as empleadoModel from '../models/empleado.model.js';

/* GET /empleados */
/**
 * Controlador para listar empleados con filtro opcional.
 * Llama al procedimiento almacenado SP_ListarEmpleados.
 */
export const getEmpleados = async (req, res) => {
  try {
    const filtro = req.query.filtro || null; // Captura el filtro desde la URL (?filtro=texto)
    const empleados = await empleadoModel.listarEmpleados(filtro);
    res.json(empleados);
  } catch (error) {
    console.error("Error en getEmpleados:", error);
    res.status(500).json({ error: "Error al obtener empleados" });
  }
};

/* POST /empleados */

/**
 * Controlador para insertar un nuevo empleado.
 * Recibe los datos del empleado desde req.body y llama al SP.
 */
export const postEmpleado = async (req, res) => {
  try {
    const empleado = req.body;

    // Validación mínima de campos requeridos
    if (!empleado || !empleado.valorDocumentoIdentidad || !empleado.nombre || !empleado.idPuesto) {
      return res.status(400).json({ error: "Datos incompletos del empleado" });
    }

    // Ejecutar SP y obtener código de resultado
    const codigo = await empleadoModel.insertarEmpleado(empleado);

    if (codigo === 0) {
      res.status(201).json({ mensaje: "Empleado insertado correctamente", codigo });
    } else {
      res.status(400).json({ error: "Error al insertar el empleado", codigo });
    }

  } catch (error) {
    console.error("Error en postEmpleado:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};
