export interface ICharger {
  id: string;
  serialNumber: string;
  vendor: string;
  productName: string;
  color: string;
  status: string;
  userId: string;
}

export class Charger implements ICharger {
  color: string;
  id: string;
  productName: string;
  serialNumber: string;
  status: string;
  userId: string;
  vendor: string;
}
