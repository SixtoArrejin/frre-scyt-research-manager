export default function convertToISOString(dateString) {
    const dateObject = new Date(dateString); // Crea un objeto Date a partir de la cadena
    const isoString = dateObject.toISOString(); // Convierte a formato ISO
  
    // Formatea el resultado para que coincida con el formato deseado
    const formattedISOString = isoString.slice(0, 19) + ".000Z";
  
    return formattedISOString;
  }