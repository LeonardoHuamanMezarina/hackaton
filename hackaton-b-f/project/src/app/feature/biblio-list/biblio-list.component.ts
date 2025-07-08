import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MATERIAL_MODULES } from '../../material.config';
import { BiblioService } from '../../core/services/biblio.service';
import { FichaCompleta, TipoDocumento } from '../../core/interfaces/biblio';
import { BiblioDialogComponent } from '../biblio-dialog/biblio-dialog.component';

@Component({
  selector: 'app-biblio-list',
  imports: [CommonModule, RouterModule, ...MATERIAL_MODULES],
  templateUrl: './biblio-list.component.html',
  styleUrl: './biblio-list.component.scss'
})
export class BiblioListComponent implements OnInit {
  fichas: FichaCompleta[] = [];
  fichasFiltradas: FichaCompleta[] = [];
  tiposDocumento: TipoDocumento[] = [];
  displayedColumns: string[] = ['titulo', 'autor', 'nombreTipo', 'añoPublicacion', 'tema', 'estado', 'fechaAgregada', 'acciones'];
  loading = false;

  // Filtros
  filtroTexto: string = '';
  filtroTipo: string = '';
  filtroEstado: string = 'todos'; // 'todos', 'activas', 'inactivas'

  constructor(
    private biblioService: BiblioService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.cargarFichas();
    this.cargarTiposDocumento();
  }

  cargarFichas(): void {
    this.loading = true;
    this.biblioService.getFichas().subscribe({
      next: (fichas) => {
        this.fichas = fichas;
        this.fichasFiltradas = fichas;
        console.log('Fichas cargadas:', fichas);
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar fichas:', error);
        this.loading = false;
      }
    });
  }

  cargarTiposDocumento(): void {
    this.biblioService.getTiposDocumento().subscribe({
      next: (tipos) => {
        this.tiposDocumento = tipos;
      },
      error: (error) => {
        console.error('Error al cargar tipos de documento:', error);
      }
    });
  }

  aplicarFiltros(): void {
    this.fichasFiltradas = this.fichas.filter(ficha => {
      const cumpleTexto = !this.filtroTexto || 
        ficha.titulo.toLowerCase().includes(this.filtroTexto.toLowerCase()) ||
        ficha.autor.toLowerCase().includes(this.filtroTexto.toLowerCase()) ||
        ficha.tema.toLowerCase().includes(this.filtroTexto.toLowerCase());

      const cumpleTipo = !this.filtroTipo || ficha.nombreTipo === this.filtroTipo;

      let cumpleEstado = true;
      if (this.filtroEstado === 'activas') {
        cumpleEstado = ficha.estado === true;
      } else if (this.filtroEstado === 'inactivas') {
        cumpleEstado = ficha.estado === false;
      }

      return cumpleTexto && cumpleTipo && cumpleEstado;
    });
  }

  onFiltroTextoChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.filtroTexto = target.value;
    this.aplicarFiltros();
  }

  onFiltroTipoChange(tipo: string): void {
    this.filtroTipo = tipo;
    this.aplicarFiltros();
  }

  onFiltroEstadoChange(estado: string): void {
    this.filtroEstado = estado;
    this.aplicarFiltros();
  }

  eliminarFicha(id: number): void {
    if (confirm('¿Está seguro de que desea eliminar esta ficha?')) {
      this.loading = true;
      this.biblioService.deleteFicha(id).subscribe({
        next: () => {
          this.cargarFichas();
        },
        error: (error) => {
          console.error('Error al eliminar ficha:', error);
          this.loading = false;
        }
      });
    }
  }

  // Método para restaurar ficha
  restaurarFicha(id: number): void {
    this.loading = true;
    this.biblioService.restoreFicha(id).subscribe({
      next: () => {
        this.cargarFichas();
      },
      error: (error) => {
        console.error('Error al restaurar ficha:', error);
        this.loading = false;
      }
    });
  }

  // Método para abrir dialog de nueva ficha
  abrirDialogNueva(): void {
    const dialogRef = this.dialog.open(BiblioDialogComponent, {
      width: '700px',
      maxWidth: '90vw',
      disableClose: false,
      data: { isEdit: false }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.cargarFichas();
      }
    });
  }

  // Método para abrir dialog de edición
  abrirDialogEditar(ficha: FichaCompleta): void {
    const dialogRef = this.dialog.open(BiblioDialogComponent, {
      width: '700px',
      maxWidth: '90vw',
      disableClose: false,
      data: { 
        ficha: ficha,
        isEdit: true 
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.cargarFichas();
      }
    });
  }

  getTipoColor(tipo: string): string {
    const colores: { [key: string]: string } = {
      'libro': 'rgba(76, 175, 80, 0.8)',      // Verde más transparente
      'articulo': 'rgba(33, 150, 243, 0.8)',  // Azul más transparente
      'tesis': 'rgba(255, 152, 0, 0.8)',      // Naranja más transparente
      'video': 'rgba(233, 30, 99, 0.8)',      // Rosa más transparente
      'periodico': 'rgba(156, 39, 176, 0.8)', // Púrpura más transparente
      'repositorio': 'rgba(96, 125, 139, 0.8)' // Gris azulado más transparente
    };
    return colores[tipo?.toLowerCase()] || 'rgba(102, 102, 102, 0.8)';
  }

  getEstadoColor(estado: boolean): string {
    return estado ? 'rgba(76, 175, 80, 0.8)' : 'rgba(244, 67, 54, 0.8)';
  }

  // Función para formatear el nombre del tipo
  formatTipoNombre(tipo: string): string {
    if (!tipo) return '';
    
    const nombres: { [key: string]: string } = {
      'libro': 'Libro',
      'articulo': 'Artículo',
      'tesis': 'Tesis',
      'video': 'Video',
      'periodico': 'Periódico',
      'repositorio': 'Repositorio'
    };
    return nombres[tipo.toLowerCase()] || tipo;
  }

  // Función para generar reporte PDF
  generarReportePDF(): void {
    console.log('Generando reporte PDF...');
    
    this.biblioService.generarReportePDF().subscribe({
      next: (response: Blob) => {
        // Crear un objeto URL para el blob
        const url = window.URL.createObjectURL(response);
        
        // Crear un enlace temporal y hacer click para descargar
        const enlace = document.createElement('a');
        enlace.href = url;
        enlace.download = 'reporte_fichas_bibliotecas.pdf';
        document.body.appendChild(enlace);
        enlace.click();
        
        // Limpiar
        document.body.removeChild(enlace);
        window.URL.revokeObjectURL(url);
        
        console.log('Reporte PDF generado exitosamente');
      },
      error: (error: any) => {
        console.error('Error al generar reporte PDF:', error);
        // Aquí podrías mostrar un snackbar o notificación de error
      }
    });
  }
}
