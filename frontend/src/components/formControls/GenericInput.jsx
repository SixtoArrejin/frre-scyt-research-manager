import React from 'react';
import { FormControl, FormLabel, Input, Text } from '@chakra-ui/react';

const GenericInput = ({
  id,
  name,
  label,
  placeholder,
  register,
  errors,
  type = 'text',
  width,
  value,
  isDisabled = false,
}) => (
  <FormControl variant='floating' id={id} mb='5vh' isRequired width={width}>
    <Input
      name={name}
      placeholder={placeholder}
      type={type}
      {...register(name)}
      value={value}
      isDisabled={isDisabled}
    />
    <FormLabel>{label}</FormLabel>
    <Text fontSize='sm' color='red'>
      {errors[name]?.message}
    </Text>
  </FormControl>
);

export default GenericInput;
