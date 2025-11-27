import {
  HashRouter,
  Route,
  Routes,
  Navigate,
} from 'react-router-dom';
import SidebarWithHeader from './components/SidebarWithHeader';
import DetalleInvestigador from './pages/investigadores/DetalleInvestigador';
import ListaInvestigadores from './pages/investigadores/ListaInvestigadores';
import NuevaCategoria from './pages/investigadores/NuevaCategoria';
import NuevoInvestigador from './pages/investigadores/NuevoInvestigador';
import ListaGrupos from './pages/grupos/ListaGrupos';
import DetalleGrupo from './pages/grupos/DetalleGrupo';
import ModificarInvestigador from './pages/investigadores/ModificarInvestigador';
import ModificarGrupo from './pages/grupos/ModificarGrupo';
import NuevoGrupo from './pages/grupos/NuevoGrupo';
import AgregarInvestigador from './pages/proyectos/AgregarInvestigador';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import LogIn from './pages/LogIn';
import { useContext } from 'react';
import { UserContext } from './context/UserContext'; // Reemplaza "UserContext" con el nombre de tu contexto de usuario
import { ChakraToastProvider } from './context/ChakraToastContext';
import Proyectos from './pages/proyectos/Proyectos';
import DetalleProyecto from './pages/proyectos/DetalleProyecto';
import Nuevo from './pages/proyectos/Nuevo';
import Modificar from './pages/proyectos/Modificar';
import AgregarGrupo from './pages/proyectos/AgregarGrupo';
import DetalleVinculacion from './pages/vinculaciones/DetalleVinculacion';
import NuevaVinculacion from './pages/vinculaciones/Nueva';
import useThemeInitializer from './hooks/useThemeInitializer';
import NuevoDesembolso from './pages/desembolsos/Nuevo';
import ListaVinculaciones from './pages/vinculaciones/ListaVinculaciones';
import DetalleDesembolso from './pages/desembolsos/DetalleDesembolso';
import Home from './pages/Home';
import AgregarInvestigador2 from './pages/proyectos/AgregarInvestigador2';
// import AgregarRegional from './pages/proyectos/AgregarRegional'; // DESHABILITADO - reutilizar para AgregarInstituciones
import ModificarDesembolso from './pages/desembolsos/ModificarDesembolso';
import ModificarVinculacion from './pages/vinculaciones/ModificarVinculacion';
import DetallePropiedadIntelectual from './pages/propiedadIntelectual/DetallePropiedadIntelectual';
import NuevaPropiedadIntelectual from './pages/propiedadIntelectual/Nueva';
import ListaPropiedadIntelectual from './pages/propiedadIntelectual/ListaPropiedadIntelectual';
import ModificarPropiedadIntelectual from './pages/propiedadIntelectual/ModificarPropiedadIntelectual';
import Perfil from './pages/perfil/Perfil';
import ListaUsuarios from './pages/usuarios/ListaUsuarios';
import NuevoUsuario from './pages/usuarios/NuevoUsuario';
import ModificarUsuario from './pages/usuarios/ModificarUsuario';

const queryClient = new QueryClient();

const routes = [
  // { path: "/", element: <Navigate to="/home" /> },
  { path: '/investigadores', element: <ListaInvestigadores /> },
  { path: '/investigadores/nuevo', element: <NuevoInvestigador /> },
  { path: '/investigadores/:idPersona', element: <DetalleInvestigador /> },
  {
    path: '/investigadores/:idPersona/modificar',
    element: <ModificarInvestigador />,
  },
  {
    path: '/investigadores/:idPersona/nueva-categoria',
    element: <NuevaCategoria />,
  },
  { path: '/grupos-investigacion', element: <ListaGrupos /> },
  { path: '/grupos-investigacion/nuevo', element: <NuevoGrupo /> },
  {
    path: '/grupos-investigacion/:idGrupoInvestigacion',
    element: <DetalleGrupo />,
  },
  {
    path: '/grupos-investigacion/:idGrupoInvestigacion/modificar',
    element: <ModificarGrupo />,
  },
  { path: '/proyectos', element: <Proyectos /> },
  {
    path: '/proyectos/:idPid/vinculacion/:idVinculacion',
    element: <DetalleVinculacion />,
  },
  {
    path: '/proyectos/:idPid/vinculacion/:idVinculacion/modificar',
    element: <ModificarVinculacion />,
  },
  {
    path: '/proyectos/:idPid/vinculacion/:idVinculacion/desembolso/:idDesembolso',
    element: <DetalleDesembolso />,
  },
  {
    path: '/proyectos/:idPid/vinculacion/:idVinculacion/nuevo-desembolso',
    element: <NuevoDesembolso />,
  },
  { path: '/proyectos/:idProyecto', element: <DetalleProyecto /> },
  { path: '/proyectos/nuevo', element: <Nuevo /> },
  { path: '/proyectos/:idPid/modificar', element: <Modificar /> },
  {
    path: '/proyectos/:idPid/agregar-investigador-old',
    element: <AgregarInvestigador />,
  },
  {
    path: '/proyectos/:idPid/agregar-investigador',
    element: <AgregarInvestigador2 />,
  },
  { path: '/proyectos/:idPid/agregar-grupo', element: <AgregarGrupo /> },
  // { path: '/proyectos/:idPid/agregar-regional', element: <AgregarRegional /> }, // DESHABILITADO - usar para AgregarInstituciones
  {
    path: '/proyectos/:idPid/nueva-vinculacion',
    element: <NuevaVinculacion />,
  },
  { path: '/proyectos/:idPid/nuevo-desembolso', element: <NuevoDesembolso /> },
  { path: '/vinculaciones', element: <ListaVinculaciones /> },
  { path: '/vinculaciones/nueva', element: <NuevaVinculacion /> },
  {
    path: '/vinculaciones/:idVinculacion/nuevo-desembolso',
    element: <NuevoDesembolso />,
  },
  {
    path: '/vinculaciones/:idVinculacion/desembolso/:idDesembolso',
    element: <DetalleDesembolso />,
  },
  {
    path: '/vinculaciones/:idVinculacion/desembolso/:idDesembolso/modificar',
    element: <ModificarDesembolso />,
  },
  {
    path: '/vinculaciones/:idVinculacion/modificar',
    element: <ModificarVinculacion />,
  },
  { path: '/vinculaciones/:idVinculacion', element: <DetalleVinculacion /> },
  { path: '/propiedadIntelectual', element: <ListaPropiedadIntelectual /> },
  { path: '/propiedadIntelectual/nueva', element: <NuevaPropiedadIntelectual /> },
  {
    path: '/propiedadIntelectual/:idPI',
    element: <DetallePropiedadIntelectual />,
  },
  {
    path: '/propiedadIntelectual/:idPI/modificar',
    element: <ModificarPropiedadIntelectual />,
  },
  {
    path: '/proyectos/:idPid/nueva-propiedad-intelectual',
    element: <NuevaPropiedadIntelectual />,
  },
  {
    path: '/proyectos/:idPid/propiedad-intelectual/:idPI',
    element: <DetallePropiedadIntelectual />,
  },
  {
    path: '/proyectos/:idPid/propiedad-intelectual/:idPI/modificar',
    element: <ModificarPropiedadIntelectual />,
  },
  {
    path: '/proyectos/:idPid/vinculacion/:idVinculacion/desembolso/:idDesembolso/modificar',
    element: <ModificarDesembolso />,
  },
  {
    path: '/perfil',
    element: <Perfil />,
  },
  { path: '/usuarios', element: <ListaUsuarios /> },
  { path: '/usuarios/nuevo', element: <NuevoUsuario /> },
  { path: '/usuarios/:usuario/modificar', element: <ModificarUsuario /> },
  { path: '/', element: <Home /> },
];

function App() {
  const { isLoggedIn } = useContext(UserContext); // Reemplaza "UserContext" con el nombre de tu contexto de usuario

  // Inicializar el tema basándose en la preferencia guardada
  useThemeInitializer();

  return (
    <ChakraToastProvider>
      <QueryClientProvider client={queryClient}>
        {/* <Router> */}
        <HashRouter>
          {isLoggedIn ? (
            <SidebarWithHeader>
              <Routes>
                {routes.map((route, index) => (
                  <Route
                    key={index}
                    path={route.path}
                    element={route.element}
                  />
                ))}
              </Routes>
            </SidebarWithHeader>
          ) : (
            <Routes>
              <Route path="/login" element={<LogIn />} />
              <Route path="*" element={<Navigate to="/login" />} />
            </Routes>
          )}
        </HashRouter>
        {/* </Router> */}
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </ChakraToastProvider>
  );
}

export default App;
