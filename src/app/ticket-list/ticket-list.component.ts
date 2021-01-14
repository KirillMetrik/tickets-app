import { AfterViewInit, Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { BackendService, Ticket } from '../backend.service';

@Component({
    selector: 'ticket-list',
    templateUrl: './ticket-list.component.html',
    styleUrls: ['./ticket-list.component.less']
})
export class TicketListComponent implements AfterViewInit {

    filterControl = new FormControl('');
    tickets: Observable<Ticket[]>;

    constructor(private backend: BackendService) {
        this.tickets = this.filterControl.valueChanges.pipe(switchMap(filter => this.backend.tickets(filter)));
    }

    ngAfterViewInit() {
        this.filterControl.setValue('');
    }
}
