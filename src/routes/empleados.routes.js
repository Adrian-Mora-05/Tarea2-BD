// Importa el enrutador de Express para definir las rutas de la API
import {Router} from 'express';

// Importa las funciones del controlador que manejarán las peticiones
import {getEmpleados, postEmpleado} from '../controllers/empleados.controllers.js';

// Crea una instancia del enrutador
const router = Router();

// Definición de rutas para la entidad "Empleados"

// Ruta GET /empleados: Obtiene la lista de empleados desde la base de datos
router.get('/empleados', getEmpleados);

// Ruta POST /empleados: Crea un nuevo empleado en la base de datos
router.post('/empleados', postEmpleado);

// Exporta el enrutador para que pueda ser usado en app.js
export default router;