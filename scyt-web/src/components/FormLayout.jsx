import React from 'react';
import { Card, CardBody, Text, Heading, Box, HStack } from '@chakra-ui/react';
import BackButton from './BackButton';

/**
 * Layout reutilizable para formularios
 * @param {Object} props
 * @param {string} props.title - Título del formulario
 * @param {string} props.description - Descripción del formulario
 * @param {React.ReactNode} props.children - Contenido del formulario
 * @param {Object} props.cardProps - Props adicionales para la Card principal
 * @param {Object} props.innerCardProps - Props adicionales para la Card interna
 * @param {boolean} props.showBackButton - Mostrar botón de retroceder (default: true)
 * @param {string} props.backButtonTo - Ruta específica para el botón de retroceder
 */
const FormLayout = ({
  title,
  description,
  children,
  cardProps = {},
  innerCardProps = {},
  showBackButton = true,
  backButtonTo,
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
          {showBackButton ? (
            <HStack width='100%' justifyContent='space-between' mb={6}>
              <BackButton to={backButtonTo} />
              <Heading as='h2' size='xl' textAlign='center'>
                {title}
              </Heading>
              <Box /> {/* Spacer para centrar el título */}
            </HStack>
          ) : (
            <Heading as='h2' size='xl' textAlign='center'>
              {title}
            </Heading>
          )}

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
