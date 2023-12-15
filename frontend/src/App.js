import { Button, ButtonGroup } from '@chakra-ui/react'
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
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
import { useContext } from "react";
import { UserContext } from "./context/UserContext"; // Reemplaza "UserContext" con el nombre de tu contexto de usuario
import { ChakraToastProvider } from './context/ChakraToastContext';
import Proyectos from './pages/proyectos/Proyectos';
import ProyectosExternosF from './pages/proyectos/ProyectosExternosF';
import DetalleProyecto from './pages/proyectos/DetalleProyecto';
import Nuevo from './pages/proyectos/Nuevo';
import Modificar from './pages/proyectos/Modificar';
import AgregarGrupo from './pages/proyectos/AgregarGrupo';
import DetalleVinculacion from './pages/proyectos/DetalleVinculacion';
import DetalleDesembolso from './pages/proyectos/DetalleDesembolso';

const queryClient = new QueryClient();

const routes = [
  // { path: "/", element: <Navigate to="/home" /> },
  { path: "/investigadores", element: <ListaInvestigadores /> },
  { path: "/investigadores/nuevo", element: <NuevoInvestigador /> },
  { path: "/investigadores/:idPersona", element: <DetalleInvestigador /> },
  { path: "/investigadores/:idPersona/modificar", element: <ModificarInvestigador /> },
  { path: "/investigadores/:idPersona/nueva-categoria", element: <NuevaCategoria /> },
  { path: "/grupos-investigacion", element: <ListaGrupos /> },
  { path: "/grupos-investigacion/nuevo", element: <NuevoGrupo/> },
  { path: "/grupos-investigacion/:idGrupoInvestigacion", element: <DetalleGrupo /> },
  { path: "/grupos-investigacion/:idGrupoInvestigacion/modificar", element: <ModificarGrupo /> },
  { path: "/proyectos", element: <Proyectos /> },
  { path: "/proyectos-pid/:idProyecto", element: <DetalleProyecto /> },
  { path: "/proyectos-pid/nuevo", element: <Nuevo /> },
  { path: "/proyectos-pid/:idPid/modificar", element: <Modificar /> },
  { path: "/proyectos-pid/:idPid/agregar-investigador", element: <AgregarInvestigador/>},
  { path: "/proyectos-pid/:idPid/agregar-grupo", element: <AgregarGrupo/>},
  { path: "/vinculaciones/:idVinculacion", element: <DetalleVinculacion/>},
  { path: "/desembolsos/:idDesembolso", element: <DetalleDesembolso/>},
  { path: "/proyectos-externos-financiamiento", element: <ProyectosExternosF /> },

  { path: "*", element: <Navigate to="/home" /> },
];

function App() {
  const { isLoggedIn } = useContext(UserContext); // Reemplaza "UserContext" con el nombre de tu contexto de usuario

  return (
    <ChakraToastProvider>
      <QueryClientProvider client={queryClient}>
        <Router>
          {isLoggedIn ? (
            <SidebarWithHeader>
              <Routes>
                {routes.map((route, index) => (
                  <Route key={index} path={route.path} element={route.element} />
                ))}
              </Routes>
            </SidebarWithHeader>
          ) : (
            <Routes>
              <Route path="/login" element={<LogIn />} />
              <Route path="*" element={<Navigate to="/login" />} />
            </Routes>
          )}
        </Router>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </ChakraToastProvider>
  );
}

export default App;