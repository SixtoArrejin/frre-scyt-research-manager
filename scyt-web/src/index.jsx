import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import { UserProvider } from './context/UserContext';

export const theme = extendTheme({
  components: {
    Input: {
      variants: {
        floating: {
          field: {
            '&::placeholder': {
              color: 'gray', // Cambia el color del placeholder a gris
            },
          },
        },
      },
    },
    Form: {
      variants: {
        floating: {
          container: {
            _focusWithin: {
              label: {
                transform: 'scale(0.85) translateY(-24px)',
                fontWeight: 'normal', // Establece el peso de la fuente como normal
              },
            },
            'input:not(:placeholder-shown) + label, .chakra-select__wrapper + label, textarea:not(:placeholder-shown) ~ label':
              {
                transform: 'scale(0.85) translateY(-24px)',
                fontWeight: 'normal', // Establece el peso de la fuente como normal
              },
            label: {
              top: 0,
              left: 0,
              zIndex: 2,
              position: 'absolute',
              backgroundColor: 'white',
              pointerEvents: 'none',
              mx: 3,
              px: 1,
              my: 2,
              transformOrigin: 'left top',
              fontWeight: 'normal', // Establece el peso de la fuente como normal
              color: 'gray',
            },
          },
        },
      },
    },
  },
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ChakraProvider theme={theme}>
    <React.StrictMode>
      <UserProvider>
        <App />
      </UserProvider>
    </React.StrictMode>
  </ChakraProvider>,
);
