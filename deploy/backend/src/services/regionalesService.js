
import {
    getAllRegionales,
  } from '../repository/regionalesRepository.js';
  
  export async function getAllRegionalesService() {
    try {
      const regionales = await getAllRegionales();
      return regionales;
    } catch (error) {
      throw new Error(error.message);
    }
  }
  