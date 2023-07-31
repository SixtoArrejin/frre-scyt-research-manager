import { Button, ButtonGroup } from '@chakra-ui/react'
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import SidebarWithHeader from './components/SidebarWithHeader';
import DetalleInvestigador from './pages/DetalleInvestigador';
import ListaInvestigadores from './pages/ListaInvestigadores';
import NuevaCategoria from './pages/NuevaCategoria';
import NuevoInvestigador from './pages/NuevoInvestigador';
import ListaGrupos from './pages/ListaGrupos';
import ModificarInvestigador from './pages/ModificarInvestigador';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import LogIn from './pages/LogIn';
import { useContext } from "react";
import { UserContext } from "./context/UserContext"; // Reemplaza "UserContext" con el nombre de tu contexto de usuario

const queryClient = new QueryClient();

const routes = [
  // { path: "/", element: <Navigate to="/home" /> },
  { path: "/login", element: <LogIn /> },
  { path: "/investigadores", element: <ListaInvestigadores /> },
  { path: "/detalle-investigador", element: <DetalleInvestigador /> },
  { path: "/nueva-categoria", element: <NuevaCategoria /> },
  { path: "/nuevo-investigador", element: <NuevoInvestigador /> },
  { path: "/grupos-investigacion", element: <ListaGrupos /> },
  { path: "/modificar-investigador", element: <ModificarInvestigador /> }
];

function App() {
  const { isLoggedIn } = useContext(UserContext); // Reemplaza "UserContext" con el nombre de tu contexto de usuario

  return (
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
  );
}

export default App;