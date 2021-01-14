import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import {BackendService} from './backend.service';
import { TicketComponent } from './ticket/ticket.component';
import { RouterModule } from '@angular/router';
import { routes } from './routes';
import { TicketListComponent } from './ticket-list/ticket-list.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TicketDetailComponent } from './ticket-detail/ticket-detail.component';

@NgModule({
  declarations: [
    AppComponent,
    TicketListComponent,
    TicketComponent,
    TicketDetailComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    FormsModule,
    RouterModule.forRoot(routes)
  ],
  providers: [BackendService],
  bootstrap: [AppComponent]
})
export class AppModule {

}
