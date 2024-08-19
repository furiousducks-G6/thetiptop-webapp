import { Component, OnInit } from '@angular/core';
import { LotService } from '../../../services/lot.service';
import { TicketService } from '../../../services/ticket.service';
import { UserService } from '../../../services/user.service';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  ticketsCount: number = 0;
  validatedTicketsCount: number = 0;
  lotsCount: number = 0;
  usersCount: number = 0;
  cashiersCount: number = 0;
  adminsCount: number = 0;

  constructor(
    private lotService: LotService,
    private ticketService: TicketService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    // Charger les tickets
    this.ticketService.getTickets().subscribe(tickets => {
      this.ticketsCount = tickets.length;
      this.validatedTicketsCount = tickets.filter(ticket => ticket.is_claimed).length;
    });

    // Charger les lots
    this.lotService.getLots().subscribe(lots => {
      this.lotsCount = lots.length;
    });

    // Charger les utilisateurs
    this.userService.getUsers().subscribe(users => {
      this.usersCount = users.filter(user => user.rle === 'U').length;
      this.cashiersCount = users.filter(user => user.rle === 'C').length;
      this.adminsCount = users.filter(user => user.rle === 'A').length;
    });
  }
}