import { NgModule } from '@angular/core';
import { NgChartsModule } from 'ng2-charts';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { WidgetsComponent } from './widgets.component';
import { WidgetsRoutingModule } from './widgets-routing.module';

@NgModule({
  imports: [WidgetsRoutingModule, NgChartsModule, BsDropdownModule],
  declarations: [WidgetsComponent],
})
export class WidgetsModule {}
