import { createContext, useContext } from 'react';
import { useToast } from '@chakra-ui/react';

const ChakraToastContext = createContext();

export const ChakraToastProvider = ({ children }) => {
  const toast = useToast();

  return (
    <ChakraToastContext.Provider value={toast}>
      {children}
    </ChakraToastContext.Provider>
  );
};

export const useChakraToast = () => {
  return useContext(ChakraToastContext);
};
