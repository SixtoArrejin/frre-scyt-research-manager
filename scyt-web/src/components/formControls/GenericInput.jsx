import { FormControl, FormLabel, Input, Text, Textarea, useColorModeValue } from '@chakra-ui/react';

export default function GenericInput(props) {
  const {
    name,
    placeholder = '',
    type,
    register,
    value,
    defaultValue,
    isDisabled,
    onChange,
    disabled,
    textArea = false,
    textColor,
    ...rest // Resto de las propiedades para FormControl
  } = props;

  // Colores para modo claro/oscuro
  const defaultTextColor = useColorModeValue('gray.800', 'github.text');
  const labelBgColor = useColorModeValue('white', 'github.canvasSubtle');

  const registerProps = register ? (type === 'number' ? register(name, { valueAsNumber: true }) : register(name)) : {};

  const inputProps = {
    name,
    placeholder,
    type,
    ...registerProps,
    value,
    defaultValue,
    isDisabled,
    disabled,
    onChange,
    color: textColor || defaultTextColor,
  };

  // Filtra las propiedades undefined
  Object.keys(inputProps).forEach((key) => inputProps[key] === undefined && delete inputProps[key]);

  return (
    <FormControl variant='floating' {...rest}>
      {textArea ? <Textarea style={{ resize: 'none' }} {...inputProps} sx={{
        _disabled: {
          color: textColor || defaultTextColor,
          opacity: '0.75',
        },
        _placeholder: {
          opacity: 0,
          transition: 'opacity 0.2s',
        },
        _focus: {
          _placeholder: {
            opacity: 1,
          },
        },
      }} /> : <Input sx={{
        _disabled: {
          color: textColor || defaultTextColor,
          opacity: '0.75',
        },
        _placeholder: {
          opacity: 0,
          transition: 'opacity 0.2s',
        },
        _focus: {
          _placeholder: {
            opacity: 1,
          },
        },
      }} {...inputProps} />}
      {/* <Input {...inputProps} /> */}
      <FormLabel bg={labelBgColor}>{props.label ? props.label : ''}</FormLabel>
      <Text fontSize='sm' color='red'>
        {name ? (props.errors ? (props.errors[name] ? props.errors[name]?.message : '') : '') : ''}
      </Text>
    </FormControl>
  );
}
