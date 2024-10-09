import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AlertModule } from 'ngx-bootstrap/alert';
import { VendorManagementComponent } from './vendor-management/vendor-management.component';
import { AddVendorComponent } from './add-vendor/add-vendor.component';
import { EditVendorComponent } from './edit-vendor/edit-vendor.component';
import { VendorRoutingModule } from './vendor-routing.module';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgPipesModule } from 'ngx-pipes';
import { VendorAttachementsComponent } from './vendor-attachements/vendor-attachements.component';
import { AddVendorAttachmentComponent } from './add-vendor-attachment/add-vendor-attachment.component';
// Removed the problematic import
import { EditVendorAttachmentComponent } from './edit-vendor-attachment/edit-vendor-attachment.component';
import { VendorNotesComponent } from './vendor-notes/vendor-notes.component';
import { AddVendorNoteComponent } from './add-vendor-note/add-vendor-note.component';
import { EditVendorNoteComponent } from './edit-vendor-note/edit-vendor-note.component';
// Removed the problematic imports
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { VendorDashBoardComponent } from './vendor-dashboard/vendor-dashboard.component';
import { DropdownTreeviewModule } from '../dropdown-treeview-select/dropdown-treeview.module';
import { VendorExcelService } from '../../services/vendor-excel.service';
import { ManageVendorNoteAttachmentComponent } from './manage-vendor-note-attachment/manage-vendor-note-attachment.component';
import { EditVendorNoteAttachmentComponent } from './edit-vendor-note-attachment/edit-vendor-note-attachment.component';
import { AddVendorNoteAttachmentComponent } from './add-vendor-note-attachment/add-vendor-note-attachment.component';

@NgModule({
  imports: [
    BsDatepickerModule.forRoot(),
    CommonModule,
    FormsModule,
    VendorRoutingModule,
    TooltipModule.forRoot(),
    NgxPaginationModule,
    NgPipesModule,
    DropdownTreeviewModule,
    AlertModule.forRoot(),
  ],
  providers: [
    VendorExcelService, // Add your service to providers array
  ],
  declarations: [
    VendorManagementComponent,
    AddVendorComponent,
    EditVendorComponent,
    VendorAttachementsComponent,
    AddVendorAttachmentComponent,
    EditVendorAttachmentComponent,
    VendorNotesComponent,
    AddVendorNoteComponent,
    EditVendorNoteComponent,
    AddVendorAttachmentComponent,
    VendorAttachementsComponent,
    EditVendorAttachmentComponent,
    VendorDashBoardComponent,
    ManageVendorNoteAttachmentComponent,
    EditVendorNoteAttachmentComponent,
    AddVendorNoteAttachmentComponent,
  ],
})
export class VendorModule {}
