import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import QRCode from 'qrcode';

@Component({
  selector: 'app-user-history',
  templateUrl: './user-history.component.html',
  styleUrls: ['./user-history.component.css']
})
export class UserHistoryComponent implements OnInit {
  lots: any[] = [];
  searchTerm: string = '';
  private apiUrl = 'http://51.68.174.140:8000/api';

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.loadUserLots();
  }

  loadUserLots(): void {
    const token = localStorage.getItem('token');
    if (token) {
      console.log('Token utilisé pour récupérer les lots:', token);
      this.http.get<any[]>(`${this.apiUrl}/user/lot`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }).subscribe(
        data => {
          this.lots = data;
        },
        error => {
          console.error('Erreur lors de la récupération des lots:', error);
          if (error.status === 401 || error.status === 403) {
            this.router.navigate(['/login']);
          }
        }
      );
    } else {
      this.router.navigate(['/login']);
    }
  }

  filteredTickets(): any[] {
    return this.lots.filter(ticket => 
      ticket.code.includes(this.searchTerm) || 
      ticket.prize_name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  printTicket(ticket: any): void {
    const doc = new jsPDF();
  
    // Ajouter le logo
    const logo = new Image();
    logo.src = 'assets/images/logo.png'; // Assurez-vous que le chemin vers le logo est correct
    logo.onload = () => {
        doc.addImage(logo, 'PNG', 15, 10, 50, 20);
  
        // Titre
        doc.setFontSize(18);
        doc.setTextColor(40);
        doc.text('TheTipTop - Reçu de Ticket', 105, 40, { align: 'center' });
  
        // Date d'impression
        doc.setFontSize(12);
        doc.setTextColor(0);
        doc.text(`Date d'impression: ${new Date().toLocaleDateString()}`, 15, 50);
  
        // Détails du Ticket
        doc.setFontSize(14);
        doc.setTextColor(0);
        doc.text('Détails du Ticket', 15, 60);
  
        doc.setFontSize(12);
        doc.text(`Numéro Ticket: ${ticket.code}`, 15, 70);
        doc.text(`Nom du Lot: ${ticket.prize_name}`, 15, 80);
        doc.text(`Valeur du Lot: ${ticket.prize_value} €`, 15, 90);
        doc.text(`Statut: ${ticket.claimed ? 'Retiré' : 'Non Retiré'}`, 15, 100);
  
        // Générer le code QR
        QRCode.toDataURL(ticket.code, { width: 100, height: 100 }, (err: any, qrCodeUrl: string) => {
            if (!err) {
                doc.addImage(qrCodeUrl, 'PNG', 80, 105, 50, 50); // Ajouter le code QR centré
                doc.setFontSize(12);
                doc.setTextColor(100);
                doc.text('Merci de votre participation !', 105, 170, { align: 'center' });
  
                // Sauvegarder le PDF
                doc.save(`Ticket_${ticket.code}.pdf`);
            } else {
                console.error("Erreur lors de la génération du code QR", err);
            }
        });
    };
}

  
  downloadTicketsAsExcel(): void {
    const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.lots);
    const workbook: XLSX.WorkBook = {
      Sheets: { 'Tickets': worksheet },
      SheetNames: ['Tickets']
    };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    this.saveAsExcelFile(excelBuffer, 'Tickets');
  }

  private saveAsExcelFile(buffer: any, fileName: string): void {
    const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const data: Blob = new Blob([buffer], { type: EXCEL_TYPE });
    saveAs(data, `${fileName}_${new Date().getTime()}.xlsx`);
  }

  downloadTicket(ticket: any): void {
    const ticketData = `
      TheTipTop - Reçu de Ticket
  
      Numéro de Ticket: ${ticket.code}
      Nom du Lot: ${ticket.prize_name}
      Valeur du Lot: ${ticket.prize_value} €
      Date: ${new Date().toLocaleDateString()}
  
      Merci de votre participation!
    `;
  
    const blob = new Blob([ticketData], { type: 'text/plain;charset=utf-8' });
    saveAs(blob, `Reçu_${ticket.code}.txt`);
  }
  
}
