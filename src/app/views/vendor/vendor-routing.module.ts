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
import { VendorDashBoardComponent } from './vendor-dashboard/vendor-dashboard.component';
import { ManageVendorNoteAttachmentComponent } from './manage-vendor-note-attachment/manage-vendor-note-attachment.component';
import { AddVendorNoteAttachmentComponent } from './add-vendor-note-attachment/add-vendor-note-attachment.component';
import { EditVendorNoteAttachmentComponent } from './edit-vendor-note-attachment/edit-vendor-note-attachment.component';

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
        path: 'vendorDashboard', // This should match the URL you are trying to navigate to
        component: VendorDashBoardComponent,
        data: {
          title: 'Vendor Dashboard',
        },
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
        path: 'note/documents/:id',
        component: ManageVendorNoteAttachmentComponent,
        data: {
          title: 'Documents',
        },
      },
      {
        path: 'addVendorNoteDocument/:id',
        component: AddVendorNoteAttachmentComponent,
        data: {
          title: 'Add Vendor Documents',
        },
      },
      {
        path: 'editVendorNoteDocument/:id',
        component: EditVendorNoteAttachmentComponent,
        data: {
          title: 'Add Vendor Documents',
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
