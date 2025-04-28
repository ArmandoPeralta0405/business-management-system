import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { EmpresaService } from '../../../../../../services/tables/empresa.service';
import { SucursalService } from '../../../../../../services/tables/sucursal.service';
import { DepositoService } from '../../../../../../services/tables/deposito.service';
import { IEmpresaView } from '../../../../../../models/empresa.model';
import { ISucursalView } from '../../../../../../models/sucursal.model';
import { IDeposito } from '../../../../../../models/deposito.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-ajuste-stock-form',
  imports: [FormsModule, CommonModule],
  templateUrl: './ajuste-stock-form.component.html',
  styleUrl: './ajuste-stock-form.component.css'
})
export class AjusteStockFormComponent {

  formData = {
    fechaAjuste: '',
    horaAjuste: '',
    numeroDocumento: '',
    usuario: '',
    empresa: -1,
    sucursal: -1,
    deposito: -1
  };

  formDisabled = true; // Nueva propiedad para controlar el estado del formulario

  empresas: IEmpresaView[] = [];
  sucursales: ISucursalView[] = [];
  depositos: IDeposito[] = [];

  constructor(
    private empresaService: EmpresaService,
    private sucursalService: SucursalService,
    private depositoService: DepositoService
  ) {
    this.loadEmpresas();
  }

  loadEmpresas() {
    this.empresaService.getAll().subscribe(
      (data: IEmpresaView[]) => {
        this.empresas = data;
      },
      error => {
        console.error('Error al cargar las empresas', error);
      }
    );
  }

  onEmpresaChange() {
    if (this.formData.empresa !== -1) {
      this.sucursalService.getByEmpresa(this.formData.empresa).subscribe(
        (data: ISucursalView[]) => {
          this.sucursales = data;
        },
        error => {
          console.error('Error al cargar las sucursales', error);
        }
      );
    } else {
      this.sucursales = [];
      this.depositos = [];
    }
  }

  onSucursalChange() {
    if (this.formData.sucursal !== -1 && this.formData.empresa !== -1) {
      this.depositoService.getBySucursal(this.formData.empresa, this.formData.sucursal).subscribe(
        (data: IDeposito[]) => {
          this.depositos = data;
        },
        error => {
          console.error('Error al cargar los depósitos', error);
        }
      );
    } else {
      this.depositos = [];
    }
  }

  onNuevaTransaccion() {
    this.formDisabled = false; // Habilitar el formulario
    const token = localStorage.getItem('token');
    let usuario = '';
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        usuario = payload.nombre 
          ? (payload.alias ? `${payload.nombre} (${payload.alias})` : payload.nombre)
          : (payload.alias || '');
      } catch {
        usuario = '';
      }
    }
    this.formData.usuario = usuario;

    // Establecer la fecha actual
    const today = new Date();
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const day = today.getDate().toString().padStart(2, '0');
    this.formData.fechaAjuste = `${year}-${month}-${day}`;

    // Establecer la hora actual
    const horas = today.getHours().toString().padStart(2, '0');
    const minutos = today.getMinutes().toString().padStart(2, '0');
    this.formData.horaAjuste = `${horas}:${minutos}`;

    console.log('Nueva transacción agregada');
    this.loadEmpresas();
}

  onFechaChange() {
    if (this.formData.fechaAjuste) {
      const now = new Date();
      const horas = now.getHours().toString().padStart(2, '0');
      const minutos = now.getMinutes().toString().padStart(2, '0');
      this.formData.horaAjuste = `${horas}:${minutos}`;
    } else {
      this.formData.horaAjuste = '';
    }
  }

  onCancelarOperacion() {
    this.formDisabled = true; // Deshabilitar el formulario
    this.formData.fechaAjuste = '';
    this.formData.horaAjuste = '';
    this.formData.numeroDocumento = '';
    this.formData.usuario = '';
    this.formData.empresa = -1;
    this.formData.sucursal = -1;
    this.formData.deposito = -1;
  }
}
