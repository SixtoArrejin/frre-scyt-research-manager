import { prisma } from "../src/db.js";
import bcrypt from "bcrypt";
import { ROLES } from "../src/config/roles.js";

async function createExampleUsers() {
  try {
    console.log("🚀 Creando usuarios de ejemplo...");

    const exampleUsers = [
      {
        usuario: "pid_user",
        contrasena: "pid123",
        rol: ROLES.PID,
        descripcion: "Usuario especialista en proyectos de I+D",
      },
      {
        usuario: "rrhh_user",
        contrasena: "rrhh123",
        rol: ROLES.RRHH,
        descripcion: "Usuario especialista en recursos humanos",
      },
      {
        usuario: "uvt_user",
        contrasena: "uvt123",
        rol: ROLES.UVT,
        descripcion: "Usuario especialista en vinculación tecnológica",
      },
      {
        usuario: "viewer_user",
        contrasena: "viewer123",
        rol: ROLES.VIEWER,
        descripcion: "Usuario con permisos de solo lectura",
      },
    ];

    for (const userData of exampleUsers) {
      try {
        // Verificar si el usuario ya existe
        const existingUser = await prisma.usuarios.findUnique({
          where: { usuario: userData.usuario },
        });

        if (existingUser) {
          console.log(
            `⚠️  Usuario ${userData.usuario} ya existe. Omitiendo...`
          );
          continue;
        }

        // Crear nuevo usuario
        const hashedPassword = await bcrypt.hash(userData.contrasena, 10);
        await prisma.usuarios.create({
          data: {
            usuario: userData.usuario,
            contrasena: hashedPassword,
            rol: userData.rol,
            activo: true,
            creadoPor: "system",
          },
        });

        console.log(
          `✅ Usuario ${userData.usuario} (${userData.rol}) creado exitosamente`
        );
        console.log(`   ${userData.descripcion}`);
      } catch (userError) {
        console.error(
          `❌ Error al crear usuario ${userData.usuario}:`,
          userError.message
        );
      }
    }

    console.log(`
🔐 Usuarios de ejemplo creados:
   pid_user / pid123 (${ROLES.PID})
   rrhh_user / rrhh123 (${ROLES.RRHH})
   uvt_user / uvt123 (${ROLES.UVT})
   viewer_user / viewer123 (${ROLES.VIEWER})
   
📝 Estos usuarios son para pruebas. En producción, crea usuarios específicos.`);
  } catch (error) {
    console.error("❌ Error al crear usuarios de ejemplo:", error);
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar si el script se llama directamente
if (import.meta.url === `file://${process.argv[1]}`) {
  createExampleUsers();
}

export { createExampleUsers };
