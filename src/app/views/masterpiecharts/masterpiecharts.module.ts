import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TemplateComponent } from './masterpiecharts.component';
import { TemplateRoutingModule } from "./masterpiecharts-routing.module";
import { FormsModule } from "@angular/forms";
import { AlertModule } from 'ngx-bootstrap/alert'; // Ensure correct import
import { TreeviewModule } from "ngx-treeview";
import { DropdownTreeviewModule } from "../dropdown-treeview-select/dropdown-treeview.module";
import { TooltipModule } from 'ngx-bootstrap/tooltip';
// import { NgxPasswordToggleModule } from 'ngx-password-toggle';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {MatButtonModule} from '@angular/material/button';
import {MatExpansionModule} from '@angular/material/expansion';
import { DpDatePickerModule } from 'ng2-date-picker'
import { NgPipesModule } from 'ngx-pipes';
import { NgChartsModule } from 'ng2-charts';
import { DashboardService } from 'src/app/services/dashboard.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    TooltipModule.forRoot(),
    AlertModule.forRoot(),
    TreeviewModule.forRoot(),
    DropdownTreeviewModule,
    TemplateRoutingModule,
    // NgxPasswordToggleModule,
    DropdownTreeviewModule,
    NgPipesModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatExpansionModule,
    DpDatePickerModule,
    NgChartsModule
  ],
  providers: [DashboardService],
  declarations: [
    TemplateComponent

  ]
})
export class MasterPieChartsModule { }
