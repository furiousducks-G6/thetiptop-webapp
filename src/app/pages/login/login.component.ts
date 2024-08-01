import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  isLoginMode = true;

  loginobj:Login;


  constructor() {
    this.loginobj = new Login()
  }

  ngOnInit(): void {
    console.log('LoginComponent initialized');
  }

  toggleForm(isLogin: boolean) {
    this.isLoginMode = isLogin;
    console.log('isLoginMode:', this.isLoginMode);
  }

  onSubmit() {
    if (this.isLoginMode) {
      console.log('Trying to log in');
      // Logique de connexion ici
    } else {
      console.log('Trying to create an account');
      // Logique d'inscription ici
    }
  }
}

export class Login{
  Email: string;
  Password: string;

  constructor(){
    this.Email='';
    this.Password=''
  }
}
