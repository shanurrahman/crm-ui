import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {FormlyModule} from '@ngx-formly/core';
import { LeadCreateComponent } from './lead-create/lead-create.component';
import { LeadsComponent } from './leads/leads.component';
import { TicketCreateComponent } from './ticket-create/ticket-create.component';
import { TicketsComponent } from './tickets/tickets.component';
import { UploadsComponent } from './uploads/uploads.component';
import { UserCreateComponent } from './user-create/user-create.component';
import { UsersComponent } from './users/users.component';
import { WelcomeRoutingModule } from './welcome-routing.module';
import { WelcomeComponent } from './welcome.component';
import { RouterModule } from '@angular/router';
import { DemoNgZorroAntdModule } from './antd.module';
import { TimelineModalComponent } from '../timeline-modal/timeline-modal.component';
import { AlarmsComponent } from '../alarms/alarms.component';
import { authInterceptorProviders } from 'src/helpers/auth.interceptor';


@NgModule({
  imports: [
    RouterModule,
    WelcomeRoutingModule,
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    DemoNgZorroAntdModule
  ],
  declarations: [
    WelcomeComponent,
    LeadsComponent,
    TicketsComponent,
    UploadsComponent,
    UsersComponent,
    LeadCreateComponent,
    TicketCreateComponent,
    UserCreateComponent,
    TimelineModalComponent,
    AlarmsComponent,
  ],
  exports: [WelcomeComponent],
  providers: [authInterceptorProviders],
})
export class WelcomeModule {}
