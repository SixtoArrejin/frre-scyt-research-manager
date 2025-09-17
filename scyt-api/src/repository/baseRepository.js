import { prisma } from '../db.js';

export async function getAll(tableName, includeRelations = []) {
  try {
    // Construimos el objeto include dinámicamente para las relaciones especificadas
    const includeObj = {};
    function processInclude(include, targetObj) {
      if (typeof include === 'string') {
        targetObj[include] = true;
      } else if (typeof include === 'object') {
        for (const relationName in include) {
          const nestedIncludes = include[relationName];
          if (Array.isArray(nestedIncludes) && nestedIncludes.length > 0) {
            const nestedIncludeObj = {};
            for (const nestedInclude of nestedIncludes) {
              processInclude(nestedInclude, nestedIncludeObj);
            }
            targetObj[relationName] = { include: nestedIncludeObj };
          }
        }
      }
    }

    for (const relation of includeRelations) {
      processInclude(relation, includeObj);
    }


    const data = await prisma[tableName].findMany({
      include: includeObj,
    });
    return data;
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
export async function getById(tableName, idField, idValue, includeRelations = []) {
  try {
    const whereFilter = { [idField]: idValue };
    const includeObj = {};
    function processInclude(include, targetObj) {
      if (typeof include === 'string') {
        targetObj[include] = true;
      } else if (typeof include === 'object') {
        for (const relationName in include) {
          const nestedIncludes = include[relationName];
          if (Array.isArray(nestedIncludes) && nestedIncludes.length > 0) {
            const nestedIncludeObj = {};
            for (const nestedInclude of nestedIncludes) {
              processInclude(nestedInclude, nestedIncludeObj);
            }
            targetObj[relationName] = { include: nestedIncludeObj };
          }
        }
      }
    }

    for (const relation of includeRelations) {
      processInclude(relation, includeObj);
    }
    const data = await prisma[tableName].findUnique({
      where: whereFilter,
      include: includeObj,
    });
    return data;
  } catch (error) {
    throw new Error(`Error al obtener el registro de ${tableName} con ${idField} ${idValue} en la BD: ${error.message}`);
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
      where: id,
    });
    return deletedRecord;
  } catch (error) {
    throw new Error(`Error al eliminar el registro de ${tableName} con id ${id} en la BD: ${error.message}`);
  }
}

export async function deleteByFilter(tableName, filter) {
  try {
    const deletedRecords = await prisma[tableName].deleteMany({
      where: filter,
    });
    return deletedRecords;
  } catch (error) {
    throw new Error(`Error al eliminar registros de ${tableName} con filtro ${JSON.stringify(filter)} en la BD: ${error.message}`);
  }
}

export async function deleteByCompositeKey(tableName, key1Name, key1Value, key2Name, key2Value) {
  try {
    // Construimos el objeto compuesto para el `where`
    const compositeKey = {
      [`${key1Name}_${key2Name}`]: {
        [key1Name]: key1Value,
        [key2Name]: key2Value,
      },
    };

    const deletedRecord = await prisma[tableName].delete({
      where: compositeKey,
    });

    return deletedRecord;
  } catch (error) {
    throw new Error(`Error al eliminar el registro de ${tableName} con ${key1Name} = ${key1Value} y ${key2Name} = ${key2Value}: ${error.message}`);
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
    return record;
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
    return record;
  } catch (error) {
    throw new Error('Error al buscar los elementos en la BD');
  }
}

// Obtener varios registros donde un campo X sea igual a Y
export async function getByField(tableName, fieldName, fieldValue, includeRelations = []) {
  try {
    const whereFilter = { [fieldName]: fieldValue };
    const includeObj = {};

    function processInclude(include, targetObj) {
      if (typeof include === 'string') {
        targetObj[include] = true;
      } else if (typeof include === 'object') {
        for (const relationName in include) {
          const nestedIncludes = include[relationName];
          if (Array.isArray(nestedIncludes) && nestedIncludes.length > 0) {
            const nestedIncludeObj = {};
            for (const nestedInclude of nestedIncludes) {
              processInclude(nestedInclude, nestedIncludeObj);
            }
            targetObj[relationName] = { include: nestedIncludeObj };
          }
        }
      }
    }

    for (const relation of includeRelations) {
      processInclude(relation, includeObj);
    }

    const data = await prisma[tableName].findMany({
      where: whereFilter,
      include: includeObj,
    });

    return data;
  } catch (error) {
    throw new Error(`Error al obtener registros de ${tableName} donde ${fieldName} es ${fieldValue}: ${error.message}`);
  }
}
