# Resumen Funcional de Mejoras y Nuevas Funcionalidades

Este documento explica de forma sencilla y sin tecnicismos todas las nuevas características y mejoras incorporadas al sistema SCyT para los usuarios finales (gestores, investigadores y administradores).

---

## 📌 1. Registro de Investigadores sin datos obligatorios innecesarios (#140 y #141)
- **Carga de Investigadores Externos sin Legajo (#140):** Ahora es posible registrar colaboradores o investigadores externos que no pertenecen a la institución dejando el campo de legajo vacío. Ya no te bloqueará ni exigirá un número de legajo para guardar el formulario.
- **Fecha de ingreso al grupo opcional (#141):** Si al momento de dar de alta o editar un investigador no se cuenta con la fecha exacta en la que se sumó al grupo de investigación, se puede dejar la fecha en blanco y guardar el perfil sin inconvenientes.

---

## 📌 2. Identificador internacional ORCID para Investigadores (#150)
- En el formulario de alta y edición de investigadores se sumó el campo opcional **"Número ORCID"** (ejemplo: `0000-0002-1825-0097`).
- Al completar este campo, el código ORCID quedará guardado y se podrá consultar claramente en la pantalla de detalle del perfil del investigador.

---

## 📌 3. Visualizar u ocultar contraseña al iniciar sesión (#149)
- En la pantalla de inicio de sesión (Login), el campo de contraseña ahora incluye un **botón con un icono de ojo** a la derecha.
- Al hacer clic en el ojo, el usuario puede ver la contraseña que está escribiendo para verificar que no haya cometido errores de tipeo antes de ingresar. Por defecto, la contraseña siempre permanece oculta.

---

## 📌 4. Clasificación "PID Interfacultad" (#143)
- En la lista desplegable de **Tipos de proyectos** se agregó la nueva opción **"PID Interfacultad"**.
- Esto permite clasificar adecuadamente aquellos proyectos de investigación realizados en conjunto entre distintas facultades de la universidad.

---

## 📌 5. Cambiar el tipo de proyecto en proyectos ya creados (#142)
- Si cometiste un error al registrar un proyecto o si su categoría cambia con el tiempo, ahora puedes ingresar a la pantalla de **modificación del proyecto** y cambiar el "Tipo de proyecto" en cualquier momento.

---

## 📌 6. Registro simplificado de Proyectos Externos (#144)
- Al crear o modificar un **Proyecto Externo**, la casilla de "Tipo de proyecto" deja de ser obligatoria.
- De esta manera, no es necesario forzar una clasificación pensada para proyectos internos (PID) en proyectos de empresas u organismos externos.

---

## 📌 7. Descripción breve en los proyectos (#148)
- Los formularios de creación y edición de proyectos incorporan una nueva casilla para escribir un **resumen o descripción breve** del proyecto.
- Esta descripción se muestra claramente en la ficha detallada del proyecto para que cualquier gestor o visitante entienda los objetivos de la investigación de un vistazo.

---

## 📌 8. Nivel de Madurez Tecnológica - TRL (#146)
- Se incorporó el campo **Nivel TRL (Technology Readiness Level)** en el formulario del proyecto con opciones desde **TRL 1** (Principios básicos) hasta **TRL 9** (Sistema probado).
- El nivel TRL seleccionado se muestra tanto en la tarjeta de detalle del proyecto como en la **columna TRL de la tabla principal de proyectos**.

---

## 📌 9. Exportar el listado de proyectos a Excel (#147)
- En la pantalla principal de proyectos se agregó un nuevo botón verde **"Exportar a Excel"**.
- Al hacer clic en este botón, se descarga instantáneamente a la computadora un archivo de Excel (`.xlsx`) con todos los proyectos de la lista (respetando los filtros aplicados), ideal para armar reportes externos y trabajar sin conexión.

---

## 📌 10. Historial y registro de baja de investigadores en proyectos (#145)
- En la vista de detalle de un proyecto, dentro de la tabla de integrantes, ahora aparece el botón **"Baja"** al lado de cada investigador activo.
- Al presionar "Baja", se despliega una ventana donde se indica la **fecha de baja**.
- El sistema registra la baja del participante mostrando una etiqueta roja de "Dado de baja" y la fecha exacta, **sin borrar al investigador del historial previo del proyecto**.
