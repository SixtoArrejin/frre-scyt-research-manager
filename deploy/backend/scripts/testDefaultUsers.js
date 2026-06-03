import { createDefaultUsers } from './createDefaultUsers.js';

// Script para probar la creación de usuarios por defecto
console.log('🧪 Ejecutando prueba de creación de usuarios por defecto...\n');

createDefaultUsers(false)
  .then((result) => {
    console.log('\n🎯 Resultado de la prueba:');
    console.log(result);
  })
  .catch((error) => {
    console.error('\n❌ Error durante la prueba:', error);
  })
  .finally(() => {
    console.log('\n✅ Prueba completada');
    process.exit(0);
  });
