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
  insertarMovimiento
} from '../controllers/empleados.controllers.js';

// Crea una instancia del enrutador
const router = Router();

// Definición de rutas para la entidad "Empleados"
router.get('/inicio', listarInicioEmpleados);
router.get('/listar', listarEmpleados);
router.post('/', insertarEmpleado);
router.put('/:ValorDocumentoIdentidad', actualizarEmpleado);
router.delete('/:ValorDocumentoIdentidad', borrarEmpleado);
router.get('/:ValorDocumentoIdentidad/movimientos', listarMovimientos);
router.post('/:valorDocumentoIdentidad/movimientos', (req, res, next) => {
          req.body.ValorDocumentoIdentidad = req.params.ValorDocumentoIdentidad;
          next();
        }, insertarMovimiento);



export default router;