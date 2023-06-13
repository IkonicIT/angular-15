import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FailureTypeRoutingModule } from './failure type-routing.module';
import { FailuretypemanagementComponent } from './failuretypemanagement/failuretypemanagement.component';
import { DropdownTreeviewModule } from '../dropdown-treeview-select/dropdown-treeview.module';
import { TreeviewModule } from 'ngx-treeview';
import { AlertModule } from 'ngx-bootstrap/alert';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TooltipModule } from 'ngx-bootstrap/tooltip';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    TooltipModule.forRoot(),
    AlertModule.forRoot(),
    FailureTypeRoutingModule,
    DropdownTreeviewModule,
    TreeviewModule.forRoot(),
    ModalModule,
  ],
  declarations: [FailuretypemanagementComponent],
})
export class FailureTypeModule {}
