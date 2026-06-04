import { prisma } from '../src/db.js';
import bcrypt from 'bcrypt';
import { ROLES } from '../src/config/roles.js';

// Configuración de usuario administrador inicial obtenido de variables de entorno

/**
 * Crea el usuario administrador inicial si no existe ninguno creado por el sistema
 * @param {boolean} silent - Si debe ejecutarse en modo silencioso
 * @returns {Object} Resumen de la operación
 */
async function createDefaultUsers(silent = false) {
  try {
    if (!silent) {
      console.log('🚀 Inicializando usuario administrador del sistema...');
      console.log('─'.repeat(60));
    }

    // Verificar si ya existe algún administrador creado por el sistema
    const existingSystemAdmin = await prisma.usuarios.findFirst({
      where: {
        rol: ROLES.ADMIN,
        creadoPor: 'system',
      },
    });

    if (existingSystemAdmin) {
      if (!silent) {
        console.log(`⚠️  Ya existe un usuario administrador creado por el sistema: '${existingSystemAdmin.usuario}'.`);
        console.log('Omitiendo inicialización.');
      }
      return { 
        total: 1, 
        created: 0, 
        existed: 1, 
        errors: 0, 
        details: [{ exists: true, created: false, usuario: existingSystemAdmin.usuario }] 
      };
    }

    // Obtener credenciales de variables de entorno con fallbacks seguros
    const adminUsername = process.env.INITIAL_ADMIN_USER || 'SCyT-Admin';
    const adminPassword = process.env.INITIAL_ADMIN_PASSWORD || 'scytadmin123';

    // Hashear la contraseña
    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    // Crear el administrador inicial
    await prisma.usuarios.create({
      data: {
        usuario: adminUsername,
        contrasena: hashedPassword,
        rol: ROLES.ADMIN,
        activo: true,
        creadoPor: 'system',
      },
    });

    if (!silent) {
      console.log('✅ Usuario administrador creado exitosamente');
      console.log('─'.repeat(60));
      console.log('🔐 Credenciales del administrador inicial:');
      console.log(`   Usuario: ${adminUsername}`);
      console.log(`   Contraseña: ${adminPassword}`);
      console.log(`   Rol: ${ROLES.ADMIN}`);
      console.log('─'.repeat(60));
      console.log('⚠️  IMPORTANTE: Cambia la contraseña después del primer login');
    } else {
      console.log('✅ Usuario administrador por defecto inicializado automáticamente');
    }

    return {
      total: 1,
      created: 1,
      existed: 0,
      errors: 0,
      details: [{ exists: false, created: true, usuario: adminUsername }]
    };
  } catch (error) {
    console.error('❌ Error durante la inicialización de usuarios:', error);
    return {
      total: 1,
      created: 0,
      existed: 0,
      errors: 1,
      error: error.message,
      details: []
    };
  }
}

/**
 * Función legacy para mantener compatibilidad
 * @param {boolean} silent - Si debe ejecutarse en modo silencioso
 * @returns {Object} Resultado de la creación del admin
 */
async function createAdminUser(silent = false) {
  const result = await createDefaultUsers(silent);
  if (result.details && result.details.length > 0) {
    return result.details[0];
  }
  throw new Error(result.error || 'Error al inicializar el usuario administrador');
}

// Ejecutar si el script se llama directamente
if (import.meta.url === `file://${process.argv[1]}`) {
  createDefaultUsers().finally(() => prisma.$disconnect());
}

export { createDefaultUsers, createAdminUser };
