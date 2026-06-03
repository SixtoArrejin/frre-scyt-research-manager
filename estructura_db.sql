--
-- PostgreSQL database dump
--

-- Dumped from database version 17.4
-- Dumped by pg_dump version 17.4

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: postgres
--

-- *not* creating schema, since initdb creates it


ALTER SCHEMA public OWNER TO postgres;

--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: postgres
--

COMMENT ON SCHEMA public IS '';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: categorias; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.categorias (
    "idCategoria" integer NOT NULL,
    equiparacion boolean,
    tipo character varying(50),
    categoria character varying(50),
    fecha date,
    normativa character varying(100),
    "idPersona" integer NOT NULL,
    comision character varying(256)
);


ALTER TABLE public.categorias OWNER TO postgres;

--
-- Name: categorias_idCategoria_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."categorias_idCategoria_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."categorias_idCategoria_seq" OWNER TO postgres;

--
-- Name: categorias_idCategoria_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."categorias_idCategoria_seq" OWNED BY public.categorias."idCategoria";


--
-- Name: convenios; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.convenios (
    "idConvenio" integer NOT NULL,
    tipo character varying(256),
    numero character varying(256),
    "idVinculacion" integer
);


ALTER TABLE public.convenios OWNER TO postgres;

--
-- Name: convenios_idConvenio_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."convenios_idConvenio_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."convenios_idConvenio_seq" OWNER TO postgres;

--
-- Name: convenios_idConvenio_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."convenios_idConvenio_seq" OWNED BY public.convenios."idConvenio";


--
-- Name: desembolsos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.desembolsos (
    "idDesembolso" integer NOT NULL,
    "idConFinanciamiento" integer NOT NULL,
    "montoDesembolsado" real,
    "montoRendido" real,
    estado character varying(256),
    "motivoEstado" character varying(256),
    "plazoEtapa" integer,
    "fechaDesembolso" date,
    "fechaDeRendicionReal" date,
    "fechaAprobado" date,
    "fechaRendicion" date
);


ALTER TABLE public.desembolsos OWNER TO postgres;

--
-- Name: desembolsos_idDesembolso_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."desembolsos_idDesembolso_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."desembolsos_idDesembolso_seq" OWNER TO postgres;

--
-- Name: desembolsos_idDesembolso_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."desembolsos_idDesembolso_seq" OWNED BY public.desembolsos."idDesembolso";


--
-- Name: gruposinvestigacion; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.gruposinvestigacion (
    "idGrupoInvestigacion" integer NOT NULL,
    siglas character varying(50),
    nombre character varying(256),
    resolucion character varying(100),
    "fechaCreacion" date
);


ALTER TABLE public.gruposinvestigacion OWNER TO postgres;

--
-- Name: gruposinvestigacion_idGrupoInvestigacion_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."gruposinvestigacion_idGrupoInvestigacion_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."gruposinvestigacion_idGrupoInvestigacion_seq" OWNER TO postgres;

--
-- Name: gruposinvestigacion_idGrupoInvestigacion_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."gruposinvestigacion_idGrupoInvestigacion_seq" OWNED BY public.gruposinvestigacion."idGrupoInvestigacion";


--
-- Name: institucionesProyectos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."institucionesProyectos" (
    "idProyecto" integer NOT NULL,
    "nombreInstitucion" character varying(256) NOT NULL
);


ALTER TABLE public."institucionesProyectos" OWNER TO postgres;

--
-- Name: investigadorespi; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.investigadorespi (
    "idPI" integer NOT NULL,
    "idPersona" integer NOT NULL,
    "porcentajeParticipacion" double precision
);


ALTER TABLE public.investigadorespi OWNER TO postgres;

--
-- Name: participa; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.participa (
    "idPersona" integer NOT NULL,
    "idProyecto" integer NOT NULL,
    rol character varying(100) NOT NULL,
    "fechaInicio" date
);


ALTER TABLE public.participa OWNER TO postgres;

--
-- Name: personas; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.personas (
    "idPersona" integer NOT NULL,
    dni integer,
    nombre character varying(100),
    apellido character varying(100),
    activo boolean,
    "idGrupoInvestigacion" integer NOT NULL,
    "fechaIngresoGrupo" date,
    "esBecario" boolean DEFAULT false,
    legajo character varying(50),
    "nivelPosgrado" character varying(50),
    "otroPosgrado" character varying(100),
    "tienePosgrado" boolean DEFAULT false
);


ALTER TABLE public.personas OWNER TO postgres;

--
-- Name: personas_idPersona_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."personas_idPersona_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."personas_idPersona_seq" OWNER TO postgres;

--
-- Name: personas_idPersona_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."personas_idPersona_seq" OWNED BY public.personas."idPersona";


--
-- Name: pids; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.pids (
    "idPid" integer NOT NULL,
    "codPid" text NOT NULL,
    "tipoActividad" character varying(256),
    completo boolean,
    estado character varying(256),
    disposicion character varying(256),
    prorrogado boolean,
    "nuevaDisposicion" character varying(256),
    "nuevaFechaFin" date
);


ALTER TABLE public.pids OWNER TO postgres;

--
-- Name: propiedadintelectual; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.propiedadintelectual (
    "idPI" integer NOT NULL,
    "tipoPI" character varying(100) NOT NULL,
    "numeroExpediente" character varying(256),
    "fechaInicio" date,
    "fechaCierre" date,
    descripcion character varying(1000),
    "idProyecto" integer
);


ALTER TABLE public.propiedadintelectual OWNER TO postgres;

--
-- Name: propiedadintelectual_idPI_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."propiedadintelectual_idPI_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."propiedadintelectual_idPI_seq" OWNER TO postgres;

--
-- Name: propiedadintelectual_idPI_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."propiedadintelectual_idPI_seq" OWNED BY public.propiedadintelectual."idPI";


--
-- Name: proyectos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.proyectos (
    "idProyecto" integer NOT NULL,
    "fechaInicio" date,
    "fechaFin" date,
    denominacion character varying(256),
    regional character varying(256),
    convocatoria integer,
    "idDirector" integer,
    "idCodirector" integer,
    "tipoProyecto" character varying(256),
    programa character varying(256)
);


ALTER TABLE public.proyectos OWNER TO postgres;

--
-- Name: proyectosExternos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."proyectosExternos" (
    "idProyectoExterno" integer NOT NULL,
    "empresaInstitucion" character varying(256)
);


ALTER TABLE public."proyectosExternos" OWNER TO postgres;

--
-- Name: proyectos_idProyecto_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."proyectos_idProyecto_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."proyectos_idProyecto_seq" OWNER TO postgres;

--
-- Name: proyectos_idProyecto_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."proyectos_idProyecto_seq" OWNED BY public.proyectos."idProyecto";


--
-- Name: regionales; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.regionales (
    nombre character varying(100) NOT NULL
);


ALTER TABLE public.regionales OWNER TO postgres;

--
-- Name: tiene; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tiene (
    "idGrupoInvestigacion" integer NOT NULL,
    "idProyecto" integer NOT NULL
);


ALTER TABLE public.tiene OWNER TO postgres;

--
-- Name: tiposproyectos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tiposproyectos (
    "tipoProyecto" character varying(256) NOT NULL
);


ALTER TABLE public.tiposproyectos OWNER TO postgres;

--
-- Name: usuarios; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.usuarios (
    usuario character varying(20) NOT NULL,
    contrasena character varying(255),
    rol character varying(20) DEFAULT 'viewer'::character varying NOT NULL,
    activo boolean DEFAULT true NOT NULL,
    "creadoEn" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "creadoPor" character varying(20)
);


ALTER TABLE public.usuarios OWNER TO postgres;

--
-- Name: vinculaciones; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.vinculaciones (
    "idVinculacion" integer NOT NULL,
    "empresaInstitucion" character varying(256),
    "numeroMarco" integer,
    "idProyecto" integer,
    "idResponsable" integer
);


ALTER TABLE public.vinculaciones OWNER TO postgres;

--
-- Name: vinculaciones_idVinculacion_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."vinculaciones_idVinculacion_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."vinculaciones_idVinculacion_seq" OWNER TO postgres;

--
-- Name: vinculaciones_idVinculacion_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."vinculaciones_idVinculacion_seq" OWNED BY public.vinculaciones."idVinculacion";


--
-- Name: vinculacionesconfinanciamiento; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.vinculacionesconfinanciamiento (
    "idConFinanciamiento" integer NOT NULL,
    titulo character varying(256),
    estado character varying(256),
    "motivoEstado" character varying(256),
    monto real,
    "plazoEjecucion" integer,
    "nombreBeneficiario" character varying(256),
    "cantidadDesembolsos" integer,
    "fechaPresentacion" date,
    "fechaAdjudicacion" date
);


ALTER TABLE public.vinculacionesconfinanciamiento OWNER TO postgres;

--
-- Name: vinculacionessinfinanciamiento; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.vinculacionessinfinanciamiento (
    "idSinFinanciamiento" integer NOT NULL,
    "fechaInicio" date,
    "fechaCierre" date,
    descripcion character varying(256)
);


ALTER TABLE public.vinculacionessinfinanciamiento OWNER TO postgres;

--
-- Name: categorias idCategoria; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categorias ALTER COLUMN "idCategoria" SET DEFAULT nextval('public."categorias_idCategoria_seq"'::regclass);


--
-- Name: convenios idConvenio; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.convenios ALTER COLUMN "idConvenio" SET DEFAULT nextval('public."convenios_idConvenio_seq"'::regclass);


--
-- Name: desembolsos idDesembolso; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.desembolsos ALTER COLUMN "idDesembolso" SET DEFAULT nextval('public."desembolsos_idDesembolso_seq"'::regclass);


--
-- Name: gruposinvestigacion idGrupoInvestigacion; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.gruposinvestigacion ALTER COLUMN "idGrupoInvestigacion" SET DEFAULT nextval('public."gruposinvestigacion_idGrupoInvestigacion_seq"'::regclass);


--
-- Name: personas idPersona; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.personas ALTER COLUMN "idPersona" SET DEFAULT nextval('public."personas_idPersona_seq"'::regclass);


--
-- Name: propiedadintelectual idPI; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.propiedadintelectual ALTER COLUMN "idPI" SET DEFAULT nextval('public."propiedadintelectual_idPI_seq"'::regclass);


--
-- Name: proyectos idProyecto; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.proyectos ALTER COLUMN "idProyecto" SET DEFAULT nextval('public."proyectos_idProyecto_seq"'::regclass);


--
-- Name: vinculaciones idVinculacion; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vinculaciones ALTER COLUMN "idVinculacion" SET DEFAULT nextval('public."vinculaciones_idVinculacion_seq"'::regclass);


--
-- Name: categorias categorias_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categorias
    ADD CONSTRAINT categorias_pkey PRIMARY KEY ("idCategoria");


--
-- Name: convenios convenios_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.convenios
    ADD CONSTRAINT convenios_pkey PRIMARY KEY ("idConvenio");


--
-- Name: desembolsos desembolsos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.desembolsos
    ADD CONSTRAINT desembolsos_pkey PRIMARY KEY ("idDesembolso");


--
-- Name: gruposinvestigacion gruposinvestigacion_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.gruposinvestigacion
    ADD CONSTRAINT gruposinvestigacion_pkey PRIMARY KEY ("idGrupoInvestigacion");


--
-- Name: institucionesProyectos institucionesProyectos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."institucionesProyectos"
    ADD CONSTRAINT "institucionesProyectos_pkey" PRIMARY KEY ("idProyecto", "nombreInstitucion");


--
-- Name: investigadorespi investigadorespi_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.investigadorespi
    ADD CONSTRAINT investigadorespi_pkey PRIMARY KEY ("idPI", "idPersona");


--
-- Name: participa participa_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.participa
    ADD CONSTRAINT participa_pkey PRIMARY KEY ("idPersona", "idProyecto");


--
-- Name: personas personas_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.personas
    ADD CONSTRAINT personas_pkey PRIMARY KEY ("idPersona");


--
-- Name: pids pids_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pids
    ADD CONSTRAINT pids_pkey PRIMARY KEY ("idPid");


--
-- Name: propiedadintelectual propiedadintelectual_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.propiedadintelectual
    ADD CONSTRAINT propiedadintelectual_pkey PRIMARY KEY ("idPI");


--
-- Name: proyectosExternos proyectosExternos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."proyectosExternos"
    ADD CONSTRAINT "proyectosExternos_pkey" PRIMARY KEY ("idProyectoExterno");


--
-- Name: proyectos proyectos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.proyectos
    ADD CONSTRAINT proyectos_pkey PRIMARY KEY ("idProyecto");


--
-- Name: regionales regionales_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.regionales
    ADD CONSTRAINT regionales_pkey PRIMARY KEY (nombre);


--
-- Name: tiene tiene_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tiene
    ADD CONSTRAINT tiene_pkey PRIMARY KEY ("idGrupoInvestigacion", "idProyecto");


--
-- Name: tiposproyectos tiposproyectos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tiposproyectos
    ADD CONSTRAINT tiposproyectos_pkey PRIMARY KEY ("tipoProyecto");


--
-- Name: usuarios usuarios_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_pkey PRIMARY KEY (usuario);


--
-- Name: vinculaciones vinculaciones_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vinculaciones
    ADD CONSTRAINT vinculaciones_pkey PRIMARY KEY ("idVinculacion");


--
-- Name: vinculacionesconfinanciamiento vinculacionesconfinanciamiento_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vinculacionesconfinanciamiento
    ADD CONSTRAINT vinculacionesconfinanciamiento_pkey PRIMARY KEY ("idConFinanciamiento");


--
-- Name: vinculacionessinfinanciamiento vinculacionessinfinanciamiento_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vinculacionessinfinanciamiento
    ADD CONSTRAINT vinculacionessinfinanciamiento_pkey PRIMARY KEY ("idSinFinanciamiento");


--
-- Name: convenios_idVinculacion; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "convenios_idVinculacion" ON public.convenios USING btree ("idVinculacion");


--
-- Name: desembolsos_idConFinanciamiento; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "desembolsos_idConFinanciamiento" ON public.desembolsos USING btree ("idConFinanciamiento");


--
-- Name: dni; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX dni ON public.personas USING btree (dni);


--
-- Name: idPersona; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "idPersona" ON public.categorias USING btree ("idPersona");


--
-- Name: investigadorespi_idPersona; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "investigadorespi_idPersona" ON public.investigadorespi USING btree ("idPersona");


--
-- Name: participa_idProyecto; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "participa_idProyecto" ON public.participa USING btree ("idProyecto");


--
-- Name: personas_idGrupoInvestigacion; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "personas_idGrupoInvestigacion" ON public.personas USING btree ("idGrupoInvestigacion");


--
-- Name: pids_codPid_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "pids_codPid_key" ON public.pids USING btree ("codPid");


--
-- Name: pids_idPid_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "pids_idPid_key" ON public.pids USING btree ("idPid");


--
-- Name: propiedadintelectual_idProyecto; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "propiedadintelectual_idProyecto" ON public.propiedadintelectual USING btree ("idProyecto");


--
-- Name: proyectosExternos_idProyectoExterno_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "proyectosExternos_idProyectoExterno_key" ON public."proyectosExternos" USING btree ("idProyectoExterno");


--
-- Name: proyectos_fk_proyectos_regionales; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX proyectos_fk_proyectos_regionales ON public.proyectos USING btree (regional);


--
-- Name: proyectos_idCodirector; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "proyectos_idCodirector" ON public.proyectos USING btree ("idCodirector");


--
-- Name: proyectos_idDirector; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "proyectos_idDirector" ON public.proyectos USING btree ("idDirector");


--
-- Name: proyectos_tipoProyecto; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "proyectos_tipoProyecto" ON public.proyectos USING btree ("tipoProyecto");


--
-- Name: siglas; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX siglas ON public.gruposinvestigacion USING btree (siglas);


--
-- Name: tiene_idProyecto; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "tiene_idProyecto" ON public.tiene USING btree ("idProyecto");


--
-- Name: vinculaciones_idProyecto; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "vinculaciones_idProyecto" ON public.vinculaciones USING btree ("idProyecto");


--
-- Name: vinculaciones_idResponsable; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "vinculaciones_idResponsable" ON public.vinculaciones USING btree ("idResponsable");


--
-- Name: categorias categorias_ibfk_1; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categorias
    ADD CONSTRAINT categorias_ibfk_1 FOREIGN KEY ("idPersona") REFERENCES public.personas("idPersona");


--
-- Name: convenios convenios_ibfk_1; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.convenios
    ADD CONSTRAINT convenios_ibfk_1 FOREIGN KEY ("idVinculacion") REFERENCES public.vinculaciones("idVinculacion");


--
-- Name: desembolsos desembolsos_ibfk_1; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.desembolsos
    ADD CONSTRAINT desembolsos_ibfk_1 FOREIGN KEY ("idConFinanciamiento") REFERENCES public.vinculacionesconfinanciamiento("idConFinanciamiento");


--
-- Name: proyectos fk_proyectos_regionales; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.proyectos
    ADD CONSTRAINT fk_proyectos_regionales FOREIGN KEY (regional) REFERENCES public.regionales(nombre);


--
-- Name: institucionesProyectos institucionesProyectos_idProyecto_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."institucionesProyectos"
    ADD CONSTRAINT "institucionesProyectos_idProyecto_fkey" FOREIGN KEY ("idProyecto") REFERENCES public.proyectos("idProyecto") ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: investigadorespi investigadorespi_ibfk_1; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.investigadorespi
    ADD CONSTRAINT investigadorespi_ibfk_1 FOREIGN KEY ("idPI") REFERENCES public.propiedadintelectual("idPI") ON DELETE CASCADE;


--
-- Name: investigadorespi investigadorespi_ibfk_2; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.investigadorespi
    ADD CONSTRAINT investigadorespi_ibfk_2 FOREIGN KEY ("idPersona") REFERENCES public.personas("idPersona");


--
-- Name: participa participa_ibfk_1; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.participa
    ADD CONSTRAINT participa_ibfk_1 FOREIGN KEY ("idPersona") REFERENCES public.personas("idPersona");


--
-- Name: participa participa_ibfk_2; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.participa
    ADD CONSTRAINT participa_ibfk_2 FOREIGN KEY ("idProyecto") REFERENCES public.proyectos("idProyecto");


--
-- Name: personas personas_ibfk_1; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.personas
    ADD CONSTRAINT personas_ibfk_1 FOREIGN KEY ("idGrupoInvestigacion") REFERENCES public.gruposinvestigacion("idGrupoInvestigacion");


--
-- Name: pids pids_idPid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pids
    ADD CONSTRAINT "pids_idPid_fkey" FOREIGN KEY ("idPid") REFERENCES public.proyectos("idProyecto") ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: propiedadintelectual propiedadintelectual_ibfk_1; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.propiedadintelectual
    ADD CONSTRAINT propiedadintelectual_ibfk_1 FOREIGN KEY ("idProyecto") REFERENCES public.proyectos("idProyecto");


--
-- Name: proyectosExternos proyectosExternos_idProyectoExterno_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."proyectosExternos"
    ADD CONSTRAINT "proyectosExternos_idProyectoExterno_fkey" FOREIGN KEY ("idProyectoExterno") REFERENCES public.proyectos("idProyecto") ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: proyectos proyectos_ibfk_1; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.proyectos
    ADD CONSTRAINT proyectos_ibfk_1 FOREIGN KEY ("idDirector") REFERENCES public.personas("idPersona");


--
-- Name: proyectos proyectos_ibfk_2; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.proyectos
    ADD CONSTRAINT proyectos_ibfk_2 FOREIGN KEY ("idCodirector") REFERENCES public.personas("idPersona");


--
-- Name: proyectos proyectos_ibfk_3; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.proyectos
    ADD CONSTRAINT proyectos_ibfk_3 FOREIGN KEY ("tipoProyecto") REFERENCES public.tiposproyectos("tipoProyecto");


--
-- Name: tiene tiene_ibfk_1; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tiene
    ADD CONSTRAINT tiene_ibfk_1 FOREIGN KEY ("idProyecto") REFERENCES public.proyectos("idProyecto");


--
-- Name: tiene tiene_ibfk_2; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tiene
    ADD CONSTRAINT tiene_ibfk_2 FOREIGN KEY ("idGrupoInvestigacion") REFERENCES public.gruposinvestigacion("idGrupoInvestigacion");


--
-- Name: vinculaciones vinculaciones_ibfk_1; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vinculaciones
    ADD CONSTRAINT vinculaciones_ibfk_1 FOREIGN KEY ("idProyecto") REFERENCES public.proyectos("idProyecto");


--
-- Name: vinculaciones vinculaciones_idResponsable_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vinculaciones
    ADD CONSTRAINT "vinculaciones_idResponsable_fkey" FOREIGN KEY ("idResponsable") REFERENCES public.personas("idPersona");


--
-- Name: vinculacionesconfinanciamiento vinculacionesconfinanciamiento_ibfk_1; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vinculacionesconfinanciamiento
    ADD CONSTRAINT vinculacionesconfinanciamiento_ibfk_1 FOREIGN KEY ("idConFinanciamiento") REFERENCES public.vinculaciones("idVinculacion");


--
-- Name: vinculacionessinfinanciamiento vinculacionessinfinanciamiento_ibfk_1; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vinculacionessinfinanciamiento
    ADD CONSTRAINT vinculacionessinfinanciamiento_ibfk_1 FOREIGN KEY ("idSinFinanciamiento") REFERENCES public.vinculaciones("idVinculacion");


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: postgres
--

REVOKE USAGE ON SCHEMA public FROM PUBLIC;


--
-- PostgreSQL database dump complete
--

