import { Component, OnInit } from '@angular/core';
import { WorkspacesService } from 'src/app/services/workspaces/workspaces.service';
import { ProvidersService } from 'src/app/services/providers/providers.service';
import { ToastrService } from 'ngx-toastr';
import { FuntionsGlobalsHelper } from 'src/app/helpers/funtionsGlobals';
import { ModalService } from 'src/app/services/modal/modal.service';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Router } from '@angular/router';

@Component({
  selector: 'app-integracion',
  templateUrl: './integracion.component.html',
  styleUrls: ['./integracion.component.scss']
})
export class IntegracionComponent implements OnInit {

  departments: any;
  munucipalities: any;
  selectDepartment: string;
  selectMunicipality: number;
  dataWorkSpaceMunicipality: any;
  splitZones: boolean;
  providers: any;
  dataSuppliesProvider: any;
  selectSupplies: number;
  listsupplies: { deadline: string; supplies: any; };
  catastro: any;
  registro: any;
  ant: any;
  municipalityXTF: any;
  selectsupplyCadastre: number;
  selectsupplyRegistration: number;
  selectsupplyANT: number;
  msgAlert: string;
  mensajeIntegrationResponse: any;
  activateButtonIntegration: boolean;
  idWorkspace: number;
  integrationByWorkspace: any;
  selectIntegration: any;
  page: number;
  pageSize: number;
  msgIntegrationAssited: any;
  idGenerateXTF: number;
  idStartAsistente: number;
  idCancel: number;
  constructor(
    private serviceWorkspaces: WorkspacesService,
    private serviceProviders: ProvidersService,
    private toastr: ToastrService,
    private modalService: ModalService,
    private router: Router
  ) {
    this.departments = [];
    this.munucipalities = [];
    this.selectDepartment = '0';
    this.selectMunicipality = 0;
    this.splitZones = false;
    this.dataWorkSpaceMunicipality = {
      id: 0,
      manager: {
        name: ''
      },
      operators: [{
        operator: {
          name: ''
        }
      }],
      numberAlphanumericParcels: '',
      municipalityArea: ''
    };
    this.providers = [];
    this.dataSuppliesProvider = [];
    this.selectSupplies = 0;
    this.listsupplies = {
      deadline: '',
      supplies: []
    };
    this.catastro = [];
    this.registro = [];
    this.ant = [];
    this.municipalityXTF = [];
    this.selectsupplyCadastre = 0;
    this.selectsupplyRegistration = 0;
    this.selectsupplyANT = 0;
    this.mensajeIntegrationResponse = {
      message: ''
    };
    this.msgAlert = '<strong>Recomendación: </strong>Por favor revisar los archivos antes de solicitar la integración.';
    this.activateButtonIntegration = true;
    this.idWorkspace = 0;
    this.integrationByWorkspace = [];
    this.selectIntegration = [{
      id: '',
      integrationState: {
        name: '',
        description: ''
      },
      supplyCadastre: {
        typeSupply: {
          name: ''
        }
      },
      supplySnr: { typeSupply: { name: '' } },
      stats: [{
        cadastreRecordsNumber: '',
        snrRecordsNumber: '',
        percentage: '',
        createdAt: ''
      }]
    }];
    this.page = 1;
    this.pageSize = 3;
    this.msgIntegrationAssited = [];
    this.idGenerateXTF = 0;
    this.idStartAsistente = 0;
    this.idCancel = 0;
  }

  ngOnInit() {
    this.serviceWorkspaces.getDepartments()
      .subscribe(response => {
        this.departments = response;
      });
  }
  changeDepartament() {
    this.serviceWorkspaces.GetMunicipalitiesByDeparment(this.selectDepartment).subscribe(
      data => {
        this.munucipalities = data;
      }
    );
  }
  changeMunucipality() {
    this.serviceWorkspaces.getWorkSpaceActiveByMunicipality(this.selectMunicipality).subscribe(
      response => {
        this.dataWorkSpaceMunicipality = response;
        this.idWorkspace = this.dataWorkSpaceMunicipality.id;
        this.serviceProviders.getProviders().subscribe(
          data => {
            this.providers = data;
          }
        );
        this.serviceWorkspaces.GetIntegrationsByWorkspace(this.idWorkspace).subscribe(
          resp => {
            this.integrationByWorkspace = resp;
          }
        );
      }
    );
    this.serviceWorkspaces.GetSuppliesByMunicipalityXTF(this.selectMunicipality).subscribe(
      response => {
        this.municipalityXTF = response;
        this.catastro = this.municipalityXTF.filter(item => {
          if (item.typeSupply.providerProfile.name === 'CATASTRAL') {
            return item;
          }
        });
        this.registro = this.municipalityXTF.filter(item => {
          if (item.typeSupply.providerProfile.name === 'REGISTRO') {
            return item;
          }
        });
        this.ant = this.municipalityXTF.filter(item => {
          if (item.typeSupply.providerProfile.name === 'ANT') {
            return item;
          }
        });
      }
    );
  }
  integrationSupplies() {
    // tslint:disable-next-line:prefer-const
    let data = {
      supplyCadastre: this.selectsupplyCadastre,
      supplyRegistration: this.selectsupplyRegistration
    };
    this.serviceWorkspaces.GetIntegrationCadastreRegistration(this.selectMunicipality, data).subscribe(
      response => {
        // tslint:disable-next-line:max-line-length
        this.msgAlert = '<strong>¡Se ha iniciado la integración!</strong><br>El sistema le enviará una notificación al correo una vez la finalice y podrá ver los resultados de integración en esta sección.';
        this.selectsupplyCadastre = 0;
        this.selectsupplyRegistration = 0;
        this.activateButtonIntegration = true;
        this.toastr.success('¡Se ha iniciado la integración!');
        setTimeout(() => {
          this.changeMunucipality();
        }, 2000);
      },
      error => {
        this.msgAlert = error.error.message +
          '<br>El sistema le enviará una notificación al correo una vez la finalice y podrá ver los resultados de integración en esta sección.';
        this.selectsupplyCadastre = 0;
        this.selectsupplyRegistration = 0;
        this.activateButtonIntegration = true;
      }
    );
  }
  comprobar() {
    if (this.selectsupplyCadastre !== 0 && this.selectsupplyRegistration !== 0) {
      this.activateButtonIntegration = false;
    }
  }
  globalFuntionDate(date: any) {
    return FuntionsGlobalsHelper.formatDate(date);
  }
  closeModal(option: number, id: string) {
    this.modalService.close(id);
  }
  openModal(id: number, modal: string) {
    this.selectIntegration = this.integrationByWorkspace.filter(item => {
      return item.id === id;
    });
    this.modalService.open(modal);
  }
  openModalGenerateXTF(modal: string, idIntegration: number) {
    this.idGenerateXTF = idIntegration;
    this.modalService.open(modal);
  }
  openModalIntegrationAssited(modal: string, idIntegration: number) {
    this.idStartAsistente = idIntegration;
    this.modalService.open(modal);
  }
  openModalcancel(modal: string, idIntegration: number) {
    this.idCancel = idIntegration;
    this.modalService.open(modal);
  }
  closeModalGenerateXTF(modal: string, option: boolean) {
    if (option) {
      this.generateXTF(this.idGenerateXTF);
    }
    this.modalService.close(modal);
  }
  closeModalIntegrationAssited(modal: string, option: boolean) {
    if (option) {
      this.startIntegrationAssited(this.idStartAsistente);
    }
    this.modalService.close(modal);
  }
  closeModalcancel(modal: string, option: boolean) {
    if (option) {
      this.cancel(this.idCancel);
    }
    this.modalService.close(modal);
  }
  generateXTF(idIntegration: number) {
    this.serviceWorkspaces.GenerateProductFromIntegration(this.idWorkspace, idIntegration).subscribe(
      response => {
        this.msgIntegrationAssited = response;
        this.toastr.success(this.msgIntegrationAssited.integrationState.description);
        setTimeout(() => {
          this.changeMunucipality();
        }, 2000);
      });
  }
  startIntegrationAssited(idIntegration: number) {
    this.serviceWorkspaces.StartIntegrationAssited(this.idWorkspace, idIntegration).subscribe(
      response => {
        this.msgIntegrationAssited = response;
        this.toastr.success(this.msgIntegrationAssited.integrationState.description);
        setTimeout(() => {
          this.changeMunucipality();
        }, 2000);
      });
  }
  cancel(idIntegration: number) {
    this.serviceWorkspaces.deleteIntegration(this.idWorkspace, idIntegration).subscribe(
      _ => {
        this.toastr.success('Ha eliminado la integración');
        this.serviceWorkspaces.GetIntegrationsByWorkspace(this.idWorkspace).subscribe(
          resp => {
            this.integrationByWorkspace = resp;
            this.integrationByWorkspace.reverse();
          }
        );
      }
    );
  }
  roundDecimal(num: any) {
    return Math.round(num * 100) / 100;
  }
  parcelNumber(number: number) {
    return new Intl.NumberFormat().format(number);
  }
}
