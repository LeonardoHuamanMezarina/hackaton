import { Component, OnInit, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MATERIAL_MODULES } from '../../material.config';
import { BiblioService } from '../../core/services/biblio.service';
import { Ficha, TipoDocumento } from '../../core/interfaces/biblio';

export interface DialogData {
  ficha?: Ficha;
  isEdit: boolean;
}

@Component({
  selector: 'app-biblio-dialog',
  imports: [CommonModule, ReactiveFormsModule, ...MATERIAL_MODULES],
  templateUrl: './biblio-dialog.component.html',
  styleUrl: './biblio-dialog.component.scss'
})
export class BiblioDialogComponent implements OnInit {
  fichaForm!: FormGroup;
  tiposDocumento: TipoDocumento[] = [];
  loading = false;
  isEditMode = false;
  tipoSeleccionado: string = '';

  constructor(
    private fb: FormBuilder,
    private biblioService: BiblioService,
    public dialogRef: MatDialogRef<BiblioDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {
    this.isEditMode = data.isEdit;
    this.inicializarFormulario();
  }

  inicializarFormulario(): void {
    this.fichaForm = this.fb.group({
      tipoDocumentoId: ['', [Validators.required]],
      autor: ['', [Validators.required, Validators.maxLength(255)]],
      titulo: ['', [Validators.required, Validators.maxLength(255)]],
      añoPublicacion: ['', [Validators.required, Validators.min(1000), Validators.max(new Date().getFullYear())]],
      editorial: [''],
      numeroEdicion: [''],
      numeroPaginas: [''],
      tema: ['', [Validators.required, Validators.maxLength(255)]],
      estado: [true],
      fechaAgregada: [new Date()]
    });

    // Suscribirse a cambios en el tipo de documento
    this.fichaForm.get('tipoDocumentoId')?.valueChanges.subscribe(tipoId => {
      this.onTipoDocumentoChange(tipoId);
    });
  }

  onTipoDocumentoChange(tipoId: number): void {
    const tipoSeleccionado = this.tiposDocumento.find(t => t.idTipoDocumento === tipoId);
    this.tipoSeleccionado = tipoSeleccionado?.nombreTipo || '';
    
    this.actualizarValidadores();
  }

  actualizarValidadores(): void {
    const editorial = this.fichaForm.get('editorial');
    const numeroEdicion = this.fichaForm.get('numeroEdicion');
    const numeroPaginas = this.fichaForm.get('numeroPaginas');

    // Limpiar validadores existentes
    editorial?.clearValidators();
    numeroEdicion?.clearValidators();
    numeroPaginas?.clearValidators();

    // Aplicar validadores según el tipo
    if (this.estipoCompleto()) {
      // Para libro, artículo, tesis - campos opcionales pero con validación de longitud
      editorial?.setValidators([Validators.maxLength(255)]);
      numeroEdicion?.setValidators([Validators.maxLength(50)]);
      numeroPaginas?.setValidators([Validators.min(1)]);
    }

    // Actualizar validación
    editorial?.updateValueAndValidity();
    numeroEdicion?.updateValueAndValidity();
    numeroPaginas?.updateValueAndValidity();
  }

  estipoCompleto(): boolean {
    return ['libro', 'articulo', 'tesis'].includes(this.tipoSeleccionado.toLowerCase());
  }

  esTipoSimple(): boolean {
    return ['video', 'periodico', 'repositorio'].includes(this.tipoSeleccionado.toLowerCase());
  }

  ngOnInit(): void {
    this.cargarTiposDocumento();
  }

  cargarTiposDocumento(): void {
    this.biblioService.getTiposDocumento().subscribe({
      next: (tipos) => {
        this.tiposDocumento = tipos;
        
        // Si es modo edición, cargar los datos después de obtener los tipos
        if (this.isEditMode && this.data.ficha) {
          this.cargarDatosEdicion();
        }
      },
      error: (error) => {
        console.error('Error al cargar tipos de documento:', error);
        // Datos de prueba con nombres correctos
        this.tiposDocumento = [
          { idTipoDocumento: 1, nombreTipo: 'libro' },
          { idTipoDocumento: 2, nombreTipo: 'articulo' },
          { idTipoDocumento: 3, nombreTipo: 'tesis' },
          { idTipoDocumento: 4, nombreTipo: 'video' },
          { idTipoDocumento: 5, nombreTipo: 'periodico' },
          { idTipoDocumento: 6, nombreTipo: 'repositorio' }
        ];
        
        // Si es modo edición, cargar los datos después de los datos de prueba
        if (this.isEditMode && this.data.ficha) {
          this.cargarDatosEdicion();
        }
      }
    });
  }

  private cargarDatosEdicion(): void {
    if (!this.data.ficha) return;
    
    // Establecer el tipo seleccionado
    const tipoSeleccionado = this.tiposDocumento.find(t => t.idTipoDocumento === this.data.ficha!.tipoDocumentoId);
    if (tipoSeleccionado) {
      this.tipoSeleccionado = tipoSeleccionado.nombreTipo;
    }
    
    this.fichaForm.patchValue({
      tipoDocumentoId: this.data.ficha.tipoDocumentoId,
      autor: this.data.ficha.autor,
      titulo: this.data.ficha.titulo,
      añoPublicacion: this.data.ficha.añoPublicacion,
      editorial: this.data.ficha.editorial,
      numeroEdicion: this.data.ficha.numeroEdicion,
      numeroPaginas: this.data.ficha.numeroPaginas,
      tema: this.data.ficha.tema,
      estado: this.data.ficha.estado ?? true,
      fechaAgregada: this.data.ficha.fechaAgregada ?? new Date()
    });
    
    // Actualizar validadores después de cargar los datos
    this.actualizarValidadores();
  }

  onSubmit(): void {
    if (this.fichaForm.valid) {
      this.loading = true;
      const fichaData: Ficha = { ...this.fichaForm.value };

      // Limpiar campos no necesarios para tipos simples
      if (this.esTipoSimple()) {
        fichaData.editorial = undefined;
        fichaData.numeroEdicion = undefined;
        fichaData.numeroPaginas = undefined;
      }

      const operation = this.isEditMode
        ? this.biblioService.updateFicha(this.data.ficha!.idFichas!, fichaData)
        : this.biblioService.createFicha(fichaData);

      operation.subscribe({
        next: (result) => {
          this.loading = false;
          this.dialogRef.close(result);
        },
        error: (error) => {
          console.error('Error al guardar ficha:', error);
          this.loading = false;
        }
      });
    } else {
      this.markFormGroupTouched(this.fichaForm);
    }
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }

  // Métodos para mostrar errores
  getErrorMessage(fieldName: string): string {
    const control = this.fichaForm.get(fieldName);
    if (control?.errors && control?.touched) {
      if (control.errors['required']) {
        return 'Este campo es requerido';
      }
      if (control.errors['maxlength']) {
        return `Máximo ${control.errors['maxlength'].requiredLength} caracteres`;
      }
      if (control.errors['min']) {
        return `Valor mínimo: ${control.errors['min'].min}`;
      }
      if (control.errors['max']) {
        return `Valor máximo: ${control.errors['max'].max}`;
      }
    }
    return '';
  }

  getTipoIcon(tipo: string): string {
    const iconos: { [key: string]: string } = {
      'libro': 'book',
      'articulo': 'article',
      'tesis': 'school',
      'video': 'video_library',
      'periodico': 'newspaper',
      'repositorio': 'folder_special'
    };
    return iconos[tipo?.toLowerCase()] || 'description';
  }

  getSelectedTipoNombre(): string {
    const selectedId = this.fichaForm.get('tipoDocumentoId')?.value;
    if (selectedId) {
      const selectedTipo = this.tiposDocumento.find(tipo => tipo.idTipoDocumento === selectedId);
      return selectedTipo?.nombreTipo || '';
    }
    return '';
  }
}
