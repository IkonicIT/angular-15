import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WarrantyTypeManagementComponent } from './warranty-type-management/warranty-type-management.component';
import { WarrantyRoutingModule } from './warranty-routing.module';
import { FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgPipesModule } from 'ngx-pipes';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { AlertModule } from 'ngx-bootstrap/alert';
import { EditWarrantyTypeComponent } from './edit-warranty-type/edit-warranty-type.component';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
@NgModule({
  imports: [
    BsDatepickerModule.forRoot(),
    CommonModule,
    WarrantyRoutingModule,
    FormsModule,
    NgxPaginationModule,
    TooltipModule.forRoot(),
    NgPipesModule,
    AlertModule.forRoot(),
  ],
  declarations: [WarrantyTypeManagementComponent, EditWarrantyTypeComponent],
})
export class WarrantyModule {}
