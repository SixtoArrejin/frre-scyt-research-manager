import {PrismaClient} from '@prisma/client'
export const prisma = new PrismaClient()

prisma
  .$connect()
  .then(() => console.log("Conexión exitosa con la base de datos"))
  .catch(() => console.log("Conexión fallida con la base de datos"));