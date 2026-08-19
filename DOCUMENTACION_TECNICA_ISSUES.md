# Documentación Técnica de Cambios por Issue (#140 a #150)

Este documento contiene el detalle técnico completo de las modificaciones realizadas en la aplicación SCyT (`scyt-api` y `scyt-web`) para resolver las 11 historias de usuario recientes.

---

## 🛠️ Cambios en la Base de Datos (Prisma Schema)

**Archivo:** `scyt-api/prisma/schema.prisma`

- **`model personas`**: Se agregó la propiedad `orcid String? @db.VarChar(50)` para almacenar el identificador internacional ORCID opcionalmente.
- **`model proyectos`**: Se agregaron las propiedades `trl String? @db.VarChar(50)` (Nivel de Madurez Tecnológica) y `descripcionBreve String? @db.VarChar(1000)` (Resumen del proyecto).
- **`model participa`**: Se agregó el campo `fechaFin DateTime? @db.Date` para registrar la fecha de desvinculación/baja de un investigador en un proyecto manteniendo su registro en el historial.

---

## 📋 Detalle por Issue

### Issue #140: Permitir la carga de investigadores externos sin número de legajo
- **Objetivo:** Permitir guardar investigadores sin requerir un número de legajo.
- **Archivos Modificados:**
  - `scyt-web/src/hooks/forms/useNuevoInvestigadorForm.js`: Se modificó la regla Yup del campo `legajo` a `.nullable().notRequired()`.
  - `scyt-web/src/hooks/forms/useModificarInvestigadorForm.js`: Se adaptó la regla Yup para permitir el valor nulo o vacío.
  - `scyt-web/src/pages/investigadores/NuevoInvestigador.jsx`: Se removió la propiedad `isRequired` del componente `GenericInput` para `legajo`.
  - `scyt-web/src/pages/investigadores/ModificarInvestigador.jsx`: Se removió la propiedad `isRequired` para `legajo`.

---

### Issue #141: Hacer opcional el campo fecha de ingreso al grupo para investigadores
- **Objetivo:** Permitir guardar la ficha del investigador con la fecha de ingreso al grupo en blanco.
- **Archivos Modificados:**
  - `scyt-web/src/hooks/forms/useNuevoInvestigadorForm.js`: Se configuró Yup con `.nullable().notRequired().transform((curr, orig) => (orig === '' || !orig ? null : curr))` y se removió la validación obligatoria en `validateData`.
  - `scyt-web/src/hooks/forms/useModificarInvestigadorForm.js`: Se actualizó Yup y el formateador de fechas para aceptar valores vacíos sin arrojar error de tipo.
  - `scyt-web/src/pages/investigadores/NuevoInvestigador.jsx` y `ModificarInvestigador.jsx`: Se removió el indicador `isRequired` del campo `fechaIngresoGrupo`.

---

### Issue #142: Permitir modificar el tipo de proyecto tras la carga inicial (PID a Externo y viceversa)
- **Objetivo:** Posibilitar el cambio entre tipo de proyecto PID y proyecto Externo tras la carga inicial, así como la actualización de la subclasificación "Tipo de proyecto".
- **Archivos Modificados:**
  - `scyt-api/src/repository/proyectosRepository.js`: Se incorporaron las funciones `deletePid` y `deleteProyectoExterno` para remover los registros de extensiones al cambiar la categoría del proyecto.
  - `scyt-api/src/services/proyectosService.js`: Se implementó `updateProyectoDataService` detectando si el proyecto cambia de tipo (PID $\leftrightarrow$ Externo), eliminando la relación anterior en la BD y creando/actualizando la nueva relación correspondiente.
  - `scyt-web/src/hooks/forms/useModificarProyectoForm.js`: Se configuró `esPid` de forma reactiva con `watch('tipo')` y se mantuvo la propiedad `tipo` en el objeto final de modificación enviado al backend.
  - `scyt-web/src/pages/proyectos/Modificar.jsx`: Se añadió el selector de radio `GenericRadio` para alternar entre "PID" y "Externo" durante la edición del proyecto.

---

### Issue #143: Agregar la opción PID Interfacultad como tipo de proyecto
- **Objetivo:** Incorporar "PID Interfacultad" como clasificación válida en el sistema habilitando la carga e integración de Instituciones Asociadas.
- **Archivos Modificados:**
  - `scyt-api/src/repository/initDB.js`: Se añadió `'PID Interfacultad'` al array `tiposProyectosData` para la base de datos.
  - `scyt-web/src/hooks/forms/useNuevoProyectoForm.js` y `useModificarProyectoForm.js`: Se incorporó `'PID Interfacultad'` a la constante `tipoProyectosInterinstitucionales`.
  - Con este ajuste, la carga (`Nuevo.jsx`), modificación (`Modificar.jsx`) y detalle (`DetalleProyecto.jsx`) despliegan y gestionan dinámicamente la tarjeta de "Instituciones Asociadas" para proyectos de tipo PID Interfacultad.

---

### Issue #144: Omitir la selección obligatoria de tipo de proyecto para proyectos externos
- **Objetivo:** Evitar que a los proyectos externos se les exija seleccionar una categoría propia de PID.
- **Archivos Modificados:**
  - `scyt-web/src/hooks/forms/useNuevoProyectoForm.js`: Se modificó Yup para que `tipoProyecto` solo sea requerido cuando `tipo === 'pid'`.
  - `scyt-web/src/hooks/forms/useModificarProyectoForm.js`: Igual ajuste condicional con Yup `.when('tipo', ...)`.
  - `scyt-web/src/pages/proyectos/Nuevo.jsx` y `Modificar.jsx`: Se asignó `isRequired={PidExterno === 'pid'}` / `isRequired={esPid}` en el `GenericSelect` de `tipoProyecto`.

---

### Issue #145: Registrar la baja de un investigador en un proyecto con su fecha correspondiente
- **Objetivo:** Indicar la desvinculación de un participante en un proyecto guardando la fecha de baja e historial.
- **Archivos Modificados:**
  - `scyt-api/src/repository/proyectosRepository.js`: Se implementó `bajaPersonaParticipaProyecto` ejecutando `prisma.participa.update` para asignar `fechaFin`.
  - `scyt-api/src/services/proyectosService.js`: Se agregó `bajaPersonaParticipaProyectoService`.
  - `scyt-api/src/controllers/proyectosController.js`: Se creó `bajaInvestigadorController` procesando `req.body.fechaFin`.
  - `scyt-api/src/routes/proyectosRouter.js`: Se registró la ruta `PUT /:idProyecto/investigador/:idInvestigador/baja`.
  - `scyt-web/src/utils/api/proyectosApi.js`: Se agregó la función helper `bajaInvestigador(idProyecto, idInvestigador, fechaFin)`.
  - `scyt-web/src/pages/proyectos/DetalleProyecto.jsx`: Se agregaron las columnas "Estado En Proy." y "Fecha Baja", junto a un botón "Baja" con modal emergente para seleccionar la fecha de término.

---

### Issue #146: Registrar y visualizar el nivel de madurez tecnológica (TRL) en los proyectos
- **Objetivo:** Cargar y mostrar el nivel TRL (1 al 9) en los proyectos.
- **Archivos Modificados:**
  - `scyt-api/src/repository/proyectosRepository.js` y `proyectosService.js`: Mapeo de `trl` en creación y actualización de proyectos.
  - `scyt-web/src/hooks/forms/useNuevoProyectoForm.js` y `useModificarProyectoForm.js`: Registro del atributo `trl` en schema y defaultValues.
  - `scyt-web/src/pages/proyectos/Nuevo.jsx` y `Modificar.jsx`: Se agregó un `GenericSelect` con las opciones normalizadas de TRL 1 a TRL 9.
  - `scyt-web/src/pages/proyectos/Proyectos.jsx`: Se añadió la columna **TRL** en la tabla principal de proyectos.
  - `scyt-web/src/pages/proyectos/DetalleProyecto.jsx`: Se incorporó el `DisplayField` para Nivel TRL.

---

### Issue #147: Exportar el listado de proyectos a formato Excel
- **Objetivo:** Ofrecer la descarga directa de la tabla de proyectos a una planilla Excel.
- **Archivos Modificados:**
  - `scyt-web/src/pages/proyectos/Proyectos.jsx`: Se implementó la función `handleExportExcel` utilizando la librería `xlsx` para convertir los datos visibles y filtrados en una hoja `.xlsx` descargable al hacer clic en el nuevo botón "Exportar a Excel".

---

### Issue #148: Agregar campo de descripción breve en los proyectos
- **Objetivo:** Disponer de un resumen claro sobre los objetivos de la investigación en cada proyecto.
- **Archivos Modificados:**
  - `scyt-api/src/repository/proyectosRepository.js` y `proyectosService.js`: Persistencia del campo `descripcionBreve`.
  - `scyt-web/src/hooks/forms/useNuevoProyectoForm.js` y `useModificarProyectoForm.js`: Soporte en formularios.
  - `scyt-web/src/pages/proyectos/Nuevo.jsx` y `Modificar.jsx`: Campo de texto multilinea `GenericInput textArea` para "Descripción Breve".
  - `scyt-web/src/pages/proyectos/DetalleProyecto.jsx`: Mapeo del campo `descripcionBreve` en la tarjeta de datos.

---

### Issue #149: Agregar opción para mostrar u ocultar la contraseña ingresada
- **Objetivo:** Alternar la visibilidad de la contraseña en la pantalla de inicio de sesión.
- **Archivos Modificados:**
  - `scyt-web/src/pages/LogIn.jsx`: Se integró el estado local `showPassword`, envolviendo el input de contraseña en un `InputGroup` con un `IconButton` que alterna los íconos `ViewIcon` y `ViewOffIcon`.

---

### Issue #150: Registrar opcionalmente el número ORCID en los datos de los investigadores
- **Objetivo:** Cargar y consultar el identificador ORCID en la ficha del investigador.
- **Archivos Modificados:**
  - `scyt-web/src/hooks/forms/useNuevoInvestigadorForm.js` y `useModificarInvestigadorForm.js`: Definición del atributo `orcid` como opcional.
  - `scyt-web/src/pages/investigadores/NuevoInvestigador.jsx` y `ModificarInvestigador.jsx`: Campo de texto para ingresar el "Número ORCID".
  - `scyt-web/src/pages/investigadores/DetalleInvestigador.jsx`: Visualización del campo "Número ORCID".
