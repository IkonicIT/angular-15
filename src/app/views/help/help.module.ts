import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HelpRoutingModule } from './help-routing.module';
import { DropdownTreeviewModule } from '../dropdown-treeview-select/dropdown-treeview.module';
import { TreeviewModule } from 'ngx-treeview';
import { AlertModule } from 'ngx-bootstrap/alert';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { HelpComponent } from './help.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgPipesModule } from 'ngx-pipes';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    TooltipModule.forRoot(),
    AlertModule.forRoot(),
    HelpRoutingModule,
    DropdownTreeviewModule,
    TreeviewModule.forRoot(),
    ModalModule,
    NgxPaginationModule,
    NgPipesModule,
  ],
  declarations: [HelpComponent],
})
export class HelpModule {}
