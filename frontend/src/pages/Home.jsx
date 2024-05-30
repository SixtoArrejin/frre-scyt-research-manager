import React, { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Text,
  Heading,
  Box,
  Button,
  Checkbox,
  IconButton,
  useToast,
  Select,
  Textarea,
} from "@chakra-ui/react";
import { Input, HStack, Flex, Spacer, Stack } from "@chakra-ui/react";
import {
  Search2Icon,
  AddIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  ChevronLeftIcon,
  DeleteIcon,
  PlusSquareIcon,
} from "@chakra-ui/icons";
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
  FormControl,
  FormLabel,
} from "@chakra-ui/react";

export default function Home() {
  return (
    <Box margin="10px" display="flex" justifyContent="center" marginTop="3rem">
      <Stack
        direction={{ base: "column", md: "row" }}
        wrap="wrap"
        spacing="30px"
        justify="center"
        align="center"
        w="100%"
      >
        <Card key={1} w="300px" minHeight="100px">
          <CardBody>
            <Flex justifyContent="center" alignItems="baseline">
              <Text fontSize="6xl">69</Text>
              <Text fontSize="6xl">/</Text>
              <Text fontSize="3xl">75</Text>
            </Flex>
          </CardBody>
          <CardFooter
            marginTop="-10%"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <Heading size="xs" textTransform="uppercase" textAlign="center">
              Investigadores Activos
            </Heading>
          </CardFooter>
        </Card>
        <Card key={1} w="300px" minHeight="100px">
          <CardBody>
            <Flex justifyContent="center" alignItems="baseline">
              <Text fontSize="6xl">22</Text>
              <Text fontSize="6xl">/</Text>
              <Text fontSize="3xl">24</Text>
            </Flex>
          </CardBody>
          <CardFooter
            marginTop="-10%"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <Heading size="xs" textTransform="uppercase" textAlign="center">
               Proyectos Activos
            </Heading>
          </CardFooter>
        </Card>
        <Card key={1} w="300px" minHeight="100px">
          <CardBody>
            <Flex justifyContent="center" alignItems="baseline">
              <Text fontSize="6xl">15</Text>
              <Text fontSize="6xl">/</Text>
              <Text fontSize="3xl">24</Text>
            </Flex>
          </CardBody>
          <CardFooter
            marginTop="-10%"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <Heading size="xs" textTransform="uppercase" textAlign="center">
              Vinculaciones Externas
            </Heading>
          </CardFooter>
        </Card>
        <Card key={1} w="300px" minHeight="100px">
          <CardBody>
            <Flex justifyContent="center" alignItems="baseline">
              <Text fontSize="6xl">6</Text>
            </Flex>
          </CardBody>
          <CardFooter
            marginTop="-10%"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <Heading size="xs" textTransform="uppercase" textAlign="center">
              Grupos de investigacion
            </Heading>
          </CardFooter>
        </Card>
      </Stack>
    </Box>
  );
}
