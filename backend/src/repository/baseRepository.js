import {prisma} from '../db.js'

export async function addRecord(tableName, data) {
  try {
    const newRecord = await prisma[tableName].create({
      data,
    });
    return newRecord;
  } catch (error) {
    throw new Error('Error al crear los datos en la BD');
  }
}

export async function updateRecord(tableName, id, data) {
  try {
    const updatedRecord = await prisma[tableName].update({
      where: { id: id },
      data,
    });
    return updatedRecord;
  } catch (error) {
    throw new Error('Error al actualizar los datos en la BD');
  }
}


export async function deleteRecord(tableName, id) {
  try {
    const deletedRecord = await prisma[tableName].delete({
      where: { id: id },
    });
    return deletedRecord;
  } catch (error) {
    throw new Error('Error al eliminar los datos de la BD');
  }
}


export async function readAll(tableName) {
  try {
    const data = await prisma[tableName].findMany();
    return data
  } catch (error) {
    throw new Error(`Error al solicitar los datos de ${tableName} en la BD`);
  }
}

export async function readRecord(tableName, id) {
  try {
    const record = await prisma[tableName].findFirst({
      where: {
        id: parseInt(id),
      },
    });
    return record
  } catch (error) {
    throw new Error('Error al buscar el elemento en la BD');
  }
}


export async function readAllWhere(tableName, id, field) {
  try {
    const record = await prisma[tableName].findMany({
      where: {
        [field]: parseInt(id),
      },
    });
    return record
  } catch (error) {
    throw new Error('Error al buscar los elementos en la BD');
  }
}