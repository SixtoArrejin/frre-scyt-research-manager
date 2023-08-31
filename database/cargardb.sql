USE secCyT;

INSERT INTO `seccyt`.`gruposinvestigacion` (`siglas`, `nombre`, `resolucion`, `fechaCreacion`) VALUES ('ACHETIQ', 'Ejemplo', '12/455', '2023-07-25');
INSERT INTO `seccyt`.`gruposinvestigacion` (`siglas`, `nombre`, `resolucion`, `fechaCreacion`) VALUES ('CINAPTIC', 'Otro ejemplo', '13/785', '2023-02-21');
INSERT INTO `seccyt`.`gruposinvestigacion` (`siglas`, `nombre`, `resolucion`, `fechaCreacion`) VALUES ('GIESIN', 'Otro ejemplo', '13/785', '2023-02-21');
INSERT INTO `seccyt`.`gruposinvestigacion` (`siglas`, `nombre`, `resolucion`, `fechaCreacion`) VALUES ('GISTAQ', 'Otro ejemplo', '13/785', '2023-02-21');

INSERT INTO `seccyt`.`personas` (`dni`, `nombre`, `apellido`, `activo`, `comision`, `fechaIngreso`, `idGrupoInvestigacion`) VALUES ('40352261', 'Jorge Agustín', 'Rodriguez', '1', 'B43', '2023-02-21', '1');
INSERT INTO `seccyt`.`personas` (`dni`, `nombre`, `apellido`, `activo`, `comision`, `fechaIngreso`, `idGrupoInvestigacion`) VALUES ('42563159', 'Sofia', 'Rodriguez', '1', 'JKL', '2023-02-21', '2');
INSERT INTO `seccyt`.`personas` (`dni`, `nombre`, `apellido`, `activo`, `comision`, `fechaIngreso`, `idGrupoInvestigacion`) VALUES ('43526154', 'Nilson', 'Orrego', '0', 'MNÑ', '2023-02-21', '1');
INSERT INTO `seccyt`.`personas` (`dni`, `nombre`, `apellido`, `activo`, `comision`, `fechaIngreso`, `idGrupoInvestigacion`) VALUES ('44562545', 'André Leandro', 'San Lorenzo', '0', 'GHI', '2023-02-21', '2');
INSERT INTO `seccyt`.`personas` (`dni`, `nombre`, `apellido`, `activo`, `comision`, `fechaIngreso`, `idGrupoInvestigacion`) VALUES ('44646156', 'Sixto Feliciano', 'Arrejin', '1', 'ABC', '2023-02-21', '1');
INSERT INTO `seccyt`.`personas` (`dni`, `nombre`, `apellido`, `activo`, `comision`, `fechaIngreso`, `idGrupoInvestigacion`) VALUES ('45265148', 'Tobias Alejandro', 'Maciel Meister', '1', 'DEF', '2023-02-21', '1');
INSERT INTO `seccyt`.`personas` (`dni`, `nombre`, `apellido`, `activo`, `comision`, `fechaIngreso`, `idGrupoInvestigacion`) VALUES ('123456123', 'Rosario', 'Fernandez Gonzales', '1', 'Comisión B', '2023-02-21', '2');
INSERT INTO `seccyt`.`personas` (`dni`, `nombre`, `apellido`, `activo`, `comision`, `fechaIngreso`, `idGrupoInvestigacion`) VALUES ('123456789', 'Juan', 'Pérez', '0', 'Comisión C', '2023-02-21', '2');

INSERT INTO `seccyt`.`categorias` (`tipo`, `categoria`, `fecha`, `normativa`, `idPersona`) VALUES ('ministerio', 'III', '2021-05-05', '329/13', '1');
INSERT INTO `seccyt`.`categorias` (`equiparacion`, `tipo`, `categoria`, `fecha`, `normativa`, `idPersona`) VALUES ('1', 'utn', 'C', '2021-02-04', '568/41', '1');
INSERT INTO `seccyt`.`categorias` (`equiparacion`, `tipo`, `categoria`, `fecha`, `normativa`, `idPersona`) VALUES ('0', 'utn', 'D', '2022-05-03', '512/41', '1');
INSERT INTO `seccyt`.`categorias` (`tipo`, `categoria`, `fecha`, `normativa`, `idPersona`) VALUES ('ministerio', 'IV', '2020-05-24', '321/01', '1');

INSERT INTO `seccyt`.`proyectos` (`tipoActividad`, `fechaInicio`, `fechaFin`, `denominacion`, `completo`, `regional`, `convocatoria`, `estado`, `idDirector`, `idCodirector`) VALUES ('abxc', '2020-03-03', '2021-04-05', 'abc', '0', 'abc', '0', '1', '1', '2');
INSERT INTO `seccyt`.`proyectos` (`tipoActividad`, `fechaInicio`, `fechaFin`, `denominacion`, `completo`, `regional`, `convocatoria`, `estado`, `idDirector`, `idCodirector`) VALUES ('abxc', '2020-03-03', '2021-04-05', 'abc', '0', 'abc', '0', '1', '1', '2');
INSERT INTO `seccyt`.`proyectos` (`tipoActividad`, `fechaInicio`, `fechaFin`, `denominacion`, `completo`, `regional`, `convocatoria`, `estado`, `idDirector`, `idCodirector`) VALUES ('abxc', '2020-03-03', '2021-04-05', 'abc', '0', 'abc', '0', '1', '1', '2');
INSERT INTO `seccyt`.`proyectos` (`tipoActividad`, `fechaInicio`, `fechaFin`, `denominacion`, `completo`, `regional`, `convocatoria`, `estado`, `idDirector`, `idCodirector`) VALUES ('abxc', '2020-03-03', '2021-04-05', 'abc', '0', 'abc', '0', '1', '1', '2');
INSERT INTO `seccyt`.`proyectos` (`tipoActividad`, `fechaInicio`, `fechaFin`, `denominacion`, `completo`, `regional`, `convocatoria`, `estado`, `idDirector`, `idCodirector`) VALUES ('abxc', '2020-03-03', '2021-04-05', 'abc', '0', 'abc', '0', '1', '1', '2');

INSERT INTO `seccyt`.`pids` (`tipoProyecto`, `prorrogado`, `codPid`, `programa`, `disposicion`) VALUES ('abc', '1', 'abc123', 'abc', '120/78');
INSERT INTO `seccyt`.`pids` (`tipoProyecto`, `prorrogado`, `codPid`, `programa`, `disposicion`) VALUES ('abc', '1', 'abc123', 'abc', '120/78');
INSERT INTO `seccyt`.`pids` (`tipoProyecto`, `prorrogado`, `codPid`, `programa`, `disposicion`) VALUES ('abc', '1', 'abc123', 'abc', '120/78');
INSERT INTO `seccyt`.`pids` (`tipoProyecto`, `prorrogado`, `codPid`, `programa`, `disposicion`) VALUES ('abc', '1', 'abc123', 'abc', '120/78');

INSERT INTO `seccyt`.`proyectosexternos` (`empresaInstitucion`, `anioLinea`, `tipoConvenio`) VALUES ('empresa', '2023-01-01', '12as');
INSERT INTO `seccyt`.`proyectosexternos` (`empresaInstitucion`, `anioLinea`, `tipoConvenio`) VALUES ('empresa', '2023-01-01', '12as');
INSERT INTO `seccyt`.`proyectosexternos` (`empresaInstitucion`, `anioLinea`, `tipoConvenio`) VALUES ('empresa', '2023-01-01', '12as');
INSERT INTO `seccyt`.`proyectosexternos` (`empresaInstitucion`, `anioLinea`, `tipoConvenio`) VALUES ('empresa', '2023-01-01', '12as');
