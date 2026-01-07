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

const lerp = (start: number, end: number, t: number) => start * (1 - t) + end * t;

/**
 * Calculates the visual tint applied to an image based on White Balance.
 * Uses manual color interpolation to achieve vivid, artistically correct camera filter simulations.
 */
export const getWbFilterColor = (wbKelvin: number): string => {
  let r, g, b, opacity;
  
  if (wbKelvin < 5600) {
      // User sets Low Kelvin (Expects Warm). Camera adds Blue.
      // We interpolate from Neutral Grey (at 5600) to Vivid Deep Blue (at 2000).
      // Normalized factor 0 (at 5600) to 1 (at 2000)
      const t = (5600 - wbKelvin) / (5600 - 2000); 
      
      // Target Color at 2000K: R=0, G=80, B=255 (Deep Azure Blue)
      // Neutral at 5600K: R=128, G=128, B=128 (Invisible in Overlay mode)
      
      r = lerp(128, 0, t);
      g = lerp(128, 80, t);
      b = lerp(128, 255, t);
      
      // Opacity ramps up as we move away from neutral
      // High opacity (0.9) ensures the color is punchy
      opacity = lerp(0, 0.9, t); 

  } else {
      // User sets High Kelvin (Expects Cool). Camera adds Orange.
      // We interpolate from Neutral Grey (at 5600) to Vivid Orange (at 10000).
      // Normalized factor 0 (at 5600) to 1 (at 10000)
      const t = (wbKelvin - 5600) / (10000 - 5600);
      
      // Target Color at 10000K: R=255, G=140, B=0 (Warm Orange)
      
      r = lerp(128, 255, t);
      g = lerp(128, 140, t);
      b = lerp(128, 0, t);
      
      opacity = lerp(0, 0.8, t);
  }
  
  return `rgba(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)}, ${opacity})`;
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