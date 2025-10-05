import sql from 'mssql';
import { DB } from '../config.js';

let poolPromise = null;

export const getConnection = async () => {
  try {
    if (!poolPromise) {
      poolPromise = sql.connect(DB);
    }
    return await poolPromise;
  } catch (error) {
    console.error('Error de conexión a la BD:', error);
    throw error;
  }
};
