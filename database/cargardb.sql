USE secCyT;

INSERT INTO `seccyt`.`gruposinvestigacion` (`siglas`, `nombre`, `resolucion`, `fechaCreacion`) VALUES ('ACHETIQ', 'Ejemplo', '12/455', '2023-07-25');
INSERT INTO `seccyt`.`gruposinvestigacion` (`siglas`, `nombre`, `resolucion`, `fechaCreacion`) VALUES ('CINAPTIC', 'Otro ejemplo', '13/785', '2023-02-21');
INSERT INTO `seccyt`.`gruposinvestigacion` (`siglas`, `nombre`, `resolucion`, `fechaCreacion`) VALUES ('GIESIN', 'Otro ejemplo', '13/785', '2023-02-21');
INSERT INTO `seccyt`.`gruposinvestigacion` (`siglas`, `nombre`, `resolucion`, `fechaCreacion`) VALUES ('GISTAQ', 'Otro ejemplo', '13/785', '2023-02-21');

INSERT INTO `seccyt`.`personas` (`dni`, `nombre`, `apellido`, `activo`, `fechaIngreso`, `idGrupoInvestigacion`) VALUES ('40352261', 'Jorge Agustín', 'Rodriguez', '1', '2023-02-21', '1');
INSERT INTO `seccyt`.`personas` (`dni`, `nombre`, `apellido`, `activo`, `fechaIngreso`, `idGrupoInvestigacion`) VALUES ('42563159', 'Sofia', 'Rodriguez', '1', '2023-02-21', '2');
INSERT INTO `seccyt`.`personas` (`dni`, `nombre`, `apellido`, `activo`, `fechaIngreso`, `idGrupoInvestigacion`) VALUES ('43526154', 'Nilson', 'Orrego', '0', '2023-02-21', '1');
INSERT INTO `seccyt`.`personas` (`dni`, `nombre`, `apellido`, `activo`, `fechaIngreso`, `idGrupoInvestigacion`) VALUES ('44562545', 'André Leandro', 'San Lorenzo', '0', '2023-02-21', '2');
INSERT INTO `seccyt`.`personas` (`dni`, `nombre`, `apellido`, `activo`, `fechaIngreso`, `idGrupoInvestigacion`) VALUES ('44646156', 'Sixto Feliciano', 'Arrejin', '1', '2023-02-21', '1');
INSERT INTO `seccyt`.`personas` (`dni`, `nombre`, `apellido`, `activo`, `fechaIngreso`, `idGrupoInvestigacion`) VALUES ('45265148', 'Tobias Alejandro', 'Maciel Meister', '1', '2023-02-21', '1');
INSERT INTO `seccyt`.`personas` (`dni`, `nombre`, `apellido`, `activo`, `fechaIngreso`, `idGrupoInvestigacion`) VALUES ('123456123', 'Rosario', 'Fernandez Gonzales', '1', '2023-02-21', '2');
INSERT INTO `seccyt`.`personas` (`dni`, `nombre`, `apellido`, `activo`, `fechaIngreso`, `idGrupoInvestigacion`) VALUES ('123456789', 'Juan', 'Pérez', '0', '2023-02-21', '2');


INSERT INTO `seccyt`.`categorias` (`tipo`, `categoria`, `fecha`, `normativa`, `idPersona`, `comision`) VALUES ('ministerio', 'III', '2021-05-05', '329/13', '1', 'B43');
INSERT INTO `seccyt`.`categorias` (`equiparacion`, `tipo`, `categoria`, `fecha`, `normativa`, `idPersona`, `comision`) VALUES ('1', 'utn', 'C', '2021-02-04', '568/41', '1', 'JKL');
INSERT INTO `seccyt`.`categorias` (`equiparacion`, `tipo`, `categoria`, `fecha`, `normativa`, `idPersona`, `comision`) VALUES ('0', 'utn', 'D', '2022-05-03', '512/41', '1', 'MNÑ');
INSERT INTO `seccyt`.`categorias` (`tipo`, `categoria`, `fecha`, `normativa`, `idPersona`, `comision`) VALUES ('ministerio', 'IV', '2020-05-24', '321/01', '1', 'GHI');


INSERT INTO `seccyt`.`proyectos` (`tipoActividad`, `fechaInicio`, `fechaFin`, `denominacion`, `completo`, `regional`, `convocatoria`, `estado`, `idDirector`, `idCodirector`) VALUES ('abxc', '2020-03-03', '2021-04-05', 'abc', '0', 'abc', '0', '1', '1', '2');
INSERT INTO `seccyt`.`proyectos` (`tipoActividad`, `fechaInicio`, `fechaFin`, `denominacion`, `completo`, `regional`, `convocatoria`, `estado`, `idDirector`, `idCodirector`) VALUES ('abxc', '2020-03-03', '2021-04-05', 'abc', '0', 'abc', '0', '1', '1', '2');
INSERT INTO `seccyt`.`proyectos` (`tipoActividad`, `fechaInicio`, `fechaFin`, `denominacion`, `completo`, `regional`, `convocatoria`, `estado`, `idDirector`, `idCodirector`) VALUES ('abxc', '2020-03-03', '2021-04-05', 'abc', '0', 'abc', '0', '1', '1', '2');
INSERT INTO `seccyt`.`proyectos` (`tipoActividad`, `fechaInicio`, `fechaFin`, `denominacion`, `completo`, `regional`, `convocatoria`, `estado`, `idDirector`, `idCodirector`) VALUES ('abxc', '2020-03-03', '2021-04-05', 'abc', '0', 'abc', '0', '1', '1', '2');
INSERT INTO `seccyt`.`proyectos` (`tipoActividad`, `fechaInicio`, `fechaFin`, `denominacion`, `completo`, `regional`, `convocatoria`, `estado`, `idDirector`, `idCodirector`) VALUES ('abxc', '2020-03-03', '2021-04-05', 'abc', '0', 'abc', '0', '1', '1', '2');
INSERT INTO `seccyt`.`proyectos` (`tipoActividad`, `fechaInicio`, `fechaFin`, `denominacion`, `completo`, `regional`, `convocatoria`, `estado`, `idDirector`, `idCodirector`) VALUES ('abxc', '2020-03-03', '2021-04-05', 'abc', '0', 'abc', '0', '1', '1', '2');
INSERT INTO `seccyt`.`proyectos` (`tipoActividad`, `fechaInicio`, `fechaFin`, `denominacion`, `completo`, `regional`, `convocatoria`, `estado`, `idDirector`, `idCodirector`) VALUES ('abxc', '2020-03-03', '2021-04-05', 'abc', '0', 'abc', '0', '1', '1', '2');
INSERT INTO `seccyt`.`proyectos` (`tipoActividad`, `fechaInicio`, `fechaFin`, `denominacion`, `completo`, `regional`, `convocatoria`, `estado`, `idDirector`, `idCodirector`) VALUES ('abxc', '2020-03-03', '2021-04-05', 'abc', '0', 'abc', '0', '1', '1', '2');

INSERT INTO seccyt.regionales (nombre) VALUES
	 ('Centro Tecnológico De Desarrollo Regional Los Reyunos'),
	 ('Facultad Regional Avellaneda'),
	 ('Facultad Regional Bahía Blanca'),
	 ('Facultad Regional Buenos Aires'),
	 ('Facultad Regional Chubut'),
	 ('Facultad Regional Concepción del Uruguay'),
	 ('Facultad Regional Concordia'),
	 ('Facultad Regional Córdoba'),
	 ('Facultad Regional Delta'),
	 ('Facultad Regional General Pacheco'),
	 ('Facultad Regional Haedo'),
	 ('Facultad Regional La Plata'),
	 ('Facultad Regional La Rioja'),
	 ('Facultad Regional Mar del Plata'),
	 ('Facultad Regional Mendoza'),
	 ('Facultad Regional Neuquen'),
	 ('Facultad Regional Paraná'),
	 ('Facultad Regional Rafaela'),
	 ('Facultad Regional Reconquista'),
	 ('Facultad Regional Resistencia'),
	 ('Facultad Regional Rosario'),
	 ('Facultad Regional San Francisco'),
	 ('Facultad Regional San Nicolás'),
	 ('Facultad Regional San Rafael'),
	 ('Facultad Regional Santa Cruz'),
	 ('Facultad Regional Santa Fe'),
	 ('Facultad Regional Tierra del Fuego'),
	 ('Facultad Regional Trenque Lauquen'),
	 ('Facultad Regional Tucumán'),
	 ('Facultad Regional Venado Tuerto'),
	 ('Facultad Regional Villa María'),
	 ('Instituto Nacional Superior de Profesorado Técnico'),
	 ('Rectorado');

INSERT INTO seccyt.tiposproyectos (tipoProyecto) VALUES
	 ('Facultad (PID FA) con incorporación en programa de incentivos'),
	 ('Facultad (PID FA) sin incorporación en programa de incentivos'),
	 ('Integrador Asociado (PID IA) con incorporación en programa de incentivos'),
	 ('Integrador Asociado (PID IA) sin incorporación en programa de incentivos'),
	 ('Integrador Principal (PID IP) con incorporación en programa de incentivos'),
	 ('Integrador Principal (PID IP) sin incorporación en programa de incentivos'),
	 ('Inter-Facultad (PID IF) con incorporación en programa de incentivos'),
	 ('Inter-Facultad (PID IF) sin incorporación en programa de incentivos'),
	 ('Inter-Institucional (PID IN) con incorporación en programa de incentivos'),
	 ('Inter-Institucional (PID IN) sin incorporación en programa de incentivos'),
	 ('Otros (PID OT) con incorporación en programa de incentivos'),
	 ('Otros (PID OT) sin incorporación en programa de incentivos'),
	 ('PID equipos consolidados con incentivos'),
	 ('PID equipos consolidados con incentivos tipo A'),
	 ('PID equipos consolidados con incentivos tipo B'),
	 ('PID equipos consolidados sin incentivos'),
	 ('PID equipos en consolidación con incentivos'),
	 ('PID equipos en consolidación con incentivos tipo A'),
	 ('PID equipos en consolidación con incentivos tipo B'),
	 ('PID equipos en consolidación sin incentivos'),
	 ('PID iniciación a investigación primer proyecto tipo A'),
	 ('PID iniciación a investigación primer proyecto tipo B'),
	 ('PID iniciación a investigación promer proyecto'),
	 ('PID tecnología educativa multi-facultad con incentivos'),
	 ('PID tecnología educativa multi-facultad con incentivos tipo B'),
	 ('PID tecnología educativa multi-facultad con inventivos tipo A'),
	 ('PID tecnología educativa multi-facultad sin incentivos'),
	 ('Tutorado con incentivo'),
	 ('Tutorado sin incentivo'),
	 ('UTN (PID UTN) con incorporación en programa de incentivos'),
	 ('UTN (PID UTN) sin incorporación en programa de incentivos');