import React from 'react';
import { FormControl, FormLabel, Input, Text, Textarea } from '@chakra-ui/react';

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
    disabled,
    textArea = false,
    ...rest // Resto de las propiedades para FormControl
  } = props;

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
  };

  // Filtra las propiedades undefined
  Object.keys(inputProps).forEach((key) => inputProps[key] === undefined && delete inputProps[key]);

  return (
    <FormControl variant='floating' {...rest}>
      {textArea ? <Textarea style={{ resize: 'none' }} {...inputProps}/> : <Input {...inputProps} />}
      {/* <Input {...inputProps} /> */}
      <FormLabel>{props.label ? props.label : ''}</FormLabel>
      <Text fontSize='sm' color='red'>
        {name ? (props.errors ? (props.errors[name] ? props.errors[name]?.message : '') : '') : ''}
      </Text>
    </FormControl>
  );
}
