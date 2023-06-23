import { Button, ButtonGroup } from '@chakra-ui/react'
import SidebarWithHeader from './components/SidebarWithHeader';
import ListaInvestigadores from './pages/ListaInvestigadores';

function App() {
  return (
    <div>
      <SidebarWithHeader>
        <ListaInvestigadores />
      </SidebarWithHeader>
    </div>
  );
}

export default App;
