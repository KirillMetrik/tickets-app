import { Component, Input } from '@angular/core';
import { Ticket } from '../backend.service';

@Component({
  selector: 'ticket',
  templateUrl: './ticket.component.html',
  styleUrls: ['./ticket.component.less']
})
export class TicketComponent {
  @Input() model: Ticket;
}
