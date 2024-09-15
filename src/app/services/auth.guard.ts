import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { AuthService } from './auth.service';
import { tap, map, catchError } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
  
    const expectedRoles: string[] = next.data['expectedRole']; // Rôles attendus
    
    return this.authService.getUserProfile().pipe(
      map(user => {
        const userRole = this.authService.getCurrentUserRole(); // Récupère le rôle actuel de l'utilisateur
  
        console.log('Rôles attendus:', expectedRoles); // Debug
        console.log('Rôle utilisateur:', userRole); // Debug
  
        // Vérifie si l'utilisateur est authentifié et si son rôle correspond à l'un des rôles attendus
        if (this.authService.isAuthenticated() && userRole && expectedRoles.includes(userRole)) {
          return true; // Accès autorisé
        } else {
          console.warn(`Accès refusé : rôle attendu (${expectedRoles}), rôle utilisateur actuel (${userRole})`);
          this.router.navigate(['/404']); // Redirection vers une page d'erreur si accès refusé
          return false;
        }
      }),
      catchError(() => {
        this.router.navigate(['/404']); // Redirection en cas d'erreur
        return of(false);
      })
    );
  }
}
