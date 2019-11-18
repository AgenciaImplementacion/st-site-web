import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormsModule, ReactiveFormsModule
} from '@angular/forms';
import { GestionMunicipioRoutingModule } from './gestion-municipio-routing.module';

import { GestionComponent } from './gestion/gestion.component';
import { PageHeaderModule } from 'src/app/shared';
import { WorkspaceComponent } from './workspace/workspace.component';

@NgModule({
  declarations: [GestionComponent, WorkspaceComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    GestionMunicipioRoutingModule,
    PageHeaderModule
  ]
})
export class GestionMunicipioModule { }
