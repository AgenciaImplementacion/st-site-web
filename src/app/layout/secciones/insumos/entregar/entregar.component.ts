import { Component, OnInit } from '@angular/core';
import { JwtHelper } from 'src/app/helpers/jwt';
import { RoleModel } from 'src/app/helpers/role.model';
import { WorkspacesService } from 'src/app/services/workspaces/workspaces.service';
import { FuntionsGlobalsHelper } from 'src/app/helpers/funtionsGlobals';
import { ToastrService } from 'ngx-toastr';
import { ModalService } from 'src/app/services/modal/modal.service';
@Component({
  selector: 'app-entregar',
  templateUrl: './entregar.component.html',
  styleUrls: ['./entregar.component.scss']
})
export class EntregarComponent implements OnInit {

  usermanager: boolean;
  departments: any;
  selectDepartment: string;
  munucipalities: any;
  selectMunicipality: number;
  suppliesManagerRequest: any;
  selectSuppliesManagerRequest: any;
  allSupplies: any;
  size: any;
  number: any;
  totalElements: any;
  idSupplieDelete: number;
  deliverySupplies: any;
  sendSuppliesFilter: boolean;
  idWorkSpace: number;
  searchText: string;
  enabledButton: Boolean;
  constructor(
    private roles: RoleModel,
    private serviceWorkspaces: WorkspacesService,
    private toastr: ToastrService,
    private modalService: ModalService
  ) {
    this.usermanager = false;
    this.departments = [];
    this.selectDepartment = '0';
    this.munucipalities = [];
    this.selectMunicipality = 0;
    this.suppliesManagerRequest = [];
    this.allSupplies = [];
    this.size = 20;
    this.number = 0;
    this.totalElements = 0;
    this.idSupplieDelete = 0;
    this.deliverySupplies = {
      observations: "",
      supplies: []
    }
    this.sendSuppliesFilter = true;
    this.idWorkSpace = 0;
    this.enabledButton = true;
  }

  ngOnInit() {
    const rol = JwtHelper.getUserPublicInformation();
    const role = rol.roles.find(elem => {
      return elem.id === this.roles.gestor;
    });
    if (role) {
      this.usermanager = true;
    }
    this.serviceWorkspaces.getDepartments()
      .subscribe(response => {
        this.departments = response;
      });
  }
  globalFuntionDate(date: any) {
    return FuntionsGlobalsHelper.formatDate(date);
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
      (response: any) => {
        this.idWorkSpace = response.id;
        this.sendSuppliesFilter = false;
      }
    );
  }
  getPage(page: string) {
    this.serviceWorkspaces.GetSuppliesByMunicipalityFilter(this.selectMunicipality, page).subscribe(
      (response: any) => {
        this.number = response.number + 1;
        this.size = response.size;
        this.totalElements = response.totalElements;
        this.allSupplies = response.items;
      }
    );
  }
  builddelivery(item: any, state: boolean) {
    if (this.usermanager) {
      if (state) {
        let comprobarID = this.deliverySupplies.supplies.find(
          element => {
            return element.supplyId == item.id
          }
        );
        if (comprobarID) {
          this.deliverySupplies.supplies.forEach(element => {
            if (item.id == element.supplyId) {
              element.observations = item.observationsTosupplie
            }
          });
          this.clickCheckBox();
        } else {
          this.deliverySupplies.supplies.push({
            supplyId: item.id,
            observations: item.observationsTosupplie ? item.observationsTosupplie : ""
          });
          this.clickCheckBox();
        }
      } else {
        this.deliverySupplies.supplies = this.deliverySupplies.supplies.filter(e => e.supplyId !== item.id);
        this.clickCheckBox();
      }


    } else {
      this.toastr.error("No tienes los permisos necesarios para entregar el insumo.");
    }

  }
  sendSupplies() {
    if (this.deliverySupplies.supplies.length > 0) {
      if (this.deliverySupplies.observations.length > 0) {
        const data = this.deliverySupplies.supplies.find(element => {
          return element.observations === '';
        });
        if (data) {
          this.toastr.error("Te faltan algunas observaciones");
        } else {
          this.serviceWorkspaces.deliveriesSupplies(this.idWorkSpace, this.deliverySupplies).subscribe(
            _ => {
              this.toastr.success("Se ha realizado la entrega de los insumos al operador");
              this.getPage('1');
              this.deliverySupplies = {
                observations: "",
                supplies: []
              }
              this.enabledButton = true;
            }
          );
        }
      } else {
        this.toastr.error("Las observaciones generales son obligatorias")
      }
    } else {
      this.toastr.error("No has seleccionado ningún insumo, ó te faltan las observaciones")
    }
  }
  openModal(modal: string) {
    this.modalService.open(modal);
  }
  closeModal(modal: string, option: boolean) {
    if (option) {
      this.sendSupplies();
      this.modalService.close(modal);
    } else {
      this.modalService.close(modal);
    }
  }
  clickCheckBox() {
    if (this.deliverySupplies.supplies.length > 0) {

      if (this.deliverySupplies.observations != "") {

        const data = this.deliverySupplies.supplies.find(element => {
          return element.observations == "";
        });
        if (data) {
          this.enabledButton = true;
        } else {
          this.enabledButton = false;
        }
      } else {
        this.enabledButton = true;
      }
    } else {
      this.enabledButton = true;
    }
  }
}
