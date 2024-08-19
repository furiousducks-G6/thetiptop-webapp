import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  users: any[] = [];
  filteredUsers: any[] = [];
  currentPage = 1;
  totalPages = 1;
  pages: number[] = [];
  searchTerm: string = '';
  selectedRole: string = '';
  itemsPerPage: number = 10;

  constructor() {}

  ngOnInit(): void {
    this.users = this.getMockUsers();
    this.totalPages = Math.ceil(this.users.length / this.itemsPerPage);
    this.filterUsers();
    this.generatePagesArray();
  }

  getMockUsers() {
    return Array.from({ length: 100 }, (_, i) => ({
      firstName: `UserFirstName${i + 1}`,
      lastName: `UserLastName${i + 1}`,
      email: `user${i + 1}@example.com`,
      phone: `+123456789${i}`,
      role: i % 2 === 0 ? 'Admin' : 'User',
    }));
  }

  filterUsers(): void {
    const filtered = this.users.filter(user => 
      (!this.searchTerm || user.firstName.toLowerCase().includes(this.searchTerm.toLowerCase()) || user.lastName.toLowerCase().includes(this.searchTerm.toLowerCase())) &&
      (!this.selectedRole || user.role === this.selectedRole)
    );

    this.totalPages = Math.ceil(filtered.length / this.itemsPerPage);
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.filteredUsers = filtered.slice(startIndex, endIndex);
    this.generatePagesArray();
  }

  generatePagesArray() {
    const totalPagesToShow = 5;
    if (this.totalPages <= totalPagesToShow) {
      this.pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);
    } else {
      this.pages = [];
      const startPage = Math.max(2, this.currentPage - 1);
      const endPage = Math.min(this.totalPages - 1, this.currentPage + 1);

      this.pages.push(1);

      if (startPage > 2) {
        this.pages.push(-1); // Placeholder for "..."
      }

      for (let i = startPage; i <= endPage; i++) {
        this.pages.push(i);
      }

      if (endPage < this.totalPages - 1) {
        this.pages.push(-2); // Placeholder for "..."
      }

      this.pages.push(this.totalPages);
    }
  }

  goToPage(page: number) {
    if (page > 0) {
      this.currentPage = page;
      this.filterUsers();
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.goToPage(this.currentPage - 1);
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.goToPage(this.currentPage + 1);
    }
  }

  onItemsPerPageChange() {
    this.currentPage = 1; // Reset to first page
    this.filterUsers();
  }

  printUsers() {
    const printContent = document.getElementById('user-table')?.outerHTML;
    const printWindow = window.open('', '_blank', 'width=800,height=600');
    
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Print Users</title>
            <style>
              body {
                font-family: Arial, sans-serif;
                margin: 0;
                padding: 20px;
              }
              table {
                width: 100%;
                border-collapse: collapse;
                margin-bottom: 20px;
              }
              th, td {
                border: 1px solid #ddd;
                padding: 8px;
                text-align: left;
              }
              th {
                background-color: #f2f2f2;
              }
            </style>
          </head>
          <body>
            ${printContent || ''}
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
      printWindow.close();
    }
  }
  

  exportUsers() {
    const csvContent = "data:text/csv;charset=utf-8,"
      + this.filteredUsers.map(user => `${user.firstName},${user.lastName},${user.email},${user.phone},${user.role}`).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "users.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
