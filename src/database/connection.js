import sql from 'mssql'; // Importa la librería mssql para conectarse a SQL Server
import { DB } from '../config.js'; // Importa la configuración de conexión desde el archivo config.js

let poolPromise = null; // Variable que almacenará la conexión "pool" a la base de datos

/**
 * Función: getConnection
 * Establece y devuelve una conexión a la base de datos utilizando un pool de conexiones.
 * El pool se crea una sola vez (singleton) y se reutiliza en las siguientes llamadas.
 */
export const getConnection = async () => {
  try {
    // Si aún no existe un pool, se crea uno
    if (!poolPromise) {
      console.log('Configuración DB:', DB);  // Muestra en consola la configuración usada para depuración
      poolPromise = sql.connect(DB);
    }
    // Devuelve la conexión (espera a que se resuelva)
    return await poolPromise;
  } catch (error) {
    // Si ocurre un error al conectarse, se captura y se lanza
    console.error('Error de conexión a la BD:', error);
    throw error;
  }
};

(async () => {
  try {
    const pool = await getConnection();
    console.log('✅ Conectado correctamente a la BD:', pool.connected);
  } catch (error) {
    console.error('❌ Falló la conexión a la BD:', error);
  }
})();

