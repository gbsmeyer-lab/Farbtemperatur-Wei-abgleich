export enum ScenarioType {
  SUNSET = 'sunset',
  BLUE_HOUR = 'blue_hour'
}

export interface ScenarioConfig {
  id: ScenarioType;
  title: string;
  description: string;
  backgroundUrl: string;
  defaultLightK: number;
  defaultWbK: number;
  targetDescription: string;
}

export interface SimulationState {
  lightKelvin: number;
  wbKelvin: number;
  scenario: ScenarioType;
}
