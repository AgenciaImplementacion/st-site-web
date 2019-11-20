import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WorkspacesService {

  url: string;
  constructor(private httpClient: HttpClient) {
    this.url = environment.apiBaseUrlPrefix;
  }

  /**
   * getDepartments
   */
  public getDepartments() {
    return this.httpClient.get(this.url + '/workspaces/v1/departments');
  }
  /**
   * GetMunicipalitiesByDeparment
   */
  public GetMunicipalitiesByDeparment(idDepartament: string) {
    return this.httpClient.get(this.url + '/workspaces/v1/departments/' + idDepartament + '/municipalities');
  }
  /**
   * getWorkSpaceByMunicipality
   */
  public getWorkSpaceByMunicipality(idMunicipality: string) {
    return this.httpClient.get(this.url + '/workspaces/v1/workspaces/municipalities/' + idMunicipality);
  }
  /**
   * CreateWorkspace
   */
  public createWorkspace(data: any) {
    const form = new FormData();
    form.append('supportFile', data.supportFile);
    form.append('managerCode', data.managerCode);
    form.append('municipalityId', data.municipalityId);
    form.append('observations', data.observations);
    form.append('numberAlphanumericParcels', data.numberAlphanumericParcels);
    form.append('startDate', data.startDate);
    form.append('municipalityArea', data.municipalityArea);
    return this.httpClient.post(this.url + '/workspaces/v1/workspaces', form);
  }
}
