import React from 'react';
import { FormLabel, RadioGroup, Stack, Radio, Text } from '@chakra-ui/react';

export default function GenericRadio(props) {
  const {
    name,
    label,
    register,
    options = [],
    defaultValue,
    isDisabled,
    errors,
    direction = 'row', // 'row' para horizontal, 'column' para vertical
    ...rest
  } = props;

  return (
    <div {...rest}>
      {label && <FormLabel>{label}</FormLabel>}
      <RadioGroup defaultValue={defaultValue}>
        <Stack direction={direction}>
          {options.map((option, index) => (
            <Radio key={index} value={option.value} isDisabled={isDisabled} {...register(name)}>
              {option.label}
            </Radio>
          ))}
        </Stack>
      </RadioGroup>
      <Text fontSize='sm' color='red'>
        {name ? (props.errors ? (props.errors[name] ? props.errors[name]?.message : '') : '') : ''}
      </Text>
    </div>
  );
}
