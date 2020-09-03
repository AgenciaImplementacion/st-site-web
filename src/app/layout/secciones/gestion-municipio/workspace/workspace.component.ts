import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { WorkspacesService } from 'src/app/services/workspaces/workspaces.service';
import { ManagersService } from 'src/app/services/managers/managers.service';
import { Router, ActivatedRoute } from '@angular/router';
import { JwtHelper } from 'src/app/helpers/jwt';
import { RoleModel } from 'src/app/helpers/role.model';
import { ToastrService } from 'ngx-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-workspace',
  templateUrl: './workspace.component.html',
  styleUrls: ['./workspace.component.scss']
})
export class WorkspaceComponent implements OnInit {

  activeManagers: any;
  docsSoport: File;
  departments: any;
  munucipalities: any;
  dataCreateWorkSpace: any;
  selectDepartment: number;
  selectMunicipality: number;
  viewCreateWorkSpace: boolean;
  resultWorkSpace: any;
  listWorkSpace: any;
  @ViewChild('myInput')
  myInputVariable: ElementRef;
  constructor(
    private serviceManagers: ManagersService,
    private serviceWorkspaces: WorkspacesService,
    private router: Router,
    private roles: RoleModel,
    private toastr: ToastrService,
    private modalService: NgbModal,
    private activedRoute: ActivatedRoute
  ) {
    this.activeManagers = [];
    this.departments = [];
    this.munucipalities = [];
    this.resultWorkSpace = [];
    this.listWorkSpace = [];
    this.selectDepartment = 0;
    this.selectMunicipality = 0;
    this.viewCreateWorkSpace = false;
    this.dataCreateWorkSpace = {
      selectDepartment: '',
      supportFile: '',
      managerCode: '0',
      municipalityId: '',
      observations: '',
      numberAlphanumericParcels: 0,
      startDate: '',
      municipalityArea: 0
    };
  }

  ngOnInit() {
    this.activedRoute.params.subscribe(
      response => {
        if (response.selectDepartment) {
          this.selectDepartment = Number(response.selectDepartment);
          this.changeDepartament();
          this.selectMunicipality = Number(response.selectMunicipality);
          this.searchWorkSpace();
        }
      }
    );
    const rol = JwtHelper.getUserPublicInformation();
    const role = rol.roles.find(elem => {
      return elem.id === this.roles.administrador;
    });
    if (role) {
      this.serviceManagers.getManagers()
        .subscribe(
          (data: any) => {
            this.activeManagers = data;
          });
    }

    this.serviceWorkspaces.getDepartments()
      .subscribe(response => {
        this.departments = response;
      });
  }
  docSoport(file: File) {
    if (file[0].size / 1024 / 1024 <= environment.sizeFile) {
      var re = /zip*/;
      if (file[0].type.match(re)) {
        this.dataCreateWorkSpace.supportFile = file[0];
      } else {
        if (file[0].size / 1024 / 1024 > environment.sizeFileUnZip) {
          this.toastr.error("Por favor convierta el archivo en .zip antes de subirlo, ya que supera el tamaño de cargue permitido.")
          this.dataCreateWorkSpace.supportFile = '';
          this.myInputVariable.nativeElement.value = "";
        } else {
          this.dataCreateWorkSpace.supportFile = file[0];
        }
      }
    } else {
      this.dataCreateWorkSpace.supportFile = '';
      this.myInputVariable.nativeElement.value = "";
      this.toastr.error("No se puede cargar el archivo, supera el tamaño máximo permitido de 190 MB.");
    }
  }
  changeDepartament() {
    this.dataCreateWorkSpace.selectDepartment = this.selectDepartment;
    this.serviceWorkspaces.GetMunicipalitiesByDeparment(Number(this.dataCreateWorkSpace.selectDepartment)).subscribe(
      data => {
        this.munucipalities = data;
      }
    );
  }
  searchWorkSpace() {
    this.dataCreateWorkSpace.municipalityId = this.selectMunicipality;
    this.serviceWorkspaces.getWorkSpaceByMunicipality(this.selectMunicipality.toString()).subscribe(
      response => {
        this.router.navigate(['/gestion/workspace',
          { selectDepartment: this.selectDepartment, selectMunicipality: this.selectMunicipality }
        ]);
        this.resultWorkSpace = response;
        if (this.resultWorkSpace.length === 0) {
          this.viewCreateWorkSpace = true;
        } else {
          this.viewCreateWorkSpace = false;
          this.listWorkSpace = response;
          this.listWorkSpace.reverse();
        }
      }
    );
  }
  createWorkSpace() {
    const numberAlphanumericParcels = Number.isInteger(this.dataCreateWorkSpace.numberAlphanumericParcels);
    const municipalityArea = Number.isInteger(this.dataCreateWorkSpace.municipalityArea);

    if (this.dataCreateWorkSpace.supportFile === "") {
      this.toastr.error("No se ha cargado ningún soporte.");
    } else if (this.dataCreateWorkSpace.observations == '') {
      this.toastr.error("Las observaciones son obligatorias.");
    } else if (!numberAlphanumericParcels) {
      this.toastr.error("El número de predios debe ser de tipo numérico.");
    } else if (this.dataCreateWorkSpace.numberAlphanumericParcels < 0) {
      this.toastr.error("El número de predios no es correcto.");
    } else if (!municipalityArea) {
      this.toastr.error("El área del municipio debe ser de tipo numérico.");
    } else if (this.dataCreateWorkSpace.municipalityArea < 0) {
      this.toastr.error("El área del municipio no es correcta.");
    } else {
      this.serviceWorkspaces.createWorkspace(this.dataCreateWorkSpace).subscribe(
        _ => {
          this.toastr.success("Se ha asignado el espacio de trabajo para el municipio seleccionado.");
          this.dataCreateWorkSpace = {
            selectDepartment: '',
            supportFile: '',
            managerCode: '0',
            municipalityId: '',
            observations: '',
            numberAlphanumericParcels: 0,
            startDate: '',
            municipalityArea: 0
          };
          this.searchWorkSpace();
        }
      );
    }
  }
  updateWorkSpace() {
    this.router.navigate(['gestion/workspace/' + this.selectMunicipality + '/operador']);
  }
  viewWorkSpace(idItem: number) {
    this.router.navigate(['gestion/workspace/' + idItem + '/ver/operador']);
  }
  openModal(modal: any) {
    this.modalService.open(modal, { centered: true, scrollable: true });
  }
  closeModal(option: boolean) {
    if (option) {
      this.createWorkSpace();
      this.modalService.dismissAll();
    } else {
      this.modalService.dismissAll();
    }
  }
}
