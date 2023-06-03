import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LocationComponent } from './location.component';
import { LocationRoutingModule } from './location-routing.module';
import { LocationManagementComponent } from './location-management/location-management.component';
import { AddLocationDetailsComponent } from './add-location-details/add-location-details.component';
import { EditLocationDetailsComponent } from './edit-location-details/edit-location-details.component';
import { LocationAttributesComponent } from './location-attributes/location-attributes.component';
import { AddLocationAttributeComponent } from './add-location-attribute/add-location-attribute.component';
import { EditLocationAttributeComponent } from './edit-location-attribute/edit-location-attribute.component';
import { LocationTypesComponent } from './location-types/location-types.component';
import { AddLocationTypeComponent } from './add-location-type/add-location-type.component';
import { EditLocationTypeComponent } from './edit-location-type/edit-location-type.component';
import { LocationNotesComponent } from './location-notes/location-notes.component';
import { AddLocationNoteComponent } from './add-location-note/add-location-note.component';
import { EditLocationNoteComponent } from './edit-location-note/edit-location-note.component';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgPipesModule } from 'ngx-pipes';
import { AlertModule } from 'ngx-bootstrap/alert';
import { LocationStatusComponent } from './location-status/location-status.component';
import { AddLocationStatusComponent } from './add-location-status/add-location-status.component';
import { EditLocationStatusComponent } from './edit-location-status/edit-location-status.component';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { LocationAttachmentComponent } from './location-attachment/location-attachment.component';
import { AddLocationAttachmentComponent } from './add-location-attachment/add-location-attachment.component';
import { EditLocationAttachmentComponent } from './edit-location-attachment/edit-location-attachment.component';
import { TreeviewModule } from "ngx-treeview";
import { NgxSortableModule } from 'ngx-sortable'
import { DropdownTreeviewModule } from "../dropdown-treeview-select/dropdown-treeview.module";
import { AddLocationNoteAttachmentsComponent } from './add-location-note-attachments/add-location-note-attachments.component';
import { LocationNoteAttachmentsComponent } from './location-note-attachments/location-note-attachments.component';
import { EditLocationNoteAttachmentsComponent } from './edit-location-note-attachments/edit-location-note-attachments.component';
import { MergeLocationsComponent } from './merge-locations/merge-locations.component';
import { NotesComponent } from './notes/notes.component';
import { ManagelocationsComponent } from './managelocations/managelocations.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    BsDatepickerModule.forRoot(),
    LocationRoutingModule,
    NgxPaginationModule,
    NgxSortableModule,
    NgPipesModule,
    AlertModule.forRoot(),
    TreeviewModule.forRoot(),
    DropdownTreeviewModule,
    TooltipModule.forRoot(),
  ],
  declarations: [LocationComponent, LocationManagementComponent, AddLocationDetailsComponent, EditLocationDetailsComponent, LocationAttributesComponent, AddLocationAttributeComponent, EditLocationAttributeComponent, LocationTypesComponent, AddLocationTypeComponent, EditLocationTypeComponent, LocationNotesComponent, AddLocationNoteComponent, EditLocationNoteComponent, LocationStatusComponent, AddLocationStatusComponent, EditLocationStatusComponent, LocationAttachmentComponent, AddLocationAttachmentComponent, EditLocationAttachmentComponent, AddLocationNoteAttachmentsComponent, LocationNoteAttachmentsComponent, EditLocationNoteAttachmentsComponent, MergeLocationsComponent, NotesComponent, ManagelocationsComponent]
})
export class LocationModule { }
