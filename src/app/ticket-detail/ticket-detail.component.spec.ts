import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { BackendService, Ticket, User } from '../backend.service';
import { TicketDetailComponent } from './ticket-detail.component';

describe('TicketDetailComponent', () => {
    let fixture: ComponentFixture<TicketDetailComponent>;
    let route: ActivatedRoute;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                RouterTestingModule,
                ReactiveFormsModule
            ],
            declarations: [
                TicketDetailComponent
            ],
            providers: [{
                provide: BackendService,
                useClass: MockBackendService
            }]
        }).compileComponents();

        fixture = TestBed.createComponent(TicketDetailComponent);
        route = fixture.debugElement.injector.get(ActivatedRoute);
    }));

    it('should create correct title when opening existing ticket', () => {
        route.params = of({ id: 1 });
        fixture.componentInstance.ngOnInit();
        fixture.componentInstance.ticket.subscribe();

        expect(fixture.componentInstance.title).toBe('Ticket Details');
        expect(fixture.componentInstance.isAdd).toBe(false);
    });

    it('should create correct title when opening an empty ticket (creating a new one)', () => {
        route.params = of({ });
        fixture.componentInstance.ngOnInit();
        fixture.componentInstance.ticket.subscribe();

        expect(fixture.componentInstance.title).toBe('New Ticket');
        expect(fixture.componentInstance.isAdd).toBe(true);
    });

    it('should not save anything when busy', () => {
        fixture.componentInstance.isBusy = true;
        const addTicket = spyOn(fixture.componentInstance, 'addTicket');
        const updateTicket = spyOn(fixture.componentInstance, 'updateTicket');
        addTicket.and.returnValue(of(null));
        updateTicket.and.returnValue(of(null));

        fixture.componentInstance.submit();
        expect(addTicket).not.toHaveBeenCalled();
        expect(updateTicket).not.toHaveBeenCalled();
    });

    it('should call newTicket on backend when creating a ticket', () => {
        route.params = of({});
        fixture.componentInstance.ngOnInit();
        fixture.componentInstance.ticket.subscribe();

        const backend = fixture.debugElement.injector.get(BackendService);
        const newTicket = spyOn(backend, 'newTicket');
        const assign = spyOn(backend, 'assign');
        const complete = spyOn(backend, 'complete');
        newTicket.and.returnValue(of(null));

        fixture.componentInstance.submit();
        expect(newTicket).toHaveBeenCalled();
        expect(assign).not.toHaveBeenCalled();
        expect(complete).not.toHaveBeenCalled();
    });

    it('should call assign and complete on backend when updating a ticket', () => {
        route.params = of({ id: 1 });
        fixture.componentInstance.ngOnInit();
        fixture.componentInstance.ticket.subscribe();

        const backend = fixture.debugElement.injector.get(BackendService);
        const newTicket = spyOn(backend, 'newTicket');
        const assign = spyOn(backend, 'assign');
        const complete = spyOn(backend, 'complete');
        assign.and.returnValue(of(null));
        complete.and.returnValue(of(null));

        fixture.componentInstance.submit();
        expect(assign).toHaveBeenCalled();
        expect(complete).toHaveBeenCalled();
        expect(newTicket).not.toHaveBeenCalled();
    });
});

class MockBackendService extends BackendService {

    private mockedTickets: Ticket[] = [{
        id: 0,
        description: '',
        assigneeId: 111,
        completed: false
    }];

    private mockedUsers: User[] = [{ id: 111, name: 'Victor' }];

    tickets(filter?: string) {
        return of(this.mockedTickets);
    }

    ticket(id: number) {
        return of(this.mockedTickets[0]);
    }

    users() {
        return of(this.mockedUsers);
    }

    user(id: number) {
        return of(this.mockedUsers[0]);
    }

    newTicket(payload: { description: string, assigneeId?: number }) {
        return of(this.mockedTickets[0]);
    }

    assign(ticketId: number, userId: number) {
        return of(this.mockedTickets[0]);
    }

    complete(ticketId: number, completed: boolean) {
        return of(this.mockedTickets[0]);
    }
}