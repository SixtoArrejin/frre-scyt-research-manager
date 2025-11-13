-- Migration script for adding Propiedad Intelectual (Intellectual Property) feature
-- Generated for PostgreSQL database

-- Create propiedadintelectual table
CREATE TABLE IF NOT EXISTS "propiedadintelectual" (
    "idPI" SERIAL PRIMARY KEY,
    "tipoPI" VARCHAR(100) NOT NULL,
    "numeroExpediente" VARCHAR(256),
    "fechaInicio" DATE,
    "fechaCierre" DATE,
    "descripcion" VARCHAR(1000),
    "idProyecto" INTEGER,
    CONSTRAINT "propiedadintelectual_ibfk_1" 
        FOREIGN KEY ("idProyecto") 
        REFERENCES "proyectos"("idProyecto") 
        ON DELETE NO ACTION 
        ON UPDATE NO ACTION
);

-- Create index on idProyecto
CREATE INDEX IF NOT EXISTS "propiedadintelectual_idProyecto" 
    ON "propiedadintelectual"("idProyecto");

-- Create investigadorespi table (junction table for many-to-many relationship)
CREATE TABLE IF NOT EXISTS "investigadorespi" (
    "idPI" INTEGER NOT NULL,
    "idPersona" INTEGER NOT NULL,
    "porcentajeParticipacion" REAL,
    PRIMARY KEY ("idPI", "idPersona"),
    CONSTRAINT "investigadorespi_ibfk_1" 
        FOREIGN KEY ("idPI") 
        REFERENCES "propiedadintelectual"("idPI") 
        ON DELETE CASCADE 
        ON UPDATE NO ACTION,
    CONSTRAINT "investigadorespi_ibfk_2" 
        FOREIGN KEY ("idPersona") 
        REFERENCES "personas"("idPersona") 
        ON DELETE NO ACTION 
        ON UPDATE NO ACTION
);

-- Create index on idPersona
CREATE INDEX IF NOT EXISTS "investigadorespi_idPersona" 
    ON "investigadorespi"("idPersona");

-- Add comments for documentation
COMMENT ON TABLE "propiedadintelectual" IS 'Tabla para gestionar la propiedad intelectual de los proyectos de investigación';
COMMENT ON TABLE "investigadorespi" IS 'Tabla de relación entre propiedad intelectual e investigadores involucrados';

COMMENT ON COLUMN "propiedadintelectual"."tipoPI" IS 'Tipo de propiedad intelectual: Derecho de Autor, Modelo de Utilidad, Modelo Industrial, Patente, Otros';
COMMENT ON COLUMN "propiedadintelectual"."numeroExpediente" IS 'Número de expediente de la propiedad intelectual';
COMMENT ON COLUMN "propiedadintelectual"."descripcion" IS 'Descripción de la propiedad intelectual';
COMMENT ON COLUMN "investigadorespi"."porcentajeParticipacion" IS 'Porcentaje de participación del investigador en la propiedad intelectual';
