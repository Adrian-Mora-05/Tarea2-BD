import { getConnection } from '../database/connection.js';
import sql from 'mssql';

/**
 * Llama al procedimiento almacenado SP_ListarEmpleados
 * Recibe opcionalmente un texto de filtro (nombre o documento)
 * Devuelve el conjunto de empleados.
 */
/*
export const listarEmpleados = async (filtro = null) => {
  const pool = await getConnection();
  const request = pool.request();

  // Si filtro viene vacío o null, lo pasamos como NULL a SQL
  if (filtro && filtro.trim() !== "") {
    request.input("Filtro", sql.NVarChar(100), filtro);
  } else {
    request.input("Filtro", sql.NVarChar(100), null);
  }

  // Ejecutar el SP
  const result = await request.execute("SP_ListarEmpleados");
  return result.recordset;
};
*/


/**
 * Inserta un nuevo empleado usando SP_InsertarEmpleados
 */

/*export const insertarEmpleado = async (empleado) => {
  const pool = await getConnection();
  const request = pool.request();

  // Parámetros de entrada
  request.input("inValorDocumentoIdentidad", sql.VarChar(32), empleado.valorDocumentoIdentidad);
  request.input("inNombre", sql.VarChar(64), empleado.nombre);
  request.input("inIdPuesto", sql.Int, empleado.idPuesto);
  request.input("inFechaContratacion", sql.Date, empleado.fechaContratacion);
  request.input("inSaldoVacaciones", sql.Money, empleado.saldoVacaciones);
  request.input("inEsActivo", sql.Int, empleado.esActivo);

  // Parámetro de salida
  request.output("outResultCode", sql.Int);

  // Ejecutar SP
  const result = await request.execute("SP_InsertarEmpleados");

  // Retornar el código de resultado para que el controlador lo interprete
  return result.output.outResultCode;
};
*/