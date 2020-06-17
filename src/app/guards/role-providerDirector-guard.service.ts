
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, Route } from '@angular/router';
import { Observable } from 'rxjs';
import { JwtHelper } from '../helpers/jwt';
import { RoleModel } from '../helpers/role.model';
@Injectable()
export class RoleProviderDirectorGuard implements CanActivate {

  rol: any;

  constructor(private roles: RoleModel, private router: Router) {
    this.rol = JwtHelper.getUserPublicInformation();
  }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot):
    Observable<boolean> | Promise<boolean> | boolean {
    if (this.rol.is_provider_director) {
      const role = this.rol.roles.find(elem => {
        return elem.id === this.roles.proveedor;
      });
      if (!role) {
        this.router.navigate(['/inicio']);
      } else {
        return true;
      }
    } else {
      this.router.navigate(['/inicio']);
    }
  }
}