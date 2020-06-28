import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DeliveriesSuppliesComponent } from './deliveries-supplies/deliveries-supplies.component';
import { DownloadSuppliesComponent } from './download-supplies/download-supplies.component';
import { EntregasAtendidasComponent } from './entregas-atendidas/entregas-atendidas.component';
import { EntregaAtendidaComponent } from './entrega-atendida/entrega-atendida.component';


const routes: Routes = [
  {
    path: 'entregas',
    component: DeliveriesSuppliesComponent
  },
  {
    path: 'entrega/:IdEntrega/descargar',
    component: DownloadSuppliesComponent
  },
  {
    path: 'entregas-atendidas',
    component: EntregasAtendidasComponent
  },
  {
    path: 'entrega/:IdEntrega/atendida',
    component: EntregaAtendidaComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OperacionRoutingModule { }
