// Importa el enrutador de Express para definir las rutas de la API
import {Router} from 'express';
import express from 'express';


// Importa las funciones del controlador que manejarán las peticiones
import {
  listarInicioEmpleados,
  listarEmpleados,
  insertarEmpleado,
  actualizarEmpleado,
  borrarEmpleado,
  listarMovimientos,
  insertarMovimiento,
  obtenerLosMovimientos,
  listarPuestos
} from '../controllers/empleados.controllers.js';

import {
  hacerLogin,
  hacerLogout
} from '../controllers/login.controllers.js';

// Crea una instancia del enrutador
const router = Router();

// Definición de rutas para la entidad "Empleados"
router.get('/inicio', listarInicioEmpleados); // Ruta GET: muestra la página inicial o datos generales de empleados
router.get('/listar', listarEmpleados); // Ruta GET: obtiene la lista completa de empleados
router.get('/puestos', listarPuestos); // Ruta GET: devuelve los diferentes puestos (roles/cargos) disponibles
router.get('/movimientos', obtenerLosMovimientos); // Ruta GET: obtiene los movimientos asociados a empleados (ej: cambios de puesto, acciones, etc.)
router.post('/', insertarEmpleado); // Ruta POST: inserta un nuevo empleado en la base de datos
router.put('/:ValorDocumentoIdentidad', actualizarEmpleado); // Ruta PUT: actualiza la información de un empleado en base a su documento de identidad
router.delete('/:ValorDocumentoIdentidad', borrarEmpleado); // Ruta DELETE: elimina a un empleado usando su documento de identidad
router.get('/:ValorDocumentoIdentidad/movimientos', listarMovimientos); // Ruta GET: obtiene los movimientos específicos de un empleado según su documento de identidad
router.post('/:valorDocumentoIdentidad/movimientos', insertarMovimiento); // Ruta POST: inserta un nuevo movimiento para un empleado específico
router.post('/login', hacerLogin); // Ruta POST: realiza el proceso de login de un empleado (autenticación)
router.post('/logout', hacerLogout); // Ruta POST: realiza el proceso de logout de un empleado (cerrar sesión)



export default router;