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


const routes = [
  // { path: "/", element: <Navigate to="/home" /> },
  { path: "/investigadores", element: <ListaInvestigadores /> },
  { path: "/detalle-investigador", element: <DetalleInvestigador /> },
  { path: "/nueva-categoria", element: <NuevaCategoria/> },
  { path: "/nuevo-investigador", element: <NuevoInvestigador /> }
];

function App() {
  return (
    <Router>
      <SidebarWithHeader>
        <Routes>
         {routes.map((route, index) => (
            <Route key={index} path={route.path} element={route.element} />
          ))}
        </Routes>
      </SidebarWithHeader>
    </Router>
  );
}

export default App;