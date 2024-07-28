import React from 'react';
import { FormControl, FormLabel, Select, Text } from '@chakra-ui/react';

export default function GenericSelect(props) {
  const {
    name,
    type,
    placeholder,
    register,
    value,
    defaultValue,
    isDisabled,
    onChange,
    options = [],
    ...rest // Resto de las propiedades para FormControl
  } = props;

  const registerProps = register ? (type === 'number' ? register(name, { valueAsNumber: true }) : register(name)) : {};

  const selectProps = {
    name,
    placeholder,
    ...registerProps,
    value,
    defaultValue,
    isDisabled,
    onChange,
  };

  // Filtra las propiedades undefined
  Object.keys(selectProps).forEach((key) => selectProps[key] === undefined && delete selectProps[key]);

  return (
    <FormControl variant='floating' {...rest}>
      <Select {...selectProps}>
        {options.map((option, index) => (
          <option key={index} value={option.value}>
            {option.label}
          </option>
        ))}
      </Select>
      <FormLabel>{props.label}</FormLabel>
      <Text fontSize='sm' color='red'>
        {name ? (props.errors ? (props.errors[name] ? props.errors[name]?.message : '') : '') : ''}
      </Text>
    </FormControl>
  );
}
