import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PartsRoutingModule } from './parts-routing.module';
import { FormsModule } from '@angular/forms';
import { AlertModule } from 'ngx-bootstrap/alert';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
// import { AlertModule, BsDatepickerModule } from 'ngx-bootstrap';
import { TreeviewModule } from 'ngx-treeview';
import { DropdownTreeviewModule } from '../dropdown-treeview-select/dropdown-treeview.module';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
// import { NgxPasswordToggleModule } from 'ngx-password-toggle';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgPipesModule } from 'ngx-pipes';
import { PartsService } from 'src/app/services/parts.service';
import { PartsComponent } from './manage-parts/parts.component';
import { EditPartComponent } from './edit-parts/edit-parts.component';
import { ReactiveFormsModule } from '@angular/forms';
import { PartAttachementsComponent } from './part-attachements/part-attachements.component';
import { AddPartAttachmentComponent } from './add-part-attachment/add-part-attachment.component';
import { EditPartAttachmentComponent } from './edit-part-attachment/edit-part-attachment.component';
import { PartNotesComponent } from './part-notes/part-notes.component';
import { AddPartNoteComponent } from './add-part-note/add-part-note.component';
import { EditPartNoteComponent } from './edit-part-note/edit-part-note.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    TooltipModule.forRoot(),
    AlertModule.forRoot(),
    TreeviewModule.forRoot(),
    DropdownTreeviewModule,
    PartsRoutingModule,
    // NgxPasswordToggleModule,
    NgxPaginationModule,
    NgPipesModule,
    ReactiveFormsModule,
    BsDatepickerModule.forRoot(),
  ],
  providers: [PartsService],
  declarations: [
    PartsComponent,
    EditPartComponent,
    PartAttachementsComponent,
    AddPartAttachmentComponent,
    EditPartAttachmentComponent,
    PartNotesComponent,
    AddPartNoteComponent,
    EditPartNoteComponent,
  ],
})
export class PartsModule {}
