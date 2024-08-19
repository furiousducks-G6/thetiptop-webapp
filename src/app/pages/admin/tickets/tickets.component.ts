import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-tickets',
  templateUrl: './tickets.component.html',
  styleUrls: ['./tickets.component.css']
})
export class TicketsComponent implements OnInit {
  tickets = this.getMockTickets(); // Simulez des données de tickets
  searchTerm = ''; // Propriété pour la recherche
  itemsPerPage = 10; // Nombre d'éléments par page
  currentPage = 1; // Page actuelle
  pages: (number | string)[] = []; // Tableau des pages

  ngOnInit(): void {
    this.calculatePagination();
  }

  getMockTickets() {
    // Générer 150 tickets fictifs
    return Array.from({ length: 150 }, (_, i) => ({
      lotID: Math.floor(Math.random() * 10) + 1,
      code: `TCKT-${i + 1}`,
      is_claimed: Math.random() > 0.5
    }));
  }

  filteredTickets() {
    let filtered = this.tickets;

    if (this.searchTerm) {
      filtered = filtered.filter(ticket => 
        ticket.code.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        ticket.lotID.toString().includes(this.searchTerm)
      );
    }

    return filtered.slice((this.currentPage - 1) * this.itemsPerPage, this.currentPage * this.itemsPerPage);
  }

  calculatePagination() {
    const totalPages = Math.ceil(this.tickets.length / this.itemsPerPage);
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

  goToPage(page: number | string) {
    if (typeof page === 'number') {
      this.currentPage = page;
      this.calculatePagination();
    }
  }

  printTicket(ticket: any) {
    const printContent = `
      <h1>Ticket: ${ticket.code}</h1>
      <p>Lot ID: ${ticket.lotID}</p>
      <p>Status: ${ticket.is_claimed ? 'Validé' : 'Non Validé'}</p>
    `;
    const printWindow = window.open('', '', 'height=400,width=800');
    if (printWindow) {
      printWindow.document.write('<html><head><title>Imprimer le Ticket</title></head><body>');
      printWindow.document.write(printContent);
      printWindow.document.write('</body></html>');
      printWindow.document.close();
      printWindow.print();
    }
  }

  exportTicket(ticket: any) {
    const dataStr = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(ticket))}`;
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `ticket_${ticket.code}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  }
}
