import { Component, OnInit } from '@angular/core';
import { NewsletterService } from '../../../services/newsletter.service'; // Assurez-vous que le chemin est correct

@Component({
  selector: 'app-newsletter',
  templateUrl: './newsletter.component.html',
  styleUrls: ['./newsletter.component.css']
})
export class NewsletterComponent implements OnInit {
  subscribers: any[] = []; // Tableau pour stocker les abonnés
  searchTerm = ''; // Terme de recherche
  itemsPerPage = 10; // Nombre d'éléments par page
  currentPage = 1; // Page courante
  pages: (number | string)[] = []; // Tableau de pagination

  constructor(private newsletterService: NewsletterService) {}

  ngOnInit(): void {
    this.loadSubscribers(); // Chargement initial des abonnés
  }

  // Charger tous les abonnés à la newsletter
  loadSubscribers() {
    this.newsletterService.getAllSubscribedEmails().subscribe(
      (data) => {
        this.subscribers = data; // Stocker les abonnés
        this.calculatePagination(); // Calculer la pagination
      },
      (error) => {
        console.error('Erreur lors du chargement des abonnés :', error);
      }
    );
  }

  // Filtrer les abonnés en fonction du terme de recherche
  filteredSubscribers() {
    let filtered = this.subscribers;

    if (this.searchTerm) {
      filtered = filtered.filter(subscriber => 
        subscriber.email.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }

    // Pagination des abonnés filtrés
    return filtered.slice((this.currentPage - 1) * this.itemsPerPage, this.currentPage * this.itemsPerPage);
  }

  // Calculer la pagination
  calculatePagination() {
    const totalPages = Math.ceil(this.subscribers.length / this.itemsPerPage);
    const pagesArray: (number | string)[] = [];

    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= this.currentPage - 1 && i <= this.currentPage + 1)) {
        pagesArray.push(i);
      } else if (pagesArray[pagesArray.length - 1] !== '...') {
        pagesArray.push('...');
      }
    }
    this.pages = pagesArray;
  }

  // Aller à une page spécifique
  goToPage(page: number | string) {
    if (typeof page === 'number') {
      this.currentPage = page;
      this.calculatePagination();
    }
  }

  // Désinscrire un abonné
  unsubscribe(email: string) {
    this.newsletterService.unsubscribeFromNewsletter(email).subscribe(
      () => {
        // Retirer l'abonné de la liste après désinscription
        this.subscribers = this.subscribers.filter(subscriber => subscriber.email !== email);
        this.calculatePagination(); // Recalculer la pagination après modification
      },
      (error) => {
        console.error('Erreur lors de la désinscription :', error);
      }
    );
  }

  // Fonctionnalité pour ajouter un abonné (peut être modifiée en fonction des besoins)
  addSubscriber() {
    console.log('Ajouter un abonné');
    // Implémenter l'ajout d'un nouvel abonné si nécessaire
  }
}
