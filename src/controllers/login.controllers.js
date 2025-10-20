// src/controllers/login.controllers.js
// Importa la función que ejecuta procedimientos almacenados en la base de datos
import { ejecutarSP } from '../database/execSP.js';

/**
 * Controlador: hacerLogin
 * Se encarga de autenticar a un usuario mediante un procedimiento almacenado (SP_Login).
 */
export const hacerLogin = async (req, res) => {
  try {
     // Extrae credenciales del cuerpo de la petición
    const { usuario, contrasena } = req.body;

    // Validación básica: credenciales obligatorias
    if (!usuario || !contrasena) {
      return res.status(400).json({ message: 'Faltan credenciales' });
    }

    // Obtiene la IP del cliente y la hora actual
    const userIP = req.ip || req.headers['x-forwarded-for'] || '127.0.0.1';
    const postTime = new Date();

    // Define parámetros de entrada para el SP
    const inputs = [
      { name: 'inUser', type: 'VarChar', length: 50, value: usuario },
      { name: 'inPassword', type: 'VarChar', length: 100, value: contrasena },
      { name: 'inPostInIP', type: 'VarChar', length: 50, value: userIP },
      { name: 'inPostTime', type: 'DateTime', value: postTime }
    ];

    // Define parámetros de salida esperados del SP
    const outputs = [
      { name: 'outResultCode', type: 'Int' },
      { name: 'outBloquear', type: 'Int' },
      { name: 'outUserId', type: 'Int' }
    ];

    // Ejecuta el procedimiento almacenado de login
    const result = await ejecutarSP('SP_Login', inputs, outputs);

    // Respuesta al cliente con los resultados
    res.status(200).json({
      resultCode: result.output.outResultCode,
      bloquear: result.output.outBloquear === 1,
      userId: result.output.outUserId,
      userIP: userIP
    });

  } catch (err) {
    console.error('Error en login:', err);
    res.status(500).json({ message: 'Error del servidor' });
  }
};

/**
 * Controlador: hacerLogout
 * Se encarga de registrar el cierre de sesión mediante un procedimiento almacenado (SP_Logout).
 */
export const hacerLogout = async (req, res) => {
  try {
    // Obtiene el ID del usuario desde las cabeceras (con fallback a 3)
    const userId = parseInt(req.headers['x-user-id'], 10) || 3;
    const userIP = req.headers['x-user-ip'] || '127.0.0.1';
    const postTime = new Date();

    // Si no se pudo obtener un userId válido, se rechaza
    if (!userId) {
      return res.status(400).json({ message: 'Usuario no autenticado' });
    }

    // Define parámetros de entrada para el SP
    const inputs = [
      { name: 'inIdPostByUser', type: 'Int', value: userId },
      { name: 'inPostInIP', type: 'VarChar', length: 50, value: userIP },
      { name: 'inPostTime', type: 'DateTime', value: postTime }
    ];

    const outputs = [
      { name: 'outResultCode', type: 'Int' }
    ];

    const result = await ejecutarSP('SP_Logout', inputs, outputs);

    const code = result.output.outResultCode;
     // Si el código de resultado es 0 => logout exitoso
    if (code === 0) {
      return res.status(200).json({ success: true });
    } else {
      return res.status(400).json({ success: false, code });
    }
  } catch (error) {
    console.error('Error en logout:', error);
    res.status(500).json({ message: 'Error del servidor al cerrar sesión' });
  }
};
