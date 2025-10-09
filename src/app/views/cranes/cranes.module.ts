import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CranesComponent } from './manage-cranes/cranes.component';
import { CranesRoutingModule } from './cranes-routing.module';
import { FormsModule } from '@angular/forms';
import { AlertModule } from 'ngx-bootstrap/alert';
import { TreeviewModule } from 'ngx-treeview';
import { DropdownTreeviewModule } from '../dropdown-treeview-select/dropdown-treeview.module';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { CranesService } from 'src/app/services/cranes.service';
import { EditCranesComponent } from './edit-cranes/edit-cranes.component';
import { CraneNotesComponent } from './crane-notes/crane-notes.component';
import { AddCraneNoteComponent } from './add-crane-note/add-crane-note.component';
import { EditCraneNoteComponent } from './edit-crane-note/edit-crane-note.component';
import { CraneNoteAttachementsComponent } from './crane-note-attachements/crane-note-attachements.component';
import { AddCraneNoteAttachmentComponent } from './add-crane-note-attachment/add-crane-note-attachment.component';
import { EditCraneNoteAttachmentComponent } from './edit-crane-note-attachment/edit-crane-note-attachment.component';
import { AddCraneComponent } from './add-crane/add-crane.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgPipesModule } from 'ngx-pipes';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker'; 

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    TooltipModule.forRoot(),
    AlertModule.forRoot(),
    TreeviewModule.forRoot(),
    BsDatepickerModule.forRoot(), 
    DropdownTreeviewModule,
    CranesRoutingModule,
    NgPipesModule,
    NgxPaginationModule, 
  ],
  providers: [CranesService],
  declarations: [
    CranesComponent,
    EditCranesComponent,
    CraneNotesComponent,
    AddCraneNoteComponent,
    EditCraneNoteComponent,
    CraneNoteAttachementsComponent,
    AddCraneNoteAttachmentComponent,
    EditCraneNoteAttachmentComponent,
    AddCraneComponent,
  ],
})
export class CranesModule {}
