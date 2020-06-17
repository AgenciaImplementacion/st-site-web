import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormsModule, ReactiveFormsModule
} from '@angular/forms';
import { CreateUserComponent } from './create-user/create-user.component';
import { AdministradorRoutingModule } from './administrador-routing.module';
import { ListUserComponent } from './list-user/list-user.component';
import { FuntionsGlobalsHelper } from 'src/app/helpers/funtionsGlobals';
import { PageHeaderModule } from 'src/app/shared';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxPaginationModule } from 'ngx-pagination';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { BsComponentModule } from '../../bs-component/bs-component.module';
import { UpdateUserComponent } from './update-user/update-user.component';
import { ProfilesComponent } from './profiles/profiles.component';
import { GestorComponent } from './gestor/gestor.component';
import { ProveedorComponent } from './proveedor/proveedor.component';
import { OperadorComponent } from './operador/operador.component';
import { NgSelect2Module } from 'ng-select2';

@NgModule({
  declarations: [CreateUserComponent, ListUserComponent, UpdateUserComponent, ProfilesComponent, GestorComponent, ProveedorComponent, OperadorComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AdministradorRoutingModule,
    PageHeaderModule,
    NgbModule,
    NgxPaginationModule,
    Ng2SearchPipeModule,
    BsComponentModule,
    NgSelect2Module
  ],
  providers: [
    FuntionsGlobalsHelper
  ],
  bootstrap: [ListUserComponent],
})
export class AdministradorModule { }
