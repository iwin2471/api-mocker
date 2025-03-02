export interface Field {
  name: string;
  type: string;
}

export interface Endpoint {
  path: string;
  method: string;
  response: string;
  type: string;
}

export interface Schema {
  name: string;
  fields: Field[];
}
