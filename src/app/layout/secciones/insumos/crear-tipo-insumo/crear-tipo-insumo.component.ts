import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { WorkspacesService } from 'src/app/services/workspaces/workspaces.service';
import { ModalService } from 'src/app/services/modal/modal.service';
import { ToastrService } from 'ngx-toastr';
import { Select2OptionData } from 'ng-select2';
import { Options } from 'select2';
@Component({
  selector: 'app-crear-tipo-insumo',
  templateUrl: './crear-tipo-insumo.component.html',
  styleUrls: ['./crear-tipo-insumo.component.scss']
})
export class CrearTipoInsumoComponent implements OnInit {

  @ViewChild('actionForm', { static: false }) actionForm: ElementRef;
  id: number;
  providerProfile: number;
  typeSupplyName: string;
  typeSupplyDescription: string;
  metadataRequired: boolean;
  modelRequired: boolean;
  providerProfiles: any[];
  supplies: any[];
  booleanOptions: { id: boolean; name: string; }[];
  editMode: boolean;
  formOk: boolean;
  activeOtherFormat: boolean;
  extensions: string;
  public exampleData: Array<Select2OptionData>;
  public options: Options;
  public value: string[];
  extensions2: string;
  constructor(
    private serviceWorkspaces: WorkspacesService,
    private modalService: ModalService,
    private toast: ToastrService
  ) {
    this.id = 0;
    this.providerProfile = 0;
    this.typeSupplyName = '';
    this.typeSupplyDescription = '';
    this.metadataRequired = false;
    this.modelRequired = false;
    this.providerProfiles = [];
    this.supplies = [];
    this.booleanOptions = [
      { id: true, name: 'REQUERIDO' },
      { id: false, name: 'NO REQUERIDO' }
    ];
    this.editMode = false;
    this.formOk = false;
    this.activeOtherFormat = false;
    this.extensions = '';
    this.extensions2 = '';
    this.exampleData = [
      {
        id: 'txt',
        text: 'txt'
      },
      {
        id: 'png',
        text: 'png'
      },
      {
        id: 'jpg',
        text: 'jpg'
      },
      {
        id: 'mp4',
        text: 'mp4'
      }
    ];
    this.options = {
      width: '350',
      multiple: true,
      tags: true
    };
  }

  ngOnInit(): void {
    this.serviceWorkspaces.GetProviderProfiles()
      .subscribe((response: any[]) => {
        this.providerProfiles = response;
      });
    this.loadProviderTypeSupplies();
  }

  loadProviderTypeSupplies() {
    this.serviceWorkspaces.GetProviderTypeSupplies()
      .subscribe((response: any[]) => {
        response.sort((a, b) => a.id - b.id);
        this.supplies = response;
      });
  }

  selectTypeSupply(data) {
    this.providerProfile = data.providerProfile.id;
    this.typeSupplyName = data.name;
    this.typeSupplyDescription = data.description;
    this.metadataRequired = data.metadataRequired;
    this.modelRequired = data.modelRequired;
    this.id = data.id;
    let exts = [];
    for (const e of data.extensions) {
      exts.push(e.name);
    }
    this.extensions = exts.join(',');
    console.log(this.extensions);

    this.actionForm.nativeElement.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
    this.editMode = true;
  }

  getObjectTypeSupply() {
    this.activeOtherFormat && this.extensions2 != '' ? this.extensions = this.extensions + ',' + this.extensions2 : this.extensions + '';
    if (this.activeOtherFormat && this.extensions2 != '') {
      const exts = this.extensions.split(',');
      for (const e in exts) {
        exts[e].trim();
      }
      return {
        id: this.id,
        description: this.typeSupplyDescription,
        extensions: exts,
        metadataRequired: this.metadataRequired,
        modelRequired: this.modelRequired,
        name: this.typeSupplyName,
        providerProfileId: this.providerProfile
      };
    } else {
      return {
        id: this.id,
        description: this.typeSupplyDescription,
        extensions: this.extensions,
        metadataRequired: this.metadataRequired,
        modelRequired: this.modelRequired,
        name: this.typeSupplyName,
        providerProfileId: this.providerProfile
      };
    }
  }

  createTypeSupply() {
    this.serviceWorkspaces.CreateTypeSupplies(this.getObjectTypeSupply()).subscribe(response => {
      this.toast.success("Ha creado correctamente el tipo de insumo.");
      this.loadProviderTypeSupplies();
      this.cancel();
    });
  }

  saveTypeSupply() {
    this.serviceWorkspaces.SaveTypeSupplies(this.id, this.getObjectTypeSupply()).subscribe(() => {
      this.toast.success("Ha actualizado correctamente el tipo de insumo.");
      this.cancel();
      this.loadProviderTypeSupplies();
    });
  }

  cancel() {
    this.id = 0;
    this.providerProfile = 0;
    this.typeSupplyName = '';
    this.typeSupplyDescription = '';
    this.metadataRequired = false;
    this.modelRequired = false;
    this.extensions = '';
    this.extensions2 = '';
    this.editMode = false;
    this.formOk = false;
    this.activeOtherFormat = false;
  }

  extensionsToString(exts: any[]) {
    const names = [];
    for (const e of exts) {
      names.push(e.name);
    }
    return names.join(', ');
  }

  deleteTypeSupply(modal: string, id: number) {
    this.modalService.open(modal)
    this.id = id;
  }

  closeModalDisabled(modal: string, option: boolean) {
    if (option) {
      this.serviceWorkspaces.deleteTypeSupplies(this.id).subscribe(
        _ => {
          this.toast.success("Ha eliminado correctamente el tipo de insumo.");
          this.cancel();
          this.loadProviderTypeSupplies();
        }
      );
      this.modalService.close(modal);
    } else {
      this.modalService.close(modal);
    }
  }

  modelChanged() {
    (this.editMode && this.id <= 0) ||
      this.providerProfile <= 0 ||
      this.typeSupplyName == '' ||
      this.extensions == '' ||
      this.typeSupplyDescription == '' ? this.formOk = false : this.formOk = true;
  }
}
