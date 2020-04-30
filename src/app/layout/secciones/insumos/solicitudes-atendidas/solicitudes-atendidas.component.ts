import { Component, OnInit } from '@angular/core';
import { WorkspacesService } from 'src/app/services/workspaces/workspaces.service';
import * as _moment from 'moment';
import { Router } from '@angular/router';

const moment = _moment;

@Component({
  selector: 'app-solicitudes-atendidas',
  templateUrl: './solicitudes-atendidas.component.html',
  styleUrls: ['./solicitudes-atendidas.component.scss']
})
export class SolicitudesAtendidasComponent implements OnInit {

  dataRequestPending: any;
  constructor(
    private serviceWorkspaces: WorkspacesService,
    private router: Router,

  ) {
    this.dataRequestPending = [];
  }

  ngOnInit() {
    this.serviceWorkspaces.getAttendedRequestByProvider().subscribe(
      data => {
        this.dataRequestPending = data;
        console.log(this.dataRequestPending);
        
      }
    );
  }
  formatDate(date: string) {
    moment.locale('es');
    return moment(date).format('ll, h:mm a');
  }
  load(idInsumo: number) {
    this.router.navigate(['/insumos/solicitudes/atendidas/ver/' + idInsumo]);
  }
  getEntity(item: any) {
    let data = item.emitters.find((elem: any) => {
      return elem.emitterType === "ENTITY"
    });
    return data.user.name
  }
}

