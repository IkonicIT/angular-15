import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { CommonModule } from '@angular/common';
import { DpDatePickerModule } from 'ng2-date-picker';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgPipesModule } from 'ngx-pipes';
import { DashboardComponent } from './dashboard.component';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { PiechartComponent } from './piechart/piechart.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatButtonModule } from '@angular/material/button';
import { MatRadioModule } from '@angular/material/radio';
import { DropdownTreeviewModule } from '../dropdown-treeview-select/dropdown-treeview.module';
import { AlertModule } from 'ngx-bootstrap/alert';
import { NgChartsModule } from 'ng2-charts';
import { NgxSpinnerModule } from 'ngx-spinner';

@NgModule({
  imports: [
    FormsModule,
    DashboardRoutingModule,
    DpDatePickerModule,
    BsDropdownModule,
    ButtonsModule.forRoot(),
    CommonModule,
    NgxPaginationModule,
    NgPipesModule,
    MatExpansionModule,
    MatButtonToggleModule,
    MatButtonModule,
    MatRadioModule,
    DropdownTreeviewModule,
    AlertModule,
    NgChartsModule,
    NgxSpinnerModule,
  ],
  declarations: [DashboardComponent, PiechartComponent],
})
export class DashboardModule {}
