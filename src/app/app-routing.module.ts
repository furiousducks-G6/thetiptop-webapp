import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { LayoutComponent } from './pages/layout/layout.component';
import { HomeComponent } from './pages/home/home.component';
import { ContactComponent } from './pages/contact/contact.component';
import { ProfilComponent } from './pages/utilisateur/profil/profil.component';
import { UserHistoryComponent } from './pages/utilisateur/user-history/user-history.component';
import { LayoutadminComponent } from './pages/admin/layoutadmin/layoutadmin.component'; // Import du LayoutAdmin
import { DashboardComponent } from './pages/admin/dashboard/dashboard.component';
import { TicketsComponent } from './pages/admin/tickets/tickets.component';
import { LotsComponent } from './pages/admin/lots/lots.component';
import { CgvComponent } from './pages/cgv/cgv.component';
import { MentionlegaleComponent } from './pages/mentionlegale/mentionlegale.component';
import { AideComponent } from './pages/aide/aide.component';
import { UserComponent } from './pages/admin/user/user.component';
import { PageNotFoundComponent } from './pages/page-not-found/page-not-found.component'; // Import du composant 404

// Définition des routes de l'application
export const routes: Routes = [
  { path: 'login', component: LoginComponent }, // Route pour la page de connexion
  
  {
    path: '', component: LayoutComponent, children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' }, // Redirection de la racine vers la page d'accueil
      { path: 'home', component: HomeComponent }, // Route pour la page d'accueil
      { path: 'contact', component: ContactComponent },
      { path: 'profil', component: ProfilComponent },
      { path: 'user-history', component: UserHistoryComponent },
      { path: 'cgv', component: CgvComponent },
      { path: 'legacy', component: MentionlegaleComponent },
      { path: 'help', component: AideComponent },
    ]
  },

  {
    path: 'admin', component: LayoutadminComponent, children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'tickets', component: TicketsComponent },
      { path: 'lots', component: LotsComponent },
      { path: 'user', component: UserComponent },
    ]
  },
  { path: '404', component: PageNotFoundComponent },
  { path: '**', redirectTo: '/404' } 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)], // Importation des routes dans le module racine
  exports: [RouterModule] // Exportation du module de routage pour l'utiliser dans l'application
})
export class AppRoutingModule { }
