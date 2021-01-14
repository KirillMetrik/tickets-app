import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin, Subscription } from 'rxjs';
import { finalize, map } from 'rxjs/operators';
import { BackendService } from '../backend.service';

@Component({
  selector: 'ticket-detail',
  templateUrl: './ticket-detail.component.html',
  styleUrls: ['./ticket-detail.component.less']
})
export class TicketDetailComponent implements OnInit, OnDestroy {
  private subscrSubmit: Subscription;
  private subscrParams: Subscription;
  private subscrGet: Subscription;

  id: number;
  description: string;
  assigneeId: number;
  isCompleted: boolean;
  isBusy = false;

  users = this.backend.users();

  constructor(
    private backend: BackendService,
    private router: Router,
    private route: ActivatedRoute) {}

  get isAdd() {
    return this.id == null;
  }

  ngOnInit() {
    this.subscrParams = this.route.params.subscribe(params=>{
      this.id = params['id'];
      if(!this.isAdd) {
        this.isBusy = true;
        this.subscrGet = this.backend.ticket(this.id)
          .pipe(finalize(()=>this.isBusy=false))
          .subscribe(t=>{
            this.description = t.description;
            this.assigneeId = t.assigneeId;
            this.isCompleted = t.completed;
        });
      }
    });
  }

  submit(){
    if(this.isBusy) {
      return;
    }

    this.isBusy = true;
    const fn = (this.isAdd ? this.addTicket : this.updateTicket).bind(this);
    this.subscrSubmit = fn()
      .pipe(finalize(()=>this.isBusy=false))
      .subscribe(()=>{
        this.isBusy = false;
        this.router.navigate(['/'])
    });
  }

  ngOnDestroy() {
    this.subscrSubmit?.unsubscribe();
    this.subscrParams?.unsubscribe();
    this.subscrGet?.unsubscribe();
  }

  addTicket() {
    return this.backend.newTicket({
      description: this.description,
      assigneeId: this.assigneeId
    });
  }

  updateTicket() {
    return forkJoin({
      assign: this.backend.assign(this.id, this.assigneeId),
      complete: this.backend.complete(this.id, this.isCompleted)
    });
  }
}
