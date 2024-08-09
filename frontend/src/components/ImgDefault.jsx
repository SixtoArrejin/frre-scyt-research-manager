import { Box, Image, Text } from '@chakra-ui/react';

export default function ImgDefault({ src, alt, width, text }) {
  return (
    <Box display='flex' flexDirection='column' width='100%' alignItems='center' justifyContent='center'>
      <Image src={src} alt={alt} width={width} />
      <Text>{text}</Text>
    </Box>
  );
}
