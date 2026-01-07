/**
 * Approximates an RGB color from a Kelvin temperature.
 * Based on Tanner Helland's algorithm.
 */
export const kelvinToRgb = (kelvin: number): { r: number; g: number; b: number } => {
  const temp = kelvin / 100;
  let r, g, b;

  if (temp <= 66) {
    r = 255;
    g = temp;
    g = 99.4708025861 * Math.log(g) - 161.1195681661;
    
    if (temp <= 19) {
      b = 0;
    } else {
      b = temp - 10;
      b = 138.5177312231 * Math.log(b) - 305.0447927307;
    }
  } else {
    r = temp - 60;
    r = 329.698727446 * Math.pow(r, -0.1332047592);
    
    g = temp - 60;
    g = 288.1221695283 * Math.pow(g, -0.0755148492);
    
    b = 255;
  }

  return {
    r: clamp(r, 0, 255),
    g: clamp(g, 0, 255),
    b: clamp(b, 0, 255)
  };
};

const clamp = (val: number, min: number, max: number) => {
  return Math.min(Math.max(val, min), max);
};

export const getRgbString = (kelvin: number, opacity: number = 1): string => {
  const { r, g, b } = kelvinToRgb(kelvin);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

/**
 * Calculates the visual tint applied to an image based on White Balance.
 * 
 * Logic:
 * If WB is Low (3200K), the camera adds Blue to compensate.
 * If WB is High (6500K), the camera adds Orange to compensate.
 */
export const getWbFilterColor = (wbKelvin: number): string => {
  // We want to simulate the filter the camera applies.
  // 3200K WB -> Adds Blue.
  // 5600K WB -> Neutral.
  // 8000K WB -> Adds Orange/Red.
  
  // We can achieve this by inverting the Kelvin scale relative to a mid-point.
  
  let simulatedColorTemp: number;
  
  if (wbKelvin < 5600) {
      // User sets Low Kelvin (Expects Warm). Camera adds Blue.
      // The lower the WB, the Bluer the filter.
      // Map 2000 -> 20000
      // Map 5600 -> 6500 (Neutralish)
      const factor = (5600 - wbKelvin) / (5600 - 2000); // 0 to 1
      simulatedColorTemp = 6500 + (factor * 20000); 
  } else {
      // User sets High Kelvin (Expects Cool). Camera adds Orange.
      // The higher the WB, the Warmer the filter.
      // Map 5600 -> 6500
      // Map 10000 -> 2000
      const factor = (wbKelvin - 5600) / (10000 - 5600); // 0 to 1
      simulatedColorTemp = 6500 - (factor * 4500);
  }
  
  return getRgbString(simulatedColorTemp, 0.6); // 0.6 opacity for the filter strength
};

/**
 * Calculates the combined appearance of a light source on a subject, 
 * viewed through a specific White Balance.
 * 
 * @param lightK - The light source temperature
 * @param wbK - The camera white balance setting
 * @param opacity - The opacity of the returning color (default 1.0 for solid objects)
 */
export const getSubjectRelativeColor = (lightK: number, wbK: number, opacity: number = 1.0): string => {
    // Delta = Light - WB
    // If Light < WB -> Orange result.
    // If Light > WB -> Blue result.
    
    // Let's calculate a "Virtual Kelvin" that represents the resulting color cast.
    // 5600 is our neutral anchor for the display.
    // ResultK = 5600 + (LightK - WBK)
    
    const virtualKelvin = 5600 + (lightK - wbK);
    return getRgbString(virtualKelvin, opacity); 
};