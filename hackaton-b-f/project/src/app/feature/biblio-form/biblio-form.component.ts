import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MATERIAL_MODULES } from '../../material.config';
import { BiblioService } from '../../core/services/biblio.service';
import { Ficha, TipoDocumento } from '../../core/interfaces/biblio';

@Component({
  selector: 'app-biblio-form',
  imports: [CommonModule, ReactiveFormsModule, ...MATERIAL_MODULES],
  templateUrl: './biblio-form.component.html',
  styleUrl: './biblio-form.component.scss'
})
export class BiblioFormComponent implements OnInit {
  fichaForm: FormGroup;
  tiposDocumento: TipoDocumento[] = [];
  isEditMode = false;
  fichaId: number | null = null;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private biblioService: BiblioService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.fichaForm = this.fb.group({
      id_tipo_documento: ['', [Validators.required]],
      autor: ['', [Validators.required, Validators.maxLength(255)]],
      titulo: ['', [Validators.required, Validators.maxLength(255)]],
      anio_publicacion: ['', [Validators.required, Validators.min(1000), Validators.max(new Date().getFullYear())]],
      editorial: ['', [Validators.maxLength(255)]],
      numero_edicion: ['', [Validators.maxLength(50)]],
      numero_paginas: ['', [Validators.min(1)]],
      tema: ['', [Validators.required, Validators.maxLength(255)]]
    });
  }

  ngOnInit(): void {
    this.cargarTiposDocumento();
    
    // Verificar si es modo edición
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.fichaId = +params['id'];
        this.cargarFicha(this.fichaId);
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

  cargarFicha(id: number): void {
    this.loading = true;
    this.biblioService.getFichaById(id).subscribe({
      next: (ficha) => {
        this.fichaForm.patchValue({
          id_tipo_documento: ficha.tipoDocumentoId,
          autor: ficha.autor,
          titulo: ficha.titulo,
          anio_publicacion: ficha.añoPublicacion,
          editorial: ficha.editorial,
          numero_edicion: ficha.numeroEdicion,
          numero_paginas: ficha.numeroPaginas,
          tema: ficha.tema
        });
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar ficha:', error);
        this.loading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.fichaForm.valid) {
      this.loading = true;
      const fichaData: Ficha = this.fichaForm.value;

      const operation = this.isEditMode
        ? this.biblioService.updateFicha(this.fichaId!, fichaData)
        : this.biblioService.createFicha(fichaData);

      operation.subscribe({
        next: () => {
          this.router.navigate(['/biblioteca']);
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

  onCancel(): void {
    this.router.navigate(['/biblioteca']);
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
}
