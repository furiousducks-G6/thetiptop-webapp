import { Component, HostListener, Inject, PLATFORM_ID } from '@angular/core';
import { ViewportScroller } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import axios from 'axios'; 

import { HttpClient, HttpHeaders } from '@angular/common/http'; // Importer HttpClient et HttpHeaders

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent {
  currentSection: string = 'home';
  private isBrowser: boolean;
  email: string = ''; // Pour stocker l'email de l'utilisateur

  notificationMessage: string = '';
  notificationType: 'success' | 'error' = 'success'; // Success ou Error
  showNotification: boolean = false;

  // Remplacez par votre clé API Mailchimp et ID de liste
  private mailchimpApiKey = 'e25aaf3a78b5076e8ebdac2868056abb-us8';
  private mailchimpListId = 'c6a6cec421';
  private mailchimpDataCenter = 'us8';

  constructor(
    private viewportScroller: ViewportScroller,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: object,
    private http: HttpClient // Injection de HttpClient pour effectuer les requêtes HTTP
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);

    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.updateCurrentSection();
      }
    });
  }

  scrollToSection(sectionId: string): void {
    this.viewportScroller.scrollToAnchor(sectionId);
    this.currentSection = sectionId;
  }

  @HostListener('window:scroll', ['$event'])
  onWindowScroll() {
    if (this.isBrowser) {
      this.updateCurrentSection();
    }
  }

  private updateCurrentSection() {
    if (this.isBrowser) {
      const sections = ['home', 'lots', 'jeux', 'contact'];
      const scrollPosition = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 0 && rect.bottom > 0) {
            this.currentSection = section;
            return;
          }
        }
      }
    }
  }

  // Méthode pour s'inscrire à la newsletter Mailchimp
  isValidEmail(email: string): boolean {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailPattern.test(email);
  }

  // Méthode pour s'inscrire à la newsletter Mailchimp
  subscribeToNewsletter() {
    if (!this.isValidEmail(this.email)) {
      this.showNotificationMessage('Veuillez entrer une adresse e-mail valide.', 'error');
      return;
    }
  
    const url = `https://${this.mailchimpDataCenter}.api.mailchimp.com/3.0/lists/${this.mailchimpListId}/members/`;
    const body = {
      email_address: this.email,
      status: 'subscribed'
    };
  
    // Construire les en-têtes de la requête avec API Key encodée
    const apiKey = this.mailchimpApiKey;
    
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Basic ${btoa(`anystring:${apiKey}`)}` // Encodage en base64 de l'API Key
    };
  
    // Effectuer la requête POST avec Axios
    axios.post(url, body, { headers })
      .then(response => {
        console.log('Inscription réussie:', response);
        this.showNotificationMessage('Merci pour votre inscription à notre newsletter!', 'success');
        this.email = ''; // Réinitialiser le champ d'email après l'inscription
      })
      .catch(error => {
        console.error('Erreur lors de l\'inscription:', error);
        this.showNotificationMessage('Une erreur s\'est produite lors de l\'inscription. Veuillez réessayer.', 'error');
      });
  }
  
  showNotificationMessage(message: string, type: 'success' | 'error') {
    this.notificationMessage = message;
    this.notificationType = type;
    this.showNotification = true;

    // Masquer la notification après 5 secondes
    setTimeout(() => {
      this.showNotification = false;
    }, 5000);
  }

}
