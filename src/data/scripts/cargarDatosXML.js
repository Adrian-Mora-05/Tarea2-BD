import fs from 'fs';
import sql from 'mssql';
import * as dotenv from 'dotenv';

dotenv.config(); // Cargar variables de entorno

// Ruta del archivo XML (definida en el .env)
const xmlPath = process.env.RUTA_SIMULACION;

const config = {
  server: process.env.DB_SERVER,
  port: parseInt(process.env.DB_PORT),
  database: process.env.DB_DATABASE,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  options: {
    encrypt: process.env.DB_ENCRYPT === 'true',
    trustServerCertificate: process.env.DB_TRUST_CERT === 'true',
  },
};


// Leer el XML completo
let xmlContent = fs.readFileSync(xmlPath, 'utf-8');

// Eliminar cabecera XML si existe
xmlContent = xmlContent.replace(/<\?xml[^>]*\?>/, '');

async function enviarXML() {
  try {
    const pool = await sql.connect(config);

    const resultado = await pool.request()
      .input('inArchivoXML', sql.NVarChar(sql.MAX), xmlContent)
      .output('outResultCode', sql.Int)
      .execute('SP_CargarDatos'); // Nombre del SP

    console.log('Resultado del SP:', resultado.output);
    console.log('XML enviado correctamente y procesado en SQL Server.');

    await sql.close();
  } catch (err) {
    console.error('Error al enviar el XML:', err);
  }
}

// Llamar a la función principal
enviarXML();