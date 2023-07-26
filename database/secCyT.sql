CREATE DATABASE secCyT;
USE secCyT;

CREATE TABLE grupoInvestigacion (
    siglas VARCHAR(15),
    nombre VARCHAR(40),
    resolucion VARCHAR(10),
    fechaCreacion DATE,
    PRIMARY KEY (siglas)
);

CREATE TABLE persona (
    dni INT,
    nombre VARCHAR(30),
    apellido VARCHAR(30),
    activo BOOLEAN,
    comision VARCHAR(50),
    siglas VARCHAR (15) NOT NULL,
    PRIMARY KEY (dni),
    FOREIGN KEY (siglas) REFERENCES grupoInvestigacion(siglas)
);

CREATE TABLE categorias (
    idCategoria INT,
    equiparacion BOOLEAN,
    tipo VARCHAR(20),
    categoria VARCHAR(10),
    fecha DATE,
    normativa VARCHAR(20),
    dni INT NOT NULL,
    PRIMARY KEY (idCategoria),
    FOREIGN KEY (dni) References persona(dni)
);

CREATE TABLE proyectos(
    idProyecto INT,
    tipoActividad VARCHAR(50),
    fechaInicio DATE,
    fechaFin DATE,
    denominacion VARCHAR(250),
    completo BOOLEAN,
    regional VARCHAR(100),
    convocatoria INT,
    estado VARCHAR(20),
    dniDirector INT NOT NULL,
    dniCodirector INT,
    PRIMARY KEY (idProyecto),
    FOREIGN KEY (dniDirector) REFERENCES persona(dni),
    FOREIGN KEY (dniCodirector) REFERENCES persona(dni)
);

CREATE TABLE pid (
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
    dni INT,
    idProyecto INT,
    rol VARCHAR(50) NOT NULL,
    PRIMARY KEY (dni, idProyecto),
    FOREIGN KEY (dni) REFERENCES persona(dni),
    FOREIGN KEY (idProyecto) REFERENCES proyectos(idProyecto)
);

CREATE TABLE tiene (
    siglas VARCHAR(15),
    idProyecto INT,
    PRIMARY KEY (siglas, idProyecto),
    FOREIGN KEY (idProyecto) REFERENCES proyectos(idProyecto),
    FOREIGN KEY (siglas) REFERENCES grupoInvestigacion(siglas)
);