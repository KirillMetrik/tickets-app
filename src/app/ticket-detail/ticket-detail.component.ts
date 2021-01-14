import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin, Observable, Subscription } from 'rxjs';
import { finalize, flatMap, take, tap } from 'rxjs/operators';
import { BackendService, Ticket } from '../backend.service';

@Component({
    selector: 'ticket-detail',
    templateUrl: './ticket-detail.component.html',
    styleUrls: ['./ticket-detail.component.less']
})
export class TicketDetailComponent implements OnInit, OnDestroy {
    private subscrSubmit: Subscription;

    form = this.formBuilder.group({
        'description': [],
        'assigneeId': [],
        'completed': []
    });

    id: number;
    isBusy = false;
    ticket: Observable<Ticket>;

    users = this.backend.users();

    constructor(
        private backend: BackendService,
        private formBuilder: FormBuilder,
        private router: Router,
        private route: ActivatedRoute) { }

    get isAdd() {
        return this.id == null;
    }

    ngOnInit() {
        this.ticket = this.route.params.pipe(
            take(1),
            flatMap(p => {
                this.id = p['id'];
                return this.isAdd ? null : this.backend.ticket(this.id);
            }),
            tap(t => this.form.patchValue(t))
        );
    }

    submit() {
        if (this.isBusy) {
            return;
        }

        this.isBusy = true;
        const fn = (this.isAdd ? this.addTicket : this.updateTicket).bind(this);
        this.subscrSubmit = fn()
            .pipe(finalize(() => this.isBusy = false))
            .subscribe(() => {
                this.isBusy = false;
                this.router.navigate(['/'])
            });
    }

    ngOnDestroy() {
        this.subscrSubmit?.unsubscribe();
    }

    addTicket() {
        return this.backend.newTicket({
            description: this.form.controls.description.value,
            assigneeId: this.form.controls.assigneeId.value
        });
    }

    updateTicket() {
        return forkJoin({
            assign: this.backend.assign(this.id, this.form.controls.assigneeId.value),
            complete: this.backend.complete(this.id, this.form.controls.completed.value)
        });
    }
}
