import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from 'src/environments/environment';

export class JwtHelper {

  static closeSession(router) {
    localStorage.removeItem(environment.nameTokenSession);
    router.navigate(['/login']);
  }

  static getUserPublicInformation() {
    const token = localStorage.getItem(environment.nameTokenSession);
    const helper = new JwtHelperService();
    let decodedToken = null;
    try {
      decodedToken = helper.decodeToken(token);
      
      return decodedToken;
    } catch (error) {
      decodedToken = null;
      return decodedToken;
    }
    // return (decodedToken) ? decodedToken.dataToken : false;
  }

}
