import {prisma} from '../db.js'

export async function getAll(tableName, includeRelations = []) {
  try {
    // Construimos el objeto include dinámicamente para las relaciones especificadas
    const includeObj = {};
    for (const relation of includeRelations) {
      includeObj[relation] = true;
    }
    const data = await prisma[tableName].findMany({
      include: includeObj,
    });
    return data
  } catch (error) {
    throw new Error(`Error al obtener todos los registros de ${tableName} en la BD: ${error.message}`);
  }
}

export async function create(tableName, data) {
  try {
    const newRecord = await prisma[tableName].create({
      data,
    });
    return newRecord;
  } catch (error) {
    throw new Error(`Error al crear un nuevo registro en ${tableName} en la BD: ${error.message}`);
  }
}

export async function update(tableName, filter, dataToUpdate) {
  try {
    const updatedRecord = await prisma[tableName].update({
      where: filter,
      data: dataToUpdate,
    });
    return updatedRecord;
  } catch (error) {
    throw new Error(`Error al actualizar el registro de ${tableName} en la BD: ${error.message}`);
  }
}


// Obtener un registro por su identificador único
export async function getById(tableName, id, includeRelations = []) {
  try {
    const includeObj = {};
    for (const relation of includeRelations) {
      includeObj[relation] = true;
    }
    const data = await prisma[tableName].findUnique({
      where: { id },
      include: includeObj,
    });
    return data;
  } catch (error) {
    throw new Error(`Error al obtener el registro de ${tableName} con id ${id} en la BD: ${error.message}`);
  }
}

// Actualizar un registro por su identificador único
export async function updateById(tableName, id, dataToUpdate) {
  try {
    const updatedRecord = await prisma[tableName].update({
      where: { id },
      data: dataToUpdate,
    });
    return updatedRecord;
  } catch (error) {
    throw new Error(`Error al actualizar el registro de ${tableName} con id ${id} en la BD: ${error.message}`);
  }
}

// Eliminar un registro por su identificador único
export async function deleteById(tableName, id) {
  try {
    const deletedRecord = await prisma[tableName].delete({
      where: { id },
    });
    return deletedRecord;
  } catch (error) {
    throw new Error(`Error al eliminar el registro de ${tableName} con id ${id} en la BD: ${error.message}`);
  }
}



//-------------------------------------

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