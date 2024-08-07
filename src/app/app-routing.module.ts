import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { LayoutComponent } from './pages/layout/layout.component';
import { HomeComponent } from './pages/home/home.component';

// Définition des routes de l'application
export const routes: Routes = [
  { path: 'login', component: LoginComponent }, // Route pour la page de connexion
  {
    path: '', component: LayoutComponent, children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' }, // Redirection de la racine vers la page d'accueil
      { path: 'home', component: HomeComponent } // Route pour la page d'accueil
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)], // Importation des routes dans le module racine
  exports: [RouterModule] // Exportation du module de routage pour l'utiliser dans l'application
})
export class AppRoutingModule { }
