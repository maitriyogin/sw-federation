export interface ICar {
  id: string;
  registrationNumber: string;
  name: string;
  vin: string;
  model: string;
  modelYear: string;
  userId: string;
  chargerId: string;
  batterySize: number;
}

export class Car implements ICar {
  batterySize: number;
  chargerId: string;
  id: string;
  model: string;
  modelYear: string;
  name: string;
  registrationNumber: string;
  userId: string;
  vin: string;
}
