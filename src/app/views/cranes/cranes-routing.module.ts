import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CranesComponent } from './manage-cranes/cranes.component';
import { EditCranesComponent } from './edit-cranes/edit-cranes.component';
import { CraneNotesComponent } from './crane-notes/crane-notes.component';
import { AddCraneNoteComponent } from './add-crane-note/add-crane-note.component';
import { EditCraneNoteComponent } from './edit-crane-note/edit-crane-note.component';
import { CraneNoteAttachementsComponent } from './crane-note-attachements/crane-note-attachements.component';
import { AddCraneNoteAttachmentComponent } from './add-crane-note-attachment/add-crane-note-attachment.component';
import { EditCraneNoteAttachmentComponent } from './edit-crane-note-attachment/edit-crane-note-attachment.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'cranes',
    pathMatch: 'full',
  },
  {
    path: 'cranes',
    component: CranesComponent,
  },
  {
    path: 'editCrane/:id',
    component: EditCranesComponent,
  },
  {
    path: 'craneNotes/:id',
    component: CraneNotesComponent,
  },
  {
    path: 'addCraneNote/:id',
    component: AddCraneNoteComponent,
  },
  {
    path: 'editCraneNote/:id',
    component: EditCraneNoteComponent,
  },
  {
    path: 'craneNoteAttachments/:id',
    component: CraneNoteAttachementsComponent,
  },
  {
    path: 'addCraneNoteAttachments/:id',
    component: AddCraneNoteAttachmentComponent,
  },
  {
    path: 'editCraneNoteAttachments/:id',
    component: EditCraneNoteAttachmentComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CranesRoutingModule {}
