import { prisma } from "../src/db.js";
import bcrypt from "bcrypt";
import { ROLES } from "../src/config/roles.js";

async function createAdminUser(silent = false) {
  try {
    if (!silent) {
      console.log("🚀 Creando usuario administrador...");
    }

    const adminUsername = "admin";
    const adminPassword = "admin123"; // Cambiar en producción

    // Verificar si ya existe un usuario admin
    const existingAdmin = await prisma.usuarios.findUnique({
      where: { usuario: adminUsername },
    });

    if (existingAdmin) {
      if (!silent) {
        console.log("⚠️  Usuario administrador ya existe.");
      }
      return { exists: true, created: false };
    } else {
      if (!silent) {
        console.log("📝 Creando nuevo usuario administrador...");
      }

      const hashedPassword = await bcrypt.hash(adminPassword, 10);
      await prisma.usuarios.create({
        data: {
          usuario: adminUsername,
          contrasena: hashedPassword,
          rol: ROLES.ADMIN,
          activo: true,
          creadoPor: "system",
        },
      });

      if (!silent) {
        console.log("✅ Usuario administrador creado exitosamente");
        console.log(`
🔐 Credenciales del administrador:
   Usuario: ${adminUsername}
   Contraseña: ${adminPassword}
   Rol: ${ROLES.ADMIN}
   
⚠️  IMPORTANTE: Cambia la contraseña después del primer login`);
      } else {
        console.log("✅ Usuario administrador inicializado automáticamente");
      }

      return { exists: false, created: true };
    }
  } catch (error) {
    console.error("❌ Error al crear usuario administrador:", error);
    return { exists: false, created: false, error: error.message };
  }
}

// Ejecutar si el script se llama directamente
if (import.meta.url === `file://${process.argv[1]}`) {
  createAdminUser().finally(() => prisma.$disconnect());
}

export { createAdminUser };
