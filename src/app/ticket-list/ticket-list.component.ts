import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import {BackendService, Ticket} from '../backend.service';

@Component({
  selector: 'ticket-list',
  templateUrl: './ticket-list.component.html',
  styleUrls: ['./ticket-list.component.less']
})
export class TicketListComponent implements OnInit {
  private getTickets = new Subject<string>();
  private _filter: string;

  tickets: Ticket[];

  constructor(private backend: BackendService) {
    this.getTickets.pipe(switchMap(filter => this.backend.tickets(filter)))
      .subscribe(tickets=>{
        this.tickets = tickets;
      });
  }

  ngOnInit() {
    this.getTickets.next();
  }

  get filter() {
    return this._filter;
  }
  set filter(val) {
    this._filter = val;
    this.getTickets.next(val);
  }
}
