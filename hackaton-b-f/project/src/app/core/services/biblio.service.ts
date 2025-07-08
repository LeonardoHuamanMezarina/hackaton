import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Ficha, FichaCompleta, TipoDocumento } from '../interfaces/biblio';

@Injectable({
  providedIn: 'root'
})
export class BiblioService {
  private apiUrl = 'http://localhost:8080/api';
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(private http: HttpClient) { }

  // Función para mapear campos del backend al frontend
  private mapearCampos(ficha: any): FichaCompleta {
    console.log('Mapeando ficha:', ficha); // Debug temporal
    
    return {
      idFichas: ficha.id_fichas || ficha.idFichas,
      tipoDocumentoId: ficha.tipo_documento_id || ficha.tipoDocumentoId,
      nombreTipo: ficha.tipoDocumento?.nombreTipo || ficha.nombreTipo || 'Sin tipo',
      autor: ficha.autor,
      titulo: ficha.titulo,
      añoPublicacion: ficha.año_publicacion || ficha.añoPublicacion,
      editorial: ficha.editorial,
      numeroEdicion: ficha.numero_edicion || ficha.numeroEdicion,
      numeroPaginas: ficha.numero_paginas || ficha.numeroPaginas,
      tema: ficha.tema,
      fechaAgregada: new Date(ficha.fecha_agregada || ficha.fechaAgregada),
      estado: ficha.estado
    };
  }

  // Función para mapear fichas del backend
  private mapearFichas(fichas: any[]): FichaCompleta[] {
    return fichas.map(ficha => this.mapearCampos(ficha));
  }

  // Obtener todas las fichas (activas e inactivas)
  getFichas(): Observable<FichaCompleta[]> {
    return this.http.get<any[]>(`${this.apiUrl}/fichas/listar`).pipe(
      map(fichas => this.mapearFichas(fichas)),
      catchError(this.handleError<FichaCompleta[]>('getFichas'))
    );
  }

  // Obtener fichas activas
  getFichasActivas(): Observable<FichaCompleta[]> {
    return this.http.get<any[]>(`${this.apiUrl}/fichas/true`).pipe(
      map(fichas => this.mapearFichas(fichas)),
      catchError(this.handleError<FichaCompleta[]>('getFichasActivas'))
    );
  }

  // Obtener fichas inactivas
  getFichasInactivas(): Observable<FichaCompleta[]> {
    return this.http.get<any[]>(`${this.apiUrl}/fichas/false`).pipe(
      map(fichas => this.mapearFichas(fichas)),
      catchError(this.handleError<FichaCompleta[]>('getFichasInactivas'))
    );
  }

  // Obtener ficha por ID
  getFichaById(id: number): Observable<FichaCompleta> {
    return this.http.get<any>(`${this.apiUrl}/fichas/${id}`).pipe(
      map(ficha => this.mapearCampos(ficha)),
      catchError(this.handleError<FichaCompleta>('getFichaById'))
    );
  }

  // Crear nueva ficha
  createFicha(ficha: Ficha): Observable<Ficha> {
    return this.http.post<Ficha>(`${this.apiUrl}/fichas/crear`, ficha, this.httpOptions).pipe(
      catchError(this.handleError<Ficha>('createFicha'))
    );
  }

  // Actualizar ficha
  updateFicha(id: number, ficha: Ficha): Observable<Ficha> {
    return this.http.put<Ficha>(`${this.apiUrl}/fichas/actualizar/${id}`, ficha, this.httpOptions).pipe(
      catchError(this.handleError<Ficha>('updateFicha'))
    );
  }

  // Eliminar ficha (eliminación lógica - cambia estado a false)
  deleteFicha(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/fichas/eliminar/${id}`, this.httpOptions).pipe(
      catchError(this.handleError<any>('deleteFicha'))
    );
  }

  // Restaurar ficha (cambiar estado a true)
  restoreFicha(id: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/fichas/restaurar/${id}`, {}, this.httpOptions).pipe(
      catchError(this.handleError<any>('restoreFicha'))
    );
  }

  // Obtener tipos de documento
  getTiposDocumento(): Observable<TipoDocumento[]> {
    return this.http.get<TipoDocumento[]>(`${this.apiUrl}/tipos-documento`).pipe(
      catchError(this.handleError<TipoDocumento[]>('getTiposDocumento'))
    );
  }

  // Buscar fichas por término
  searchFichas(term: string): Observable<FichaCompleta[]> {
    if (!term.trim()) {
      return this.getFichas();
    }
    return this.http.get<any[]>(`${this.apiUrl}/fichas/buscar/tema/${encodeURIComponent(term)}`).pipe(
      map(fichas => this.mapearFichas(fichas)),
      catchError(this.handleError<FichaCompleta[]>('searchFichas'))
    );
  }

  // Obtener fichas por tipo
  getFichasByTipo(tipoId: number): Observable<FichaCompleta[]> {
    return this.http.get<any[]>(`${this.apiUrl}/fichas/buscar/tipo-id/${tipoId}`).pipe(
      map(fichas => this.mapearFichas(fichas)),
      catchError(this.handleError<FichaCompleta[]>('getFichasByTipo'))
    );
  }

  // Generar reporte PDF
  generarReportePDF(): Observable<Blob> {
    console.log('Llamando al endpoint para generar PDF...');
    
    const httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/pdf'
      }),
      responseType: 'blob' as 'json'
    };
    
    return this.http.get(`${this.apiUrl}/fichas/pdf`, httpOptions).pipe(
      map((response: any) => {
        console.log('Respuesta del PDF recibida:', response);
        return new Blob([response], { type: 'application/pdf' });
      }),
      catchError(this.handleError<Blob>('generarReportePDF'))
    );
  }

  // Manejo de errores
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} falló:`, error);
      
      // Si hay un resultado por defecto, lo devuelve
      if (result !== undefined) {
        return throwError(() => error);
      }
      
      // Si no hay resultado por defecto, lanza el error
      return throwError(() => error);
    };
  }
}
