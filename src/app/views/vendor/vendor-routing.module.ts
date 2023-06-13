import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { VendorManagementComponent } from './vendor-management/vendor-management.component';
import { EditVendorComponent } from './edit-vendor/edit-vendor.component';
import { AddVendorComponent } from './add-vendor/add-vendor.component';
import { VendorAttachementsComponent } from './vendor-attachements/vendor-attachements.component';
import { AddVendorAttachmentComponent } from './add-vendor-attachment/add-vendor-attachment.component';
import { EditVendorAttachmentComponent } from './edit-vendor-attachment/edit-vendor-attachment.component';
import { VendorNotesComponent } from './vendor-notes/vendor-notes.component';
import { EditVendorNoteComponent } from './edit-vendor-note/edit-vendor-note.component';
import { AddVendorNoteComponent } from './add-vendor-note/add-vendor-note.component';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Vendor',
    },
    children: [
      {
        path: '',
        redirectTo: 'list',
        pathMatch: 'full',
      },
      {
        path: 'list',
        component: VendorManagementComponent,
        data: {
          title: 'list',
        },
      },
      {
        path: 'addVendor',
        component: AddVendorComponent,
        data: {
          title: 'Add Vendor',
        },
      },
      {
        path: 'editVendor/:id',
        component: EditVendorComponent,
        data: {
          title: 'Edit Vendor',
        },
      },
      {
        path: 'documents/:id',
        component: VendorAttachementsComponent,
        data: {
          title: 'Documents',
        },
      },
      {
        path: 'addDocument',
        component: AddVendorAttachmentComponent,
        data: {
          title: 'Add Vendor Documents',
        },
      },
      {
        path: 'editDocument',
        component: EditVendorAttachmentComponent,
        data: {
          title: 'Edit Vendor Documents',
        },
      },
      {
        path: 'notes/:id',
        component: VendorNotesComponent,
        data: {
          title: 'Vendor Notes',
        },
      },
      {
        path: 'editNotes',
        component: EditVendorNoteComponent,
        data: {
          title: 'Edit Vendor Notes',
        },
      },
      {
        path: 'addVendorNotes',
        component: AddVendorNoteComponent,
        data: {
          title: 'Add Vendor Notes',
        },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VendorRoutingModule {}
