import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  isLoginMode = true;
  email = '';
  password = '';
  nom = '';
  prenom = '';
  username = '';
  errorMessage = '';

  constructor(private authService: AuthService, private router: Router) {}

  toggleForm(isLoginMode: boolean) {
    this.isLoginMode = isLoginMode;
  }

  onSubmit(e:any) {
    e.preventDefault();
    if (this.isLoginMode) {
      this.authService.login(this.email, this.password).subscribe(
        response => {
          if(response.token.length){
            localStorage.setItem("token", response.token) 
            this.router.navigateByUrl('/home');
          } else {
            alert("une erreur inattendue s'est produite")
          }
        },
        error => {
          this.errorMessage = 'Échec de la connexion. Veuillez vérifier vos informations.';
        }
      );
    } else {
      // Logique d'inscription
    }
  }
}
