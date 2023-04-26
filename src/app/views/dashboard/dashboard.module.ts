import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { CommonModule } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgPipesModule } from 'ngx-pipes';
import { DashboardComponent } from './dashboard.component';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { PiechartComponent } from './piechart/piechart.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { DropdownTreeviewModule } from '../dropdown-treeview-select/dropdown-treeview.module';
import { AlertModule } from 'ngx-bootstrap/alert';
import { NgChartsModule } from 'ng2-charts';

@NgModule({
  imports: [
    FormsModule,
    DashboardRoutingModule,
    BsDropdownModule,
    ButtonsModule.forRoot(),
    CommonModule,
    NgxPaginationModule,
    NgPipesModule,
    MatExpansionModule,
    MatButtonToggleModule,
    DropdownTreeviewModule,
    AlertModule,
    NgChartsModule,
  ],
  declarations: [DashboardComponent, PiechartComponent],
})
export class DashboardModule {}
