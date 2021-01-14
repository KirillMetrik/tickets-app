import { Routes } from "@angular/router";
import { TicketDetailComponent } from "./ticket-detail/ticket-detail.component";
import { TicketListComponent } from "./ticket-list/ticket-list.component";

export const routes: Routes=[
  {
    path: 'add',
    component: TicketDetailComponent
  },
  {
    path: 'detail/:id',
    component: TicketDetailComponent
  },
  {
    path: '**',
    component: TicketListComponent
  }
];