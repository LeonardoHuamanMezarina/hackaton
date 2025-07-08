export interface TipoDocumento {
  idTipoDocumento: number;
  nombreTipo: string;
}

export interface Ficha {
  idFichas?: number;
  tipoDocumentoId: number;
  autor: string;
  titulo: string;
  añoPublicacion?: number;
  editorial?: string;
  numeroEdicion?: string;
  numeroPaginas?: number;
  tema: string;
  fechaAgregada?: Date | string;
  estado?: boolean;
}

export interface FichaCompleta extends Ficha {
  nombreTipo?: string;
}
