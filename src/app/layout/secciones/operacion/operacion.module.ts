import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageHeaderModule } from 'src/app/shared';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OperacionRoutingModule } from './operacion-routing.module';
import { DeliveriesSuppliesComponent } from './descargas-pendientes/deliveries-supplies.component';
import { DownloadSuppliesComponent } from './descargar-insumo/download-supplies.component';
import { BsComponentModule } from '../../bs-component/bs-component.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { EntregasAtendidasComponent } from './descargas-realizadas/entregas-atendidas.component';
import { EntregaAtendidaComponent } from './descarga-realizada/entrega-atendida.component';

@NgModule({
  declarations: [
    DeliveriesSuppliesComponent,
    DownloadSuppliesComponent,
    EntregasAtendidasComponent,
    EntregaAtendidaComponent,
  ],
  imports: [
    CommonModule,
    PageHeaderModule,
    FormsModule,
    ReactiveFormsModule,
    OperacionRoutingModule,
    BsComponentModule,
    NgbModule
  ],
  bootstrap: [DownloadSuppliesComponent]
})
export class OperacionModule { }
