import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { EmpresaService } from '../../../../../../services/tables/empresa.service';
import { CiudadService } from '../../../../../../services/tables/ciudad.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { IEmpresa } from '../../../../../../models/empresa.model';
import { ICiudadView } from '../../../../../../models/ciudad.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-empresa-form',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, CommonModule],
  templateUrl: './empresa-form.component.html',
  styleUrl: './empresa-form.component.css'
})
export class EmpresaFormComponent implements OnInit {
  
  empresaForm: FormGroup;
  isEditMode = false;
  empresaId: number | null = null;
  isLoading = false;
  formTitle: string = 'Nueva Empresa';
  ciudades: ICiudadView[] = [];

  constructor(
    private fb: FormBuilder,
    private empresaService: EmpresaService,
    private ciudadService: CiudadService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.empresaForm = this.fb.group({
      id_empresa: [null],
      razon_social: ['', [Validators.required, Validators.maxLength(200)]],
      nombre_comercial: ['', [Validators.maxLength(200)]],
      ruc: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
      dv: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
      direccion: ['', [Validators.maxLength(200)]],
      telefono: ['', [Validators.maxLength(50)]],
      email: ['', [Validators.maxLength(100), Validators.email]],
      id_ciudad: ['', [Validators.required]],
      fecha_constitucion: [''],
      representante_legal: ['', [Validators.maxLength(200)]],
      estado: [true] // Cambiado a boolean con valor inicial true (Activo)
    });
  }

  ngOnInit(): void {
    this.loadCiudades();
    
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.empresaId = +id;
        this.isEditMode = true;
        this.formTitle = 'Editar Empresa';
        this.loadEmpresaData(this.empresaId);
      }
    });
  }

  loadCiudades(): void {
    this.ciudadService.getAll().subscribe({
      next: (data) => {
        this.ciudades = data;
      },
      error: (error) => {
        console.error('Error loading ciudades:', error);
        this.showError('Error al cargar las ciudades');
      }
    });
  }

  loadEmpresaData(id: number): void {
    this.isLoading = true;
    this.empresaService.getById(id).subscribe({
      next: (empresa) => {
        this.empresaForm.patchValue({
          id_empresa: empresa.id_empresa,
          razon_social: empresa.razon_social,
          nombre_comercial: empresa.nombre_comercial,
          ruc: empresa.ruc,
          dv: empresa.dv,
          direccion: empresa.direccion,
          telefono: empresa.telefono,
          email: empresa.email,
          id_ciudad: empresa.id_ciudad,
          fecha_constitucion: empresa.fecha_constitucion,
          representante_legal: empresa.representante_legal,
          estado: empresa.estado // Convertir 1/0 a true/false
        });
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading empresa:', error);
        this.isLoading = false;
        this.showError('No se pudo cargar la empresa');
        this.router.navigate(['/sistema_general/mantenimientos/empresas']);
      }
    });
  }
  
  onSubmit(): void {
    if (this.empresaForm.invalid) {
      this.markFormFieldsAsTouched();
      return;
    }
  
    this.isLoading = true;
    const empresaData = {
      ...this.empresaForm.value,
      estado: this.empresaForm.value.estado ? 1 : 0 // Convertir true/false a 1/0
    };

    const operation$ = this.isEditMode && this.empresaId
      ? this.empresaService.update(this.empresaId, empresaData)
      : this.empresaService.create(empresaData);
  
    operation$.subscribe({
      next: (response) => {
        this.isLoading = false;
        const message = this.isEditMode 
          ? 'Empresa actualizada correctamente' 
          : 'Empresa creada correctamente';
        this.showSuccess(message);
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Error:', error);
        const message = this.isEditMode
          ? 'Error al actualizar la empresa'
          : 'Error al crear la empresa';
        this.showError(message + ': ' + (error.error?.message || error.message));
      }
    });
  }

  // Resto de los métodos permanecen igual...
  private markFormFieldsAsTouched(): void {
    Object.values(this.empresaForm.controls).forEach(control => {
      control.markAsTouched();
    });
  }

  private showSuccess(message: string): void {
    Swal.fire({
      title: '¡Éxito!',
      text: message,
      icon: 'success',
      confirmButtonColor: '#7D161A',
      timer: 2000
    }).then(() => {
      this.router.navigate(['/sistema_general/mantenimientos/empresas']);
    });
  }

  private showError(message: string): void {
    this.isLoading = false;
    Swal.fire({
      title: 'Error',
      text: message,
      icon: 'error',
      confirmButtonColor: '#7D161A',
      footer: 'Verifique la consola para más detalles'
    });
  }
}