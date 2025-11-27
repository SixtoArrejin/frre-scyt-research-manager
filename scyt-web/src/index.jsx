import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ChakraProvider, ColorModeScript } from '@chakra-ui/react';
import { UserProvider } from './context/UserContext';
import theme from './config/theme';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <>
    <ColorModeScript initialColorMode={theme.config.initialColorMode} />
    <ChakraProvider theme={theme}>
      <React.StrictMode>
        <UserProvider>
          <App />
        </UserProvider>
      </React.StrictMode>
    </ChakraProvider>
  </>,
);
