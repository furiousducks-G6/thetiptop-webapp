import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  isLoginMode = true;
  email = '';
  password = '';
  confirmPassword = '';
  name = '';
  firstName = '';
  errorMessage = '';
  successMessage = '';  // Nouveau champ pour le message de succès

  constructor(private authService: AuthService, private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['signup']) {
        this.isLoginMode = false;
      }
    });
  }

  toggleForm(isLoginMode: boolean) {
    this.isLoginMode = isLoginMode;
    this.errorMessage = ''; // Réinitialiser les messages lors du changement de formulaire
    this.successMessage = '';
  }

  validatePassword(password: string): boolean {
    const passwordPattern = /^(?!.*\d{8})^(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    return passwordPattern.test(password);
  }

  onSubmit(e: any) {
    e.preventDefault();
  
    // Valider les champs obligatoires
    if (!this.email || !this.password || (!this.isLoginMode && !this.firstName)) {
      this.errorMessage = 'Veuillez remplir tous les champs obligatoires.';
      return;
    }
  
    // Valider le mot de passe en mode inscription
    if (!this.isLoginMode) {
      if (!this.validatePassword(this.password)) {
        this.errorMessage = 'Le mot de passe doit contenir au moins 8 caractères, incluant une majuscule, un chiffre, et un caractère spécial, et ne doit pas commencer par un chiffre.';
        return;
      }
  
      if (this.password !== this.confirmPassword) {
        this.errorMessage = 'Les mots de passe ne correspondent pas.';
        return;
      }
  
      this.authService.register(this.firstName, this.name, this.email, this.password).subscribe(
        response => {
          if (response.message === 'Utilisateur enregistrer avec succes') {
            this.isLoginMode = true; // Bascule en mode login
            this.successMessage = 'Inscription réussie ! Veuillez vous connecter.'; // Message de succès
            this.email = '';
            this.password = '';
            this.confirmPassword = '';
            this.name = '';
            this.firstName = '';
  
            // Masquer le message après 3 secondes
            setTimeout(() => {
              this.successMessage = '';
            }, 3000);
          } else {
            this.errorMessage = 'Une erreur inattendue s\'est produite lors de l\'inscription.';
          }
        },
        error => {
          if (error.status === 400) {
            this.errorMessage = error.error.message;
          } else {
            this.errorMessage = 'Échec de l\'inscription. Veuillez vérifier vos informations.';
          }
        }
      );
    } else {
      this.authService.login(this.email, this.password).subscribe(
        response => {
          if (response && (response.data && response.data.token) || response.token) {
            const token = response.data?.token || response.token;
            localStorage.setItem("token", token);
  
            // Après avoir stocké le token, récupérez les informations de l'utilisateur
            this.authService.getUserProfile().subscribe(
              user => {
                console.log('Informations utilisateur:', user); // Afficher les informations utilisateur
  
                const role = user.Rle; // Utilisez "Rle" avec un "R" majuscule
                console.log('Rôle utilisateur:', role); // Afficher le rôle pour le diagnostic
  
                // Redirection en fonction du rôle
                switch (role) {
                  case 'A':
                    console.log('Redirection vers /admin/dashboard');
                    this.router.navigate(['/admin/dashboard']);
                    break;
                  case 'C':
                    console.log('Redirection vers /admin/tickets');
                    this.router.navigate(['/user-history']);
                    break;
                  case 'U':
                    console.log('Redirection vers /user-history');
                    this.router.navigate(['/user-history']);
                    break;
                  default:
                    console.error('Rôle utilisateur non reconnu:', role);
                    this.errorMessage = 'Rôle utilisateur non reconnu.';
                    break;
                }
              },
              error => {
                console.error('Erreur lors de la récupération des informations utilisateur:', error);
                this.errorMessage = 'Une erreur est survenue lors de la récupération de votre profil.';
              }
            );
          } else {
            alert("une erreur inattendue s'est produite : token manquant");
          }
        },
        error => {
          this.errorMessage = 'Échec de la connexion. Veuillez vérifier vos informations.';
        }
      );
    }
  }
  
}
