import React from 'react';
import { FormControl, FormLabel, Input, Text } from '@chakra-ui/react';

export default function GenericInput(props) {

  const {
    name,
    placeholder,
    type,
    register,
    value,
    defaultValue,
    isDisabled,
    onChange,
    ...rest // Resto de las propiedades para FormControl
  } = props;

  const inputProps = {
    name,
    placeholder,
    type,
    ...(register ? register(name) : {}),
    value,
    defaultValue,
    isDisabled,
    onChange,
  };

  // Filtra las propiedades undefined
  Object.keys(inputProps).forEach((key) => inputProps[key] === undefined && delete inputProps[key]);

  return (
    <FormControl variant='floating' {...rest}>
      <Input {...inputProps} />
      <FormLabel>{props.label}</FormLabel>
      <Text fontSize='sm' color='red'>
        {props.name ? (props.errors ? (props.errors[props.name] ? props.errors[props.name]?.message : '') : '') : ''}
      </Text>
    </FormControl>
  );
}
