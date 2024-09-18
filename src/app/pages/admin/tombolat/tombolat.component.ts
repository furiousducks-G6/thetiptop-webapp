import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { gsap } from 'gsap';

declare var Winwheel: any; // Déclaration de Winwheel comme variable globale

@Component({
  selector: 'app-tombolat',
  templateUrl: './tombolat.component.html',
  styleUrls: ['./tombolat.component.css']
})
export class TombolatComponent implements OnInit {
  users: any[] = []; // Liste des utilisateurs
  wheel: any; // Instance de la roue
  audio: HTMLAudioElement; // Élément audio pour jouer le son
  showModal: boolean = false; // State to control modal visibility
  winner: string = ''; // Store the winner's email

  constructor(private userService: UserService) {
    this.audio = new Audio('assets/sounds/roulette.mp3'); // Initialisation de l'audio dans le constructeur
  }

  ngOnInit(): void {
    // Récupérer les utilisateurs
    this.userService.getUserGame().subscribe(
      (data) => {
  
        if (Array.isArray(data)) {
          this.users = data.map((user: any) => user.name); // Pas besoin de 'hydra:member' si c'est un tableau simple
          if (this.users.length > 0) {
            this.setupWheel(); // Configurer la roue une fois les utilisateurs chargés
          } else {
            console.error('Aucun utilisateur trouvé');
          }
        } else {
          console.error('Format inattendu de la réponse de l\'API');
        }
      },
      (error) => {
        console.error('Erreur lors de la récupération des utilisateurs :', error);
      }
    );
  }
  
  

  // Configurer la roue
  setupWheel() {
    const segments = this.users.map((user: any) => ({
      text: user,
      fillStyle: '#' + Math.floor(Math.random() * 16777215).toString(16), // Couleur aléatoire pour chaque segment
      textFontSize: 12 // Taille de la police diminuée
    }));

    this.wheel = new Winwheel({
      'canvasId': 'canvas',
      'numSegments': this.users.length,
      'outerRadius': 300, // Augmentation de la taille de la roue
      'segments': segments,
      'textFontSize': 12, // Taille de la police pour tous les segments
      'animation': {
        'type': 'spinToStop',
        'duration': 14, // Durée de la rotation en secondes
        'spins': 8, // Nombre de tours
        'easing': 'power4.out', // Utilisation de l'animation gsap pour l'effet d'arrêt
        'callbackFinished': this.alertPrize.bind(this) // Appeler la fonction lorsqu'elle s'arrête
      }
    });
  }

  // Démarrer la roue et jouer le son
  startWheel() {
    this.audio.play(); // Jouer le son
    this.wheel.startAnimation(); // Lancer l'animation de la roue
  }

  // Afficher le gagnant dans une modal
  alertPrize(indicatedSegment: any) {
    this.winner = indicatedSegment.text;
    this.showModal = true; // Show the modal with the winner's name
  }

  // Fermer la modal
  closeModal() {
    this.showModal = false;
  }
}
