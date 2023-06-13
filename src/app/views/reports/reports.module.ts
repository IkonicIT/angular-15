import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InserviceVsSpareComponent } from '../reports/inserviceVsSpare/inservice-vs-spare.component';
import { serviceReportsComponent } from './serviceReports/servicereports.component';
import { ReportsRoutingModule } from './reports-routing.module';
import { FormsModule } from '@angular/forms';
import { AlertModule } from 'ngx-bootstrap/alert';
import { TreeviewModule } from 'ngx-treeview';
import { DropdownTreeviewModule } from '../dropdown-treeview-select/dropdown-treeview.module';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { NgxPasswordToggleModule } from 'ngx-password-toggle';
import { MatTabsModule } from '@angular/material/tabs';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgPipesModule } from 'ngx-pipes';
import { DpDatePickerModule } from 'ng2-date-picker';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    TooltipModule.forRoot(),
    AlertModule.forRoot(),
    TreeviewModule.forRoot(),
    DropdownTreeviewModule,
    ReportsRoutingModule,
    // NgxPasswordToggleModule,
    MatTabsModule,
    NgxPaginationModule,
    NgPipesModule,
    DpDatePickerModule,
  ],
  declarations: [InserviceVsSpareComponent, serviceReportsComponent],
})
export class ReportsModule {}
