import { Button, ButtonGroup } from '@chakra-ui/react'
import SidebarWithHeader from './components/SidebarWithHeader';
import DetalleInvestigador from './pages/DetalleInvestigador';

function App() {
  return (
    <div>
      <SidebarWithHeader>
        <DetalleInvestigador />
      </SidebarWithHeader>
    </div>
  );
}

export default App;
