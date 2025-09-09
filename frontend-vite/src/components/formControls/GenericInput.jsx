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
    textColor,
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
    color: textColor || "black",
  };

  // Filtra las propiedades undefined
  Object.keys(inputProps).forEach((key) => inputProps[key] === undefined && delete inputProps[key]);

  return (
    <FormControl variant='floating' {...rest}>
      {textArea ? <Textarea style={{ resize: 'none' }} {...inputProps} x={{
        _disabled: {
          color: textColor,
          opacity: "0.75"
        }
      }} /> : <Input sx={{
        _disabled: {
          color: textColor,
          opacity: "0.75"
        }
      }} {...inputProps} />}
      {/* <Input {...inputProps} /> */}
      <FormLabel>{props.label ? props.label : ''}</FormLabel>
      <Text fontSize='sm' color='red'>
        {name ? (props.errors ? (props.errors[name] ? props.errors[name]?.message : '') : '') : ''}
      </Text>
    </FormControl>
  );
}
