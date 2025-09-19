import React from 'react';
import { Card, CardBody, Text, Heading, Box } from '@chakra-ui/react';

/**
 * Layout reutilizable para formularios
 * @param {Object} props
 * @param {string} props.title - Título del formulario
 * @param {string} props.description - Descripción del formulario
 * @param {React.ReactNode} props.children - Contenido del formulario
 * @param {Object} props.cardProps - Props adicionales para la Card principal
 * @param {Object} props.innerCardProps - Props adicionales para la Card interna
 */
const FormLayout = ({
  title,
  description,
  children,
  cardProps = {},
  innerCardProps = {},
}) => {
  return (
    <Card {...cardProps}>
      <CardBody>
        <Box
          display='flex'
          flexDirection='column'
          width='100%'
          alignItems='center'
          justifyContent='center'
        >
          <Heading as='h2' size='xl' textAlign='center'>
            {title}
          </Heading>

          <br />
          <br />

          <Card width='100%' {...innerCardProps}>
            <CardBody>
              {description && (
                <>
                  <Text fontSize='md'>{description}</Text>
                  <br />
                </>
              )}

              {children}
            </CardBody>
          </Card>
        </Box>
      </CardBody>
    </Card>
  );
};

export default FormLayout;
