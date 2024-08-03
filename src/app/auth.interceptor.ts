/*export const AuthInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req);
};*/

import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let authReq = req;
    
    const authToken = this.authService.getToken();
    if (authToken.length) {
        authReq = req.clone({
          setHeaders: {
            Authorization: `Bearer ${authToken}`
          }
        });
    }

    return next.handle(authReq);
  }
}