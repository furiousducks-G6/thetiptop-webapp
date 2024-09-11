import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { LayoutComponent } from './pages/layout/layout.component';
import { HomeComponent } from './pages/home/home.component';
import { ContactComponent } from './pages/contact/contact.component';
import { ProfilComponent } from './pages/utilisateur/profil/profil.component';
import { UserHistoryComponent } from './pages/utilisateur/user-history/user-history.component';
import { LayoutadminComponent } from './pages/admin/layoutadmin/layoutadmin.component'; 
import { DashboardComponent } from './pages/admin/dashboard/dashboard.component';
import { TicketsComponent } from './pages/admin/tickets/tickets.component';
import { LotsComponent } from './pages/admin/lots/lots.component';
import { LotComponent } from './pages/lot/lot.component';
import { JeuxComponent } from './pages/jeux/jeux.component';
import { CgvComponent } from './pages/cgv/cgv.component';
import { MentionlegaleComponent } from './pages/mentionlegale/mentionlegale.component';
import { AideComponent } from './pages/aide/aide.component';
import { UserComponent } from './pages/admin/user/user.component';
import { PageNotFoundComponent } from './pages/page-not-found/page-not-found.component'; 
import { TombolatComponent } from './pages/admin/tombolat/tombolat.component'; 
import { ProfiladminComponent } from './pages/admin/profiladmin/profiladmin.component';
import { AuthGuard } from './services/auth.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: '', component: LayoutComponent, children: [
      { path: '', component: HomeComponent },
      { path: 'home', component: HomeComponent },
      { path: 'contact', component: ContactComponent },
      { path: 'profil', component: ProfilComponent, canActivate: [AuthGuard], data: { expectedRole: ['U'] } },
      { path: 'user-history', component: UserHistoryComponent, canActivate: [AuthGuard], data: { expectedRole: ['U'] } },
      { path: 'cgu', component: CgvComponent },
      { path: 'legacy', component: MentionlegaleComponent },
      { path: 'help', component: AideComponent },
      { path: 'lots', component: LotComponent },
      { path: 'jeux', component: JeuxComponent },
    ]
  },
  {
    path: 'admin', component: LayoutadminComponent, children: [
      { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard], data: { expectedRole: ['A'] } },
      { path: 'tickets', component: TicketsComponent, canActivate: [AuthGuard], data: { expectedRole: ['A', 'C'] } },
      { path: 'lots', component: LotsComponent, canActivate: [AuthGuard], data: { expectedRole: ['A'] } },
      { path: 'user', component: UserComponent, canActivate: [AuthGuard], data: { expectedRole: ['A'] } },
      { path: 'raffle', component: TombolatComponent, canActivate: [AuthGuard], data: { expectedRole: ['A'] } },
      { path: 'myprofil', component: ProfiladminComponent, canActivate: [AuthGuard], data: { expectedRole: ['A', 'C'] } },
    ]
  },
  { path: '**', component: PageNotFoundComponent },
];
@NgModule({
  imports: [RouterModule.forRoot(routes)], // Importation des routes dans le module racine
  exports: [RouterModule] // Exportation du module de routage pour l'utiliser dans l'application
})
export class AppRoutingModule { }
