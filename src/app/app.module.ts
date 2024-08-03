import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { LoginComponent } from './pages/login/login.component';
import { LayoutComponent } from './pages/layout/layout.component';
import { HomeComponent } from './pages/home/home.component';

@NgModule({
  declarations: [
    LoginComponent,
    LayoutComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule, // Assurez-vous que ceci est importé
    AppRoutingModule
  ],
  providers: [
    provideClientHydration()
  ],
  bootstrap: [] // Retirez AppComponent de ici
})
export class AppModule { }
