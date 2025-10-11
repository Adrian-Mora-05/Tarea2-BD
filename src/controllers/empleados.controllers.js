// src/controllers/empleados.controllers.js
import { ejecutarSP } from '../database/execSP.js';

/**
 * GET /empleados/inicio
 */

export const listarInicioEmpleados = async (req, res) => {
  try {
    try {
      // preferimos SP_ListarInicioEmpleado (si existe en tu BD)
      const r = await ejecutarSP(
                                'SP_ListarInicioEmpleado',
                                [], // no hay parámetros de entrada
                                [{ name: 'outResultCode', type: 'Int' }] // parámetro de salida requerido
                              );

      return res.json(r.recordset || []);
    } catch (err) {
     // Fallback: usar SP alternativo con los parámetros correctos
      const r = await ejecutarSP(
        'SP_ListarEmpleadosFiltrados',
        [
          { name: 'Filtro', type: 'NVarChar', length: 100, value: null },
          { name: 'inIdPostByUser', type: 'Int', value: 1 } // Id UsuarioScripts = 1 )
        ],
        []
      );
      return res.json(r.recordset || []);
    }
  } catch (error) {
    console.error('Error listarInicioEmpleados:', error);
    res.status(500).json({ message: 'Error al listar empleados' });
  }
}; 

/**
 * GET /empleados
 * Llama a SP_ListarEmpleados(@Filtro)
 * - Si llega nombre o documento, los pasamos como `Filtro` (SP implementa la lógica).
 * - Si no viene nada, se envía NULL y SP retorna todos (o se puede usar /inicio).
 */
export const listarEmpleados = async (req, res) => {
  try {
    const filtro = req.query.nombre ?? req.query.documento ?? req.query.filtro ?? null;
    const postTime = new Date();
    const r = await ejecutarSP(
                'SP_ListarEmpleadosFiltrados', 
                [{ name: 'Filtro', type: 'NVarChar', length: 100, value: filtro },
                  { name: 'inIdPostByUser', type: 'Int', value: 1 }, // Id UsuarioScripts = 1
                  { name: 'inPostInIP', type: 'NVarChar', length: 50, value: '14.127.138.177' }, // null = todos
                  { name: 'inPostTime', type: 'DateTime', value: postTime } // 1=Nombre ASC
                ], []);
    res.json(r.recordset || []);
  } catch (error) {
    console.error('Error listarEmpleados:', error);
    res.status(500).json({ message: 'Error al listar empleados' });
  }
};

/**
 * POST /empleados
 * Invoca SP_InsertarEmpleados
 * Espera en body: { ValorDocumentoIdentidad, Nombre, IdPuesto, FechaContratacion, SaldoVacaciones?, EsActivo? }
 * (SaldoVacaciones opcional -> por defecto 0, EsActivo por defecto 1)
 */
export const insertarEmpleado = async (req, res) => {
  try {
    const {
      ValorDocumentoIdentidad,
      Nombre,
      IdPuesto,
      FechaContratacion = null,
      SaldoVacaciones = 0,
      EsActivo = 1
    } = req.body;

    // Validaciones básicas
    if (!ValorDocumentoIdentidad || !Nombre || !IdPuesto) {
      return res.status(400).json({ message: 'Faltan campos obligatorios: ValorDocumentoIdentidad, Nombre, IdPuesto' });
    }

    const inputs = [
      { name: 'inValorDocumentoIdentidad', type: 'VarChar', length: 32, value: ValorDocumentoIdentidad },
      { name: 'inNombre', type: 'VarChar', length: 64, value: Nombre },
      { name: 'inIdPuesto', type: 'Int', value: parseInt(IdPuesto, 10) },
      { name: 'inFechaContratacion', type: 'Date', value: FechaContratacion ? FechaContratacion : null },
      { name: 'inSaldoVacaciones', type: 'Money', value: SaldoVacaciones },
      { name: 'inEsActivo', type: 'Int', value: EsActivo },
    ];

    const outputs = [{ name: 'outResultCode', type: 'Int' }];

    const r = await ejecutarSP('SP_InsertarEmpleados', inputs, outputs);
    const code = r.output?.outResultCode ?? null;

    if (code === 0) {
      return res.status(201).json({ success: true });
    }

    // Mapear códigos de error comunes del SP a respuestas HTTP y mensajes
    const map = {
      50003: { status: 400, message: 'Empleado con ValorDocumentoIdentidad ya existe' },
      50004: { status: 400, message: 'Empleado con mismo nombre ya existe' },
      50009: { status: 400, message: 'Puesto no existe' },
      50007: { status: 400, message: 'Nombre no válido' },
      50008: { status: 500, message: 'Error en base de datos' },
    };

    if (code && map[code]) {
      return res.status(map[code].status).json({ success: false, codigo: code, message: map[code].message });
    }

    // cualquier otro código
    return res.status(500).json({ success: false, codigo: code, message: 'Error inesperado al insertar' });
  } catch (error) {
    console.error('insertarEmpleado error:', error);
    res.status(500).json({ message: 'Error del servidor al insertar empleado' });
  }
};

/**
 * PUT /empleados/:id
 * Invoca SP_ActualizarEmpleado
 * Se asume signature similar a SP_InsertarEmpleados + inId
 */
export const actualizarEmpleado = async (req, res) => {
  try {
    const ValorDocumentoIdentidad = req.params.ValorDocumentoIdentidad;
    const {
      Nombre,
      IdPuesto,
      FechaContratacion,
      SaldoVacaciones,
      EsActivo
    } = req.body;

    if (!ValorDocumentoIdentidad || !Nombre || !IdPuesto) {
      return res.status(400).json({ message: 'Faltan campos obligatorios' });
    }

    const inputs = [
      { name: 'inValorDocumentoIdentidad', type: 'VarChar', length: 32, value: ValorDocumentoIdentidad },
      { name: 'inNombre', type: 'VarChar', length: 64, value: Nombre },
      { name: 'inIdPuesto', type: 'Int', value: parseInt(IdPuesto, 10) },
      { name: 'inFechaContratacion', type: 'Date', value: FechaContratacion ? FechaContratacion : null },
      { name: 'inSaldoVacaciones', type: 'Money', value: SaldoVacaciones ?? null },
      { name: 'inEsActivo', type: 'Int', value: EsActivo ?? 1 }
    ];

    const outputs = [{ name: 'outResultCode', type: 'Int' }];

    const r = await ejecutarSP('SP_ActualizarEmpleado', inputs, outputs);
    const code = r.output?.outResultCode ?? null;

    if (code === 0) return res.json({ success: true });

    // Mapear errores comunes (ajustá según tus SP reales)
    if (code === 50120) return res.status(500).json({ success: false, codigo: code, message: 'Empleado no encontrado' });
    if (code === 50006) return res.status(500).json({ success: false, codigo: code, message: 'Empleado con ValorDocumentoIdentidad ya existe en actualización' });
    if (code === 50007) return res.status(500).json({ success: false, codigo: code, message: 'Empleado con mismo nombre ya existe en actualización' });
    if (code === 50008) return res.status(400).json({ success: false, codigo: code, message: 'Error de base de datos' });
    return res.status(400).json({ success: false, codigo: code, message: 'Error al actualizar empleado' });
  } catch (error) {
    console.error('actualizarEmpleado error:', error);
    res.status(500).json({ message: 'Error del servidor al actualizar empleado' });
  }
};

/**
 * DELETE /empleados/:id
 * Invoca SP_BorrarEmpleado (se asume signature inId, outResultCode)
 */
export const borrarEmpleado = async (req, res) => {
  try {
    const ValorDocumentoIdentidad = req.params.ValorDocumentoIdentidad;
    if (!ValorDocumentoIdentidad) return res.status(400).json({ message: 'DocumentoIdentidad inválido' });

    const inputs = [{ name: 'inValorDocumentoIdentidad', type: 'VarChar', length: 32, value: ValorDocumentoIdentidad }];
    const outputs = [{ name: 'outResultCode', type: 'Int' }];

    const r = await ejecutarSP('SP_BorrarEmpleado', inputs, outputs);
    const code = r.output?.outResultCode ?? null;

    if (code === 0) return res.json({ success: true });
    if (code === 50008) return res.status(400).json({ success: false, codigo: code, message: 'Empleado no encontrado o no se puede borrar' });

    return res.status(400).json({ success: false, codigo: code, message: 'Error al borrar empleado' });
  } catch (error) {
    console.error('borrarEmpleado error:', error);
    res.status(500).json({ message: 'Error del servidor al borrar empleado' });
  }
};

/**
 * GET /empleados/:id/movimientos
 * Llama a SP_ListarMovimientos (se asume recibe inIdEmpleado)
 */
export const listarMovimientos = async (req, res) => {
  try {
    const ValorDocumentoIdentidad = req.params.ValorDocumentoIdentidad;
    if (!ValorDocumentoIdentidad) return res.status(400).json({ message: 'DocumentoIdentidad inválido' });

    const inputs = [{ name: 'inValorDocumentoIdentidad', type: 'VarChar', length: 32, value: ValorDocumentoIdentidad }];
    const r = await ejecutarSP('SP_ListarMovimientos', inputs, []);
    res.json(r.recordset || []);
  } catch (error) {
    console.error('listarMovimientos error:', error);
    res.status(500).json({ message: 'Error al listar movimientos' });
  }
};

/**
 * POST /movimientos
 * Invoca SP_InsertarMovimiento
 */
export const insertarMovimiento = async (req, res) => {
  try {
    const {
      ValorDocumentoIdentidad,
      IdTipoMovimiento,
      Fecha = null,
      Monto,
      IdPostByUser = null,
      PostInIP = null,
      PostTime = null
    } = req.body;

    if (!ValorDocumentoIdentidad || !IdTipoMovimiento || Monto == null) {
      return res.status(400).json({ message: 'Faltan campos obligatorios (ValorDocumentoIdentidad, IdTipoMovimiento, Monto, NuevoSaldo)' });
    }

    const inputs = [
      { name: 'inValorDocumentoIdentidad', type: 'VarChar', length: 32, value: ValorDocumentoIdentidad },
      { name: 'inIdTipoMovimiento', type: 'Int', value: parseInt(IdTipoMovimiento, 10) },
      { name: 'inFecha', type: 'DateTime', value: Fecha ? Fecha : new Date() },
      { name: 'inMonto', type: 'Money', value: Monto },
      { name: 'inIdPostByUser', type: 'Int', value: IdPostByUser ? parseInt(IdPostByUser, 10) : null },
      { name: 'inPostInIP', type: 'VarChar', length: 15, value: PostInIP || req.ip || '' },
      { name: 'inPostTime', type: 'DateTime', value: PostTime ? PostTime : new Date() },
    ];

    const outputs = [{ name: 'outResultCode', type: 'Int' }];

    const r = await ejecutarSP('SP_InsertarMovimiento', inputs, outputs);
    const code = r.output?.outResultCode ?? null;

    if (code === 0) return res.status(201).json({ success: true });
    // mapear errores comunes que defina tu SP_InsertarMovimiento
    if (code === 50011) return res.status(400).json({ success: false, codigo: code, message: 'Monto del movimiento rechazado pues si se aplicar el saldo sería negativo' });

    return res.status(400).json({ success: false, codigo: code, message: 'Error al insertar movimiento' });
  } catch (error) {
    console.error('insertarMovimiento error:', error);
    res.status(500).json({ message: 'Error del servidor al insertar movimiento' });
  }
};
 