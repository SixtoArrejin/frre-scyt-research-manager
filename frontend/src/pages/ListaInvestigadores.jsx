import { Card, CardHeader, CardBody, CardFooter, Text, Heading, Box, Button, Checkbox, FormControl } from '@chakra-ui/react'
import { Input } from '@chakra-ui/react'
import { Search2Icon, AddIcon } from '@chakra-ui/icons'
import {
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
} from '@chakra-ui/react'
import InputLabel from '../components/InputLabel'


export default function ListaInvestigadores() {

  return (
    <Card>
      <CardBody>
        <Heading as='h2' size='xl' textAlign='center'>
          INVESTIGADORES
        </Heading>

        <br />

        <Box display="flex" justifyContent="space-around" width='50%'>
          <InputLabel  placeholder='Nombre' id="AyN" width='15vw'/>
          <InputLabel  placeholder='Grupo' id="AyN" width='15vw'/>
          <Button colorScheme='blue' variant='outline'><Search2Icon /></Button>
        </Box>

        <br />

        <Card>
          <CardBody>
            <TableContainer>
              <Table size='sm' variant='striped' colorScheme='blackAlpha'>
                <Thead>
                  <Tr>
                    <Th textAlign='center'><Checkbox border='gray'></Checkbox></Th>
                    <Th textAlign='center'><Text fontSize='md'>Apellido y Nombre</Text></Th>
                    <Th textAlign='center'><Text fontSize='md'>Estado</Text></Th>
                    <Th textAlign='center'><Text fontSize='md'>Grupo</Text></Th>
                    <Th textAlign='center'><Text fontSize='md'>Cat. UTN</Text></Th>
                    <Th textAlign='center'><Text fontSize='md'>Cat. Min.</Text></Th>
                    <Th textAlign='center'><Text fontSize='md'>Ver más</Text></Th>
                  </Tr>
                </Thead>
                <Tbody>
                  <Tr>
                    <Td textAlign='center'><Checkbox border='gray'></Checkbox></Td>
                    <Td textAlign='center'><Text fontSize='md'>Arrejin Sixto</Text></Td>
                    <Td textAlign='center'><Text fontSize='md'>Activo</Text></Td>
                    <Td textAlign='center'><Text fontSize='md'>CINAPTIC</Text></Td>
                    <Td textAlign='center'><Text fontSize='md'>V</Text></Td>
                    <Td textAlign='center'><Text fontSize='md'>IV</Text></Td>
                    <Td textAlign='center'><Button colorScheme='blue' variant='outline'>Detalle</Button></Td>
                  </Tr>
                  <Tr>
                    <Td textAlign='center'><Checkbox border='gray'></Checkbox></Td>
                    <Td textAlign='center'><Text fontSize='md'>Maciel Tobias</Text></Td>
                    <Td textAlign='center'><Text fontSize='md'>Activo</Text></Td>
                    <Td textAlign='center'><Text fontSize='md'>ACHETIQ</Text></Td>
                    <Td textAlign='center'><Text fontSize='md'>III</Text></Td>
                    <Td textAlign='center'><Text fontSize='md'>II</Text></Td>
                    <Td textAlign='center'><Button colorScheme='blue' variant='outline'>Detalle</Button></Td>
                  </Tr>
                  <Tr>
                    <Td textAlign='center'><Checkbox border='gray'></Checkbox></Td>
                    <Td textAlign='center'><Text fontSize='md'>San Lorenzo Andre</Text></Td>
                    <Td textAlign='center'><Text fontSize='md'>Inactivo</Text></Td>
                    <Td textAlign='center'><Text fontSize='md'>CINAPTIC</Text></Td>
                    <Td textAlign='center'><Text fontSize='md'>VI</Text></Td>
                    <Td textAlign='center'><Text fontSize='md'>VI</Text></Td>
                    <Td textAlign='center'><Button colorScheme='blue' variant='outline'>Detalle</Button></Td>
                  </Tr>
                  <Tr>
                    <Td textAlign='center'><Checkbox border='gray'></Checkbox></Td>
                    <Td textAlign='center'><Text fontSize='md'>Orrego Nilson</Text></Td>
                    <Td textAlign='center'><Text fontSize='md'>Activo</Text></Td>
                    <Td textAlign='center'><Text fontSize='md'>ACHETIQ</Text></Td>
                    <Td textAlign='center'><Text fontSize='md'>I</Text></Td>
                    <Td textAlign='center'><Text fontSize='md'>II</Text></Td>
                    <Td textAlign='center'><Button colorScheme='blue' variant='outline'>Detalle</Button></Td>
                  </Tr>
                </Tbody>
              </Table>
            </TableContainer>
          </CardBody>
        </Card >

        <br />

        <Box display="flex" justifyContent="flex-end" width='100%'>
          <Button colorScheme='blue' variant='outline' mr='5'>Nuevo Investigador</Button>
          <Button colorScheme='blue' variant='outline'>Imprimir</Button>
        </Box>

      </CardBody>
    </Card >
  );
}