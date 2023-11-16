CREATE DATABASE secCyT;
USE secCyT;

CREATE TABLE gruposInvestigacion (
    idGrupoInvestigacion INT AUTO_INCREMENT,
    siglas VARCHAR(15) UNIQUE,
    nombre VARCHAR(40),
    resolucion VARCHAR(10),
    fechaCreacion DATE,
    PRIMARY KEY (idGrupoInvestigacion)
);

CREATE TABLE personas (
    idPersona INT AUTO_INCREMENT,
    dni INT UNIQUE,
    nombre VARCHAR(30),
    apellido VARCHAR(30),
    fechaIngreso DATE,
    activo BOOLEAN,
    idGrupoInvestigacion INT NOT NULL,
    PRIMARY KEY (idPersona),
    FOREIGN KEY (idGrupoInvestigacion) REFERENCES gruposInvestigacion(idGrupoInvestigacion)
);

CREATE TABLE categorias (
    idCategoria INT AUTO_INCREMENT,
    equiparacion BOOLEAN,
    tipo VARCHAR(20),
    categoria VARCHAR(10),
    fecha DATE,
    normativa VARCHAR(20),
    idPersona INT NOT NULL,
    comision VARCHAR(50),
    PRIMARY KEY (idCategoria),
    FOREIGN KEY (idPersona) References personas(idPersona)
);

CREATE TABLE proyectos(
    idProyecto INT AUTO_INCREMENT,
    tipoActividad VARCHAR(50),
    fechaInicio DATE,
    fechaFin DATE,
    denominacion VARCHAR(250),
    completo BOOLEAN,
    regional VARCHAR(100),
    convocatoria INT,
    estado VARCHAR(20),
    idDirector INT NOT NULL,
    idCodirector INT,
    PRIMARY KEY (idProyecto),
    FOREIGN KEY (idDirector) REFERENCES personas(idPersona),
    FOREIGN KEY (idCodirector) REFERENCES personas(idPersona)
);

CREATE TABLE pids (
    idProyectoPid INT,
    tipoProyecto VARCHAR(100),
    prorrogado BOOLEAN,
    codPid VARCHAR(20),
    programa VARCHAR(100),
    disposicion VARCHAR(10),
    PRIMARY KEY (idProyectoPid),
    FOREIGN KEY (idProyectoPid) REFERENCES proyectos(idProyecto)
);

CREATE TABLE proyectosExternos(
    idProyectoExterno INT,
    empresaInstitucion VARCHAR(50),
    anioLinea DATE,
    tipoConvenio VARCHAR(50),
    PRIMARY KEY (idProyectoExterno),
    FOREIGN KEY (idProyectoExterno) REFERENCES proyectos(idProyecto)
);

CREATE TABLE proyectosConFinanciamiento(
    idProyectoFinanciamieno INT,
    montoANR FLOAT,
    presentacion DATE,
    canon FLOAT,
    fechaInicioFinanciamiento DATE,
    fechaFinFinanciamiento DATE,
    linea VARCHAR(30),
    adjudicacion INT,
    desembolso INT,
    PRIMARY KEY (idProyectoFinanciamieno),
    FOREIGN KEY (idProyectoFinanciamieno) REFERENCES proyectosExternos(idProyectoExterno)
);

CREATE TABLE participa(
    idPersona INT,
    idProyecto INT,
    rol VARCHAR(50) NOT NULL,
    PRIMARY KEY (idPersona, idProyecto),
    FOREIGN KEY (idPersona) REFERENCES personas(idPersona),
    FOREIGN KEY (idProyecto) REFERENCES proyectos(idProyecto)
);

CREATE TABLE tiene (
    idGrupoInvestigacion INT,
    idProyecto INT,
    PRIMARY KEY (idGrupoInvestigacion, idProyecto),
    FOREIGN KEY (idProyecto) REFERENCES proyectos(idProyecto),
    FOREIGN KEY (idGrupoInvestigacion) REFERENCES gruposInvestigacion(idGrupoInvestigacion)
);

CREATE TABLE usuarios (
    usuario VARCHAR(20),
    contrasena VARCHAR(255),
    PRIMARY KEY (usuario)
);

ALTER TABLE seccyt.participa ADD fechaInicio date NULL;

ALTER TABLE seccyt.pids MODIFY COLUMN tipoProyecto varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL;
ALTER TABLE seccyt.pids MODIFY COLUMN codPid varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL;
ALTER TABLE seccyt.pids MODIFY COLUMN programa varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL;
ALTER TABLE seccyt.pids MODIFY COLUMN disposicion varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL;

ALTER TABLE seccyt.proyectos MODIFY COLUMN tipoActividad varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL;
ALTER TABLE seccyt.proyectos MODIFY COLUMN denominacion varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL;
ALTER TABLE seccyt.proyectos MODIFY COLUMN regional varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL;
ALTER TABLE seccyt.proyectos MODIFY COLUMN estado varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL;

CREATE TABLE regionales (
    nombre VARCHAR(100),
    PRIMARY KEY (nombre)
);

CREATE TABLE tiposProyectos (
    tipoProyecto VARCHAR(256),
    PRIMARY KEY (tipoProyecto)
);


ALTER TABLE proyectos
ADD CONSTRAINT fk_proyectos_regionales
FOREIGN KEY (regional)
REFERENCES regionales(nombre);

ALTER TABLE pids
ADD CONSTRAINT fk_pids_tiposproyectos
FOREIGN KEY (tipoProyecto)
REFERENCES tiposProyectos(tipoProyecto);

ALTER TABLE proyectos
ADD COLUMN tipoProyecto VARCHAR(256),
ADD FOREIGN KEY (tipoProyecto) REFERENCES tiposProyectos(tipoProyecto);

ALTER TABLE proyectos
ADD COLUMN codPid varchar(256),
ADD COLUMN programa varchar(256),
ADD COLUMN disposicion varchar(256),
ADD COLUMN prorrogado BOOLEAN

DROP TABLE `seccyt`.`pids`;

CREATE TABLE vinculaciones(
    idVinculacion INT AUTO_INCREMENT,
    empresaInstitucion VARCHAR(256),
    numeroMarco INT,
    idProyecto INT,
    PRIMARY KEY (idVinculacion),
    FOREIGN KEY (idProyecto) REFERENCES proyectos(idProyecto)
);

CREATE TABLE convenios(
    idConvenio INT AUTO_INCREMENT,
    tipo VARCHAR(256),
    numero INT,
    idVinculacion INT,
    PRIMARY KEY (idConvenio),
    FOREIGN KEY (idVinculacion) REFERENCES vinculaciones(idVinculacion)
);

CREATE TABLE vinculacionesSinFinanciamiento(
    idSinFinanciamiento INT,
    fechaInicio date,
	fechaCierre date,
    descripcion VARCHAR(256),
    PRIMARY KEY (idSinFinanciamiento),
    FOREIGN KEY (idSinFinanciamiento) REFERENCES vinculaciones(idVinculacion)
);

CREATE TABLE lineas(
	nombreLinea VARCHAR(256),
    PRIMARY KEY (nombreLinea)
);

CREATE TABLE vinculacionesConFinanciamiento(
    idConFinanciamiento INT,
    titulo VARCHAR(256),
    estado VARCHAR(256),
    motivoEstado VARCHAR(256),
    monto float,
    plazoEjecucion INT,
    nombreBeneficiario VARCHAR(256),
    cantidadDesembolsos INT,
    fechaPresentacion date,
    fechaAdjudicacion date,
    nombreLinea VARCHAR(256),
    PRIMARY KEY (idConFinanciamiento),
    FOREIGN KEY (idConFinanciamiento) REFERENCES vinculaciones(idVinculacion),
    FOREIGN KEY (nombreLinea) REFERENCES lineas(nombreLinea)
);

CREATE TABLE desembolsos(
    idDesembolso INT AUTO_INCREMENT,
    idConFinanciamiento INT,
    montoDesembolsado float,
    montoRendido float,
    estado VARCHAR(256),
    motivoEstado VARCHAR(256),
    plazoEtapa INT,
    fechaDesembolso date,
    fechaDeRendicionReal date,
    fechaAprobado date,
    fechaRendicion date,
    PRIMARY KEY (idDesembolso, idConFinanciamiento),
    FOREIGN KEY (idConFinanciamiento) REFERENCES vinculacionesConFinanciamiento(idConFinanciamiento)
);

DELIMITER //
CREATE TRIGGER calcularFechaRendicion 
BEFORE INSERT ON desembolsos
FOR EACH ROW
BEGIN
    SET NEW.fechaRendicion = NEW.fechaDesembolso + INTERVAL NEW.plazoEtapa MONTH;
END;
//

CREATE TRIGGER actualizarFechaRendicion 
BEFORE UPDATE ON desembolsos
FOR EACH ROW
BEGIN
    SET NEW.fechaRendicion = NEW.fechaDesembolso + INTERVAL NEW.plazoEtapa MONTH;
END;
//
DELIMITER ;

DROP TABLE `seccyt`.`proyectosconfinanciamiento`;
DROP TABLE `seccyt`.`proyectosexternos`;
