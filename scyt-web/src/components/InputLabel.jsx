import {
  ChakraProvider,
  FormControl,
  FormLabel,
  Input,
  extendTheme,
  Box,
} from '@chakra-ui/react';
const activeLabelStyles = {
  transform: 'scale(0.85) translateY(-24px)',
};
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
            'input:not(:placeholder-shown) + label, .chakra-select__wrapper + label, textarea:not(:placeholder-shown) ~ label': {
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
            },
          },
        },
      },
    },
  },
});


export default function InputLabel(props) {
  return (
    <ChakraProvider theme={theme}>
      <Box>
        <FormControl variant="floating" {...props}>
          <Input placeholder=" " value={props.value} onChange={props.onChange} type={props.type}/>
          {/* It is important that the Label comes after the Control due to css selectors */}
          <FormLabel style={{ color: 'gray' }}>{props.placeholder}</FormLabel>
          {/* <FormHelperText>Keep it very short and sweet!</FormHelperText>
          <FormErrorMessage>Your First name is invalid</FormErrorMessage> */}
        </FormControl>
      </Box>
    </ChakraProvider>
  );
}
