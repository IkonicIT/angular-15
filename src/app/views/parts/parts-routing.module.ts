import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PartsComponent } from './manage-parts/parts.component';
import { EditPartComponent } from './edit-parts/edit-parts.component';
import { PartAttachementsComponent } from './part-attachements/part-attachements.component';
import { AddPartAttachmentComponent } from './add-part-attachment/add-part-attachment.component';
import { EditPartAttachmentComponent } from './edit-part-attachment/edit-part-attachment.component';
import { PartNotesComponent } from './part-notes/part-notes.component';
import { AddPartNoteComponent } from './add-part-note/add-part-note.component';
import { EditPartNoteComponent } from './edit-part-note/edit-part-note.component';
const routes: Routes = [
  {
    path: '',
    data: {
      title: 'parts',
    },
    children: [
      {
        path: '',
        redirectTo: 'parts',
        pathMatch: 'full',
      },
      {
        path: 'parts/:frame',
        component: PartsComponent,
        data: {
          title: '',
        },
      },
      {
        path: 'parts',
        component: PartsComponent,
        data: {
          title: '',
        },
      },
      {
        path: 'edit/:id/:frame',
        component: EditPartComponent,
        data: {
          title: '',
        },
      },
      {
        path: 'manageAttachements/:id',
        component: PartAttachementsComponent,
        data: {
          title: '',
        },
      },
      {
        path: 'addDocument/:id',
        component: AddPartAttachmentComponent,
        data: {
          title: '',
        },
      },

      {
        path: 'editDocument/:id',
        component: EditPartAttachmentComponent,
        data: {
          title: '',
        },
      },
      {
        path: 'manageNotes/:id/:frame',
        component: PartNotesComponent,
        data: {
          title: '',
        },
      },
      {
        path: 'addPartNote/:id',
        component: AddPartNoteComponent,
        data: {
          title: '',
        },
      },
      {
        path: 'editPartNote/:id',
        component: EditPartNoteComponent,
        data: {
          title: '',
        },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PartsRoutingModule {}
