import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InsumosRoutingModule } from './insumos-routing.module';
import { CargueComponent } from './cargue/cargue.component';
import { PageHeaderModule } from 'src/app/shared';
import { SolicitudComponent } from './solicitud/solicitud.component';
import {
  FormsModule, ReactiveFormsModule
} from '@angular/forms';
import { IntegracionComponent } from './integracion/integracion.component';
import { SolicitudesComponent } from './solicitudes/solicitudes.component';
import { TypeDataSuppliesModel } from 'src/app/models/typeDataSupplies.model';
import { TooltipModule } from 'ng2-tooltip-directive';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxPaginationModule } from 'ngx-pagination';
import { SearchComponent } from './buscar/search.component';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { EntregarComponent } from './entregar/entregar.component';
import { Select2Module } from 'ng2-select2';
import { BsComponentModule } from '../../bs-component/bs-component.module';
@NgModule({
  declarations: [
    CargueComponent,
    SolicitudComponent,
    IntegracionComponent,
    SolicitudesComponent,
    SearchComponent,
    EntregarComponent
  ],
  imports: [
    CommonModule,
    PageHeaderModule,
    InsumosRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    TooltipModule,
    NgxPaginationModule,
    NgbModule,
    Ng2SearchPipeModule,
    Select2Module,
    BsComponentModule
  ],
  bootstrap: [IntegracionComponent],
  providers: [
    TypeDataSuppliesModel
  ]
})
export class InsumosModule { }