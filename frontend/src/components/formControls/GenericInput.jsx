import React from 'react';
import { FormControl, FormLabel, Input, Text } from '@chakra-ui/react';

const GenericInput = ({
  id,
  name,
  label,
  placeholder,
  register,
  errors = {},
  type = 'text',
  width,
  value,
  isDisabled = false,
  defaultValue,
  isRequired = false,
  onChange = {},
  mb = '5vh'
}) => (
  <FormControl variant='floating' id={id} mb={mb} isRequired={isRequired} width={width}>
    <Input
      name={name}
      placeholder={placeholder}
      type={type}
      {...(register ? register(name) : {})}
      value={value}
      defaultValue={defaultValue}
      isDisabled={isDisabled}
      onChange={onChange}
    />
    <FormLabel>{label}</FormLabel>
    <Text fontSize='sm' color='red'>
      {errors[name]?.message}
    </Text>
  </FormControl>
);

export default GenericInput;
