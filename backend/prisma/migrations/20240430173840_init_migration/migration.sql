-- CreateTable
CREATE TABLE "categorias" (
    "idCategoria" SERIAL NOT NULL,
    "equiparacion" BOOLEAN,
    "tipo" VARCHAR(20),
    "categoria" VARCHAR(10),
    "fecha" DATE,
    "normativa" VARCHAR(20),
    "idPersona" INTEGER NOT NULL,
    "comision" VARCHAR(50),

    CONSTRAINT "categorias_pkey" PRIMARY KEY ("idCategoria")
);

-- CreateTable
CREATE TABLE "gruposinvestigacion" (
    "idGrupoInvestigacion" SERIAL NOT NULL,
    "siglas" VARCHAR(15),
    "nombre" VARCHAR(40),
    "resolucion" VARCHAR(10),
    "fechaCreacion" DATE,

    CONSTRAINT "gruposinvestigacion_pkey" PRIMARY KEY ("idGrupoInvestigacion")
);

-- CreateTable
CREATE TABLE "participa" (
    "idPersona" INTEGER NOT NULL,
    "idProyecto" INTEGER NOT NULL,
    "rol" VARCHAR(50) NOT NULL,
    "fechaInicio" DATE,

    CONSTRAINT "participa_pkey" PRIMARY KEY ("idPersona","idProyecto")
);

-- CreateTable
CREATE TABLE "personas" (
    "idPersona" SERIAL NOT NULL,
    "dni" INTEGER,
    "nombre" VARCHAR(30),
    "apellido" VARCHAR(30),
    "fechaIngreso" DATE,
    "activo" BOOLEAN,
    "idGrupoInvestigacion" INTEGER NOT NULL,

    CONSTRAINT "personas_pkey" PRIMARY KEY ("idPersona")
);

-- CreateTable
CREATE TABLE "proyectos" (
    "idProyecto" SERIAL NOT NULL,
    "tipoActividad" VARCHAR(256),
    "fechaInicio" DATE,
    "fechaFin" DATE,
    "denominacion" VARCHAR(256),
    "completo" BOOLEAN,
    "regional" VARCHAR(256),
    "convocatoria" INTEGER,
    "estado" VARCHAR(256),
    "idDirector" INTEGER NOT NULL,
    "idCodirector" INTEGER,
    "tipoProyecto" VARCHAR(256),
    "codPid" VARCHAR(256),
    "programa" VARCHAR(256),
    "disposicion" VARCHAR(256),
    "prorrogado" BOOLEAN,

    CONSTRAINT "proyectos_pkey" PRIMARY KEY ("idProyecto")
);

-- CreateTable
CREATE TABLE "tiene" (
    "idGrupoInvestigacion" INTEGER NOT NULL,
    "idProyecto" INTEGER NOT NULL,

    CONSTRAINT "tiene_pkey" PRIMARY KEY ("idGrupoInvestigacion","idProyecto")
);

-- CreateTable
CREATE TABLE "usuarios" (
    "usuario" VARCHAR(20) NOT NULL,
    "contrasena" VARCHAR(255),

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("usuario")
);

-- CreateTable
CREATE TABLE "regionales" (
    "nombre" VARCHAR(100) NOT NULL,

    CONSTRAINT "regionales_pkey" PRIMARY KEY ("nombre")
);

-- CreateTable
CREATE TABLE "tiposproyectos" (
    "tipoProyecto" VARCHAR(256) NOT NULL,

    CONSTRAINT "tiposproyectos_pkey" PRIMARY KEY ("tipoProyecto")
);

-- CreateTable
CREATE TABLE "convenios" (
    "idConvenio" SERIAL NOT NULL,
    "tipo" VARCHAR(256),
    "numero" INTEGER,
    "idVinculacion" INTEGER,

    CONSTRAINT "convenios_pkey" PRIMARY KEY ("idConvenio")
);

-- CreateTable
CREATE TABLE "desembolsos" (
    "idDesembolso" SERIAL NOT NULL,
    "idConFinanciamiento" INTEGER NOT NULL,
    "montoDesembolsado" REAL,
    "montoRendido" REAL,
    "estado" VARCHAR(256),
    "motivoEstado" VARCHAR(256),
    "plazoEtapa" INTEGER,
    "fechaDesembolso" DATE,
    "fechaDeRendicionReal" DATE,
    "fechaAprobado" DATE,
    "fechaRendicion" DATE,

    CONSTRAINT "desembolsos_pkey" PRIMARY KEY ("idDesembolso","idConFinanciamiento")
);

-- CreateTable
CREATE TABLE "lineas" (
    "nombreLinea" VARCHAR(256) NOT NULL,

    CONSTRAINT "lineas_pkey" PRIMARY KEY ("nombreLinea")
);

-- CreateTable
CREATE TABLE "vinculaciones" (
    "idVinculacion" SERIAL NOT NULL,
    "empresaInstitucion" VARCHAR(256),
    "numeroMarco" INTEGER,
    "idProyecto" INTEGER,

    CONSTRAINT "vinculaciones_pkey" PRIMARY KEY ("idVinculacion")
);

-- CreateTable
CREATE TABLE "vinculacionesconfinanciamiento" (
    "idConFinanciamiento" INTEGER NOT NULL,
    "titulo" VARCHAR(256),
    "estado" VARCHAR(256),
    "motivoEstado" VARCHAR(256),
    "monto" REAL,
    "plazoEjecucion" INTEGER,
    "nombreBeneficiario" VARCHAR(256),
    "cantidadDesembolsos" INTEGER,
    "fechaPresentacion" DATE,
    "fechaAdjudicacion" DATE,
    "nombreLinea" VARCHAR(256),

    CONSTRAINT "vinculacionesconfinanciamiento_pkey" PRIMARY KEY ("idConFinanciamiento")
);

-- CreateTable
CREATE TABLE "vinculacionessinfinanciamiento" (
    "idSinFinanciamiento" INTEGER NOT NULL,
    "fechaInicio" DATE,
    "fechaCierre" DATE,
    "descripcion" VARCHAR(256),

    CONSTRAINT "vinculacionessinfinanciamiento_pkey" PRIMARY KEY ("idSinFinanciamiento")
);

-- CreateIndex
CREATE INDEX "idPersona" ON "categorias"("idPersona");

-- CreateIndex
CREATE UNIQUE INDEX "siglas" ON "gruposinvestigacion"("siglas");

-- CreateIndex
CREATE INDEX "participa_idProyecto" ON "participa"("idProyecto");

-- CreateIndex
CREATE UNIQUE INDEX "dni" ON "personas"("dni");

-- CreateIndex
CREATE INDEX "personas_idGrupoInvestigacion" ON "personas"("idGrupoInvestigacion");

-- CreateIndex
CREATE INDEX "proyectos_idCodirector" ON "proyectos"("idCodirector");

-- CreateIndex
CREATE INDEX "proyectos_idDirector" ON "proyectos"("idDirector");

-- CreateIndex
CREATE INDEX "proyectos_fk_proyectos_regionales" ON "proyectos"("regional");

-- CreateIndex
CREATE INDEX "proyectos_tipoProyecto" ON "proyectos"("tipoProyecto");

-- CreateIndex
CREATE INDEX "tiene_idProyecto" ON "tiene"("idProyecto");

-- CreateIndex
CREATE INDEX "convenios_idVinculacion" ON "convenios"("idVinculacion");

-- CreateIndex
CREATE INDEX "desembolsos_idConFinanciamiento" ON "desembolsos"("idConFinanciamiento");

-- CreateIndex
CREATE INDEX "vinculaciones_idProyecto" ON "vinculaciones"("idProyecto");

-- CreateIndex
CREATE INDEX "vinculacionesconfinanciamiento_nombreLinea" ON "vinculacionesconfinanciamiento"("nombreLinea");

-- AddForeignKey
ALTER TABLE "categorias" ADD CONSTRAINT "categorias_ibfk_1" FOREIGN KEY ("idPersona") REFERENCES "personas"("idPersona") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "participa" ADD CONSTRAINT "participa_ibfk_1" FOREIGN KEY ("idPersona") REFERENCES "personas"("idPersona") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "participa" ADD CONSTRAINT "participa_ibfk_2" FOREIGN KEY ("idProyecto") REFERENCES "proyectos"("idProyecto") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "personas" ADD CONSTRAINT "personas_ibfk_1" FOREIGN KEY ("idGrupoInvestigacion") REFERENCES "gruposinvestigacion"("idGrupoInvestigacion") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "proyectos" ADD CONSTRAINT "fk_proyectos_regionales" FOREIGN KEY ("regional") REFERENCES "regionales"("nombre") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "proyectos" ADD CONSTRAINT "proyectos_ibfk_1" FOREIGN KEY ("idDirector") REFERENCES "personas"("idPersona") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "proyectos" ADD CONSTRAINT "proyectos_ibfk_2" FOREIGN KEY ("idCodirector") REFERENCES "personas"("idPersona") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "proyectos" ADD CONSTRAINT "proyectos_ibfk_3" FOREIGN KEY ("tipoProyecto") REFERENCES "tiposproyectos"("tipoProyecto") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "tiene" ADD CONSTRAINT "tiene_ibfk_1" FOREIGN KEY ("idProyecto") REFERENCES "proyectos"("idProyecto") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "tiene" ADD CONSTRAINT "tiene_ibfk_2" FOREIGN KEY ("idGrupoInvestigacion") REFERENCES "gruposinvestigacion"("idGrupoInvestigacion") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "convenios" ADD CONSTRAINT "convenios_ibfk_1" FOREIGN KEY ("idVinculacion") REFERENCES "vinculaciones"("idVinculacion") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "desembolsos" ADD CONSTRAINT "desembolsos_ibfk_1" FOREIGN KEY ("idConFinanciamiento") REFERENCES "vinculacionesconfinanciamiento"("idConFinanciamiento") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "vinculaciones" ADD CONSTRAINT "vinculaciones_ibfk_1" FOREIGN KEY ("idProyecto") REFERENCES "proyectos"("idProyecto") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "vinculacionesconfinanciamiento" ADD CONSTRAINT "vinculacionesconfinanciamiento_ibfk_1" FOREIGN KEY ("idConFinanciamiento") REFERENCES "vinculaciones"("idVinculacion") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "vinculacionesconfinanciamiento" ADD CONSTRAINT "vinculacionesconfinanciamiento_ibfk_2" FOREIGN KEY ("nombreLinea") REFERENCES "lineas"("nombreLinea") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "vinculacionessinfinanciamiento" ADD CONSTRAINT "vinculacionessinfinanciamiento_ibfk_1" FOREIGN KEY ("idSinFinanciamiento") REFERENCES "vinculaciones"("idVinculacion") ON DELETE NO ACTION ON UPDATE NO ACTION;
