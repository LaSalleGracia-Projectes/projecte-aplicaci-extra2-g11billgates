export interface ILink {
    _id?: string;
    url: string;
    description: string;
    type: 'descarga' | 'actualizacion';
  }