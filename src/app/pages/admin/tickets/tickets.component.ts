import { Component, OnInit } from '@angular/core';
import { TicketService } from '../../../services/ticket.service';

@Component({
  selector: 'app-tickets',
  templateUrl: './tickets.component.html',
  styleUrls: ['./tickets.component.css']
})
export class TicketsComponent implements OnInit {
  tickets: any[] = [];
  searchTerm = '';
  itemsPerPage = 10;
  currentPage = 1;
  pages: (number | string)[] = [];
  totalItems = 0;

  constructor(private ticketService: TicketService) {}

  ngOnInit(): void {
    this.loadTickets();
  }

  loadTickets() {
    this.ticketService.getTickets(this.currentPage, this.itemsPerPage).subscribe(
      (data) => {
        this.tickets = data.tickets;
        this.totalItems = data.totalItems;
        this.calculatePagination();
      },
      (error) => {
        console.error('Erreur lors du chargement des tickets :', error);
      }
    );
  }

  filteredTickets() {
    let filtered = this.tickets;

    if (this.searchTerm) {
      filtered = filtered.filter(ticket => 
        ticket.code.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        ticket.lot.id.toString().includes(this.searchTerm) ||
        (ticket.user && ticket.user.firstName.toLowerCase().includes(this.searchTerm.toLowerCase()))
      );
    }

    // Pagination logic: Only return the items for the current page
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return filtered.slice(startIndex, endIndex);
  }

  calculatePagination() {
    const totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
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
      this.loadTickets();
    }
  }

  onItemsPerPageChange() {
    this.currentPage = 1;  // Reset to the first page
    this.loadTickets();  // Reload the tickets with the new itemsPerPage value
    this.calculatePagination(); // Recalculate the pagination with the new itemsPerPage
  }

  printTicket(ticket: any) {
    const printContent = `
      <h1>Ticket: ${ticket.code}</h1>
      <p>Lot ID: ${ticket.lot.id}</p>
      <p>Status: ${ticket.is_claimed ? 'Validé' : 'Non Validé'}</p>
      <p>Utilisateur: ${ticket.user ? ticket.user.firstName : 'Non assigné'}</p>
      <p>Téléphone: ${ticket.user ? ticket.user.phone : 'Non assigné'}</p>
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
