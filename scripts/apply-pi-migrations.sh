#!/bin/bash

# Script para aplicar las migraciones de Propiedad Intelectual
# Ejecutar este script después de que la base de datos de Render esté activa

echo "=========================================="
echo "Aplicando migraciones de Propiedad Intelectual"
echo "=========================================="
echo ""

# Navegar al directorio de la API
cd "$(dirname "$0")/../scyt-api"

echo "1. Verificando conexión a la base de datos..."
npx prisma db execute --stdin < /dev/null 2>&1 | head -5

echo ""
echo "2. Aplicando schema a la base de datos..."
npx prisma db push

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ ¡Migraciones aplicadas exitosamente!"
    echo ""
    echo "3. Regenerando cliente Prisma..."
    npx prisma generate
    
    if [ $? -eq 0 ]; then
        echo ""
        echo "✅ ¡Todo listo!"
        echo ""
        echo "Las tablas creadas fueron:"
        echo "  - propiedadintelectual"
        echo "  - investigadorespi"
        echo ""
        echo "Ahora puedes iniciar el servidor:"
        echo "  cd scyt-api && npm start"
        echo ""
    else
        echo ""
        echo "❌ Error al generar el cliente Prisma"
        exit 1
    fi
else
    echo ""
    echo "❌ Error al aplicar las migraciones"
    echo ""
    echo "Posibles causas:"
    echo "  1. La base de datos de Render está durmiendo (espera un momento y reintenta)"
    echo "  2. La URL de conexión es incorrecta"
    echo "  3. No hay conexión a Internet"
    echo ""
    echo "Si la DB está durmiendo, espera 30 segundos y ejecuta de nuevo:"
    echo "  ./scripts/apply-pi-migrations.sh"
    exit 1
fi
