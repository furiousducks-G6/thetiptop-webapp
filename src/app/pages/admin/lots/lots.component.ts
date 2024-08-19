import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-lots',
  templateUrl: './lots.component.html',
  styleUrls: ['./lots.component.css']
})
export class LotsComponent implements OnInit {
  lots = this.getMockLots(); // Simulate lots data
  searchTerm = ''; // Property for search term
  itemsPerPage = 10; // Number of items per page
  currentPage = 1; // Current page number
  pages: (number | string)[] = []; // Array for pagination pages

  ngOnInit(): void {
    this.calculatePagination();
  }

  getMockLots() {
    // Generate 50 mock lots
    return Array.from({ length: 50 }, (_, i) => ({
      name: `Lot ${i + 1}`,
      value: (Math.random() * 1000).toFixed(2),
      pourcentage: Math.floor(Math.random() * 100)
    }));
  }

  filteredLots() {
    let filtered = this.lots;

    if (this.searchTerm) {
      filtered = filtered.filter(lot => 
        lot.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        lot.value.toString().includes(this.searchTerm) ||
        lot.pourcentage.toString().includes(this.searchTerm)
      );
    }

    return filtered.slice((this.currentPage - 1) * this.itemsPerPage, this.currentPage * this.itemsPerPage);
  }

  calculatePagination() {
    const totalPages = Math.ceil(this.lots.length / this.itemsPerPage);
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

  printLot(lot: any) {
    const printContent = `
      <h1>Lot: ${lot.name}</h1>
      <p>Valeur: ${lot.value} €</p>
      <p>Pourcentage: ${lot.pourcentage}%</p>
    `;
    const printWindow = window.open('', '', 'height=400,width=800');
    if (printWindow) {
      printWindow.document.write('<html><head><title>Imprimer le Lot</title></head><body>');
      printWindow.document.write(printContent);
      printWindow.document.write('</body></html>');
      printWindow.document.close();
      printWindow.print();
    }
  }

  exportLot(lot: any) {
    const dataStr = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(lot))}`;
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `lot_${lot.name}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  }
}
