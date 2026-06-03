import { prisma } from '../src/db.js';
import bcrypt from 'bcrypt';
import { ROLES } from '../src/config/roles.js';

// Configuración de usuarios por defecto
const DEFAULT_USERS = [
  {
    usuario: 'SCyT-Admin',
    contrasena: 'scytadmin123',
    rol: ROLES.ADMIN,
    descripcion: 'Usuario administrador del sistema',
  },
  {
    usuario: 'SCyT-PID',
    contrasena: 'scytpid123',
    rol: ROLES.PID,
    descripcion: 'Usuario para gestión de proyectos PID',
  },
  {
    usuario: 'SCyT-UVT',
    contrasena: 'scytuvt123',
    rol: ROLES.UVT,
    descripcion: 'Usuario para gestión de vinculaciones tecnológicas',
  },
  {
    usuario: 'SCyT-RRHH',
    contrasena: 'scytrrhh123',
    rol: ROLES.RRHH,
    descripcion: 'Usuario para gestión de recursos humanos',
  },
  {
    usuario: 'SCyT-VIEWER',
    contrasena: 'scytviewer123',
    rol: ROLES.VIEWER,
    descripcion: 'Usuario con permisos de solo lectura',
  },
];

/**
 * Crea un usuario específico si no existe
 * @param {Object} userData - Datos del usuario a crear
 * @param {boolean} silent - Si debe ejecutarse en modo silencioso
 * @returns {Object} Resultado de la operación
 */
async function createUserIfNotExists(userData, silent = false) {
  try {
    // Verificar si ya existe el usuario
    const existingUser = await prisma.usuarios.findUnique({
      where: { usuario: userData.usuario },
    });

    if (existingUser) {
      if (!silent) {
        console.log(`⚠️  Usuario '${userData.usuario}' ya existe.`);
      }
      return { exists: true, created: false, usuario: userData.usuario };
    }

    // Crear el usuario
    const hashedPassword = await bcrypt.hash(userData.contrasena, 10);
    await prisma.usuarios.create({
      data: {
        usuario: userData.usuario,
        contrasena: hashedPassword,
        rol: userData.rol,
        activo: true,
        creadoPor: 'system',
      },
    });

    if (!silent) {
      console.log(`✅ Usuario '${userData.usuario}' creado exitosamente`);
    }

    return { exists: false, created: true, usuario: userData.usuario };
  } catch (error) {
    console.error(`❌ Error al crear usuario '${userData.usuario}':`, error.message);
    return { exists: false, created: false, usuario: userData.usuario, error: error.message };
  }
}

/**
 * Crea todos los usuarios por defecto del sistema
 * @param {boolean} silent - Si debe ejecutarse en modo silencioso
 * @returns {Object} Resumen de la operación
 */
async function createDefaultUsers(silent = false) {
  try {
    if (!silent) {
      console.log('🚀 Inicializando usuarios por defecto del sistema...');
      console.log('─'.repeat(60));
    }

    const results = {
      total: DEFAULT_USERS.length,
      created: 0,
      existed: 0,
      errors: 0,
      details: [],
    };

    // Crear cada usuario
    for (const userData of DEFAULT_USERS) {
      const result = await createUserIfNotExists(userData, silent);
      results.details.push(result);
      
      if (result.created) {
        results.created++;
      } else if (result.exists) {
        results.existed++;
      } else {
        results.errors++;
      }
    }

    // Mostrar resumen
    if (!silent) {
      console.log('─'.repeat(60));
      console.log('📊 Resumen de inicialización de usuarios:');
      console.log(`   • Total de usuarios: ${results.total}`);
      console.log(`   • Creados: ${results.created}`);
      console.log(`   • Ya existían: ${results.existed}`);
      console.log(`   • Errores: ${results.errors}`);
      
      if (results.created > 0) {
        console.log('\n🔐 Credenciales de usuarios creados:');
        console.log('─'.repeat(60));
        DEFAULT_USERS.forEach(user => {
          const userResult = results.details.find(r => r.usuario === user.usuario);
          if (userResult && userResult.created) {
            console.log(`   ${user.descripcion}:`);
            console.log(`   Usuario: ${user.usuario}`);
            console.log(`   Contraseña: ${user.contrasena}`);
            console.log(`   Rol: ${user.rol}`);
            console.log('   ─'.repeat(40));
          }
        });
        console.log('\n⚠️  IMPORTANTE: Cambiar las contraseñas después del primer login');
      }
    } else if (results.created > 0) {
      console.log(`✅ ${results.created} usuarios por defecto inicializados automáticamente`);
    }

    return results;
  } catch (error) {
    console.error('❌ Error durante la inicialización de usuarios:', error);
    return { 
      total: DEFAULT_USERS.length,
      created: 0,
      existed: 0,
      errors: DEFAULT_USERS.length,
      error: error.message,
    };
  }
}

/**
 * Función legacy para mantener compatibilidad
 * @param {boolean} silent - Si debe ejecutarse en modo silencioso
 * @returns {Object} Resultado de la creación del admin
 */
async function createAdminUser(silent = false) {
  const adminUser = DEFAULT_USERS.find(user => user.rol === ROLES.ADMIN);
  if (adminUser) {
    return await createUserIfNotExists(adminUser, silent);
  }
  throw new Error('Usuario administrador no encontrado en la configuración por defecto');
}

// Ejecutar si el script se llama directamente
if (import.meta.url === `file://${process.argv[1]}`) {
  createDefaultUsers().finally(() => prisma.$disconnect());
}

export { createDefaultUsers, createAdminUser };
