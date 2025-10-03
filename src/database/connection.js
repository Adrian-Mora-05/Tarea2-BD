// Importa la librería mssql para conectarse a bases de datos Microsoft SQL Server
import sql from 'mssql';

// Configuración de la conexión a la base de datos
const dbSettings = {
    user: "UserTarea1",                         // Usuario de la base de datos
    password: "PasswordTarea1",                 // Contraseña del usuario
    server: "mssql-201669-0.cloudclusters.net", // Dirección del servidor remoto de SQL
    port: 10029,                                // Puerto de conexión
    database: "Tarea2-BD",                         // Nombre de la base de datos a usar
    options: {
        encrypt: true,                  // Requerido en conexiones seguras (TLS/SSL)
        trustServerCertificate: true    // Permite aceptar certificados autofirmados
    }
}

// Función para obtener una conexión activa con la base de datos
export const getConnection = async () =>{
    try {  
        // Crea un "pool" de conexiones a la base de datos con la configuración definida
        const pool = await sql.connect(dbSettings);
        // Devuelve el objeto pool para que otros módulos lo usen en SP
        return pool;
    } catch (error) {
        // Si ocurre un error en la conexión, lo muestra en consola
        console.error(error);
    }
}

// getConnection();