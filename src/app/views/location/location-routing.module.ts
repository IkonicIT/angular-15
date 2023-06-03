import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LocationManagementComponent } from './location-management/location-management.component';
import { AddLocationDetailsComponent } from './add-location-details/add-location-details.component';
import { EditLocationDetailsComponent } from './edit-location-details/edit-location-details.component';
import { AddLocationAttributeComponent } from './add-location-attribute/add-location-attribute.component';
import { EditLocationAttributeComponent } from './edit-location-attribute/edit-location-attribute.component';
import { AddLocationNoteComponent } from './add-location-note/add-location-note.component';
import { EditLocationNoteComponent } from './edit-location-note/edit-location-note.component';
import { AddLocationTypeComponent } from './add-location-type/add-location-type.component';
import { EditLocationTypeComponent } from './edit-location-type/edit-location-type.component';
import { LocationAttributesComponent } from './location-attributes/location-attributes.component';
import { LocationNotesComponent } from './location-notes/location-notes.component';
import { LocationTypesComponent } from './location-types/location-types.component';
import { LocationStatusComponent } from './location-status/location-status.component';
import { AddLocationStatusComponent } from './add-location-status/add-location-status.component';
import { EditLocationStatusComponent } from './edit-location-status/edit-location-status.component';
import { LocationAttachmentComponent } from './location-attachment/location-attachment.component';
import { EditLocationAttachmentComponent } from './edit-location-attachment/edit-location-attachment.component';
import { AddLocationAttachmentComponent } from './add-location-attachment/add-location-attachment.component';
import { AddLocationNoteAttachmentsComponent } from './add-location-note-attachments/add-location-note-attachments.component';
import { LocationNoteAttachmentsComponent } from './location-note-attachments/location-note-attachments.component';
import { EditLocationNoteAttachmentsComponent } from './edit-location-note-attachments/edit-location-note-attachments.component';
import { MergeLocationsComponent } from './merge-locations/merge-locations.component';
import { NotesComponent } from './notes/notes.component';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Location',
    },
    children: [
      {
        path: '',
        redirectTo: 'list',
        pathMatch: 'full',
      },
      {
        path: 'list',
        component: LocationManagementComponent,
        data: {
          title: 'list',
        },
      },
      {
        path: 'addLocation/:cmpId',
        component: AddLocationDetailsComponent,
        data: {
          title: 'Add Location',
        },
      },
      {
        path: 'mergeLocations',
        component: MergeLocationsComponent,
        data: {
          title: 'Merge Locations',
        },
      },
      {
        path: 'editLocation/:id/:cmpId',
        component: EditLocationDetailsComponent,
        data: {
          title: 'Edit Location',
        },
      },
      {
        path: 'attributes',
        component: LocationAttributesComponent,
        data: {
          title: 'Attributes',
        },
      },
      {
        path: 'attributes/:id/:companyId',
        component: LocationAttributesComponent,
        data: {
          title: 'Attributes',
        },
      },
      {
        path: 'addLocationAttribute',
        component: AddLocationAttributeComponent,
        data: {
          title: 'Add Location Attribute',
        },
      },
      {
        path: 'editLocationAttribute',
        component: EditLocationAttributeComponent,
        data: {
          title: 'Edit Location Attribute',
        },
      },
      {
        path: 'notes',
        component: LocationNotesComponent,
        data: {
          title: 'Notes',
        },
      },
      {
        path: 'notes/:id',
        component: LocationNotesComponent,
        data: {
          title: 'Notes',
        },
      },
      {
        path: 'addLocationNote/:id',
        component: AddLocationNoteComponent,
        data: {
          title: 'Add Location Note',
        },
      },
      {
        path: 'editLocationNote/:id/:locId',
        component: EditLocationNoteComponent,
        data: {
          title: 'Edit Location Note',
        },
      },
      {
        path: 'types',
        component: LocationTypesComponent,
        data: {
          title: 'Types',
        },
      },
      {
        path: 'types/:id',
        component: LocationTypesComponent,
        data: {
          title: 'Types',
        },
      },
      {
        path: 'addLocationType',
        component: AddLocationTypeComponent,
        data: {
          title: 'Add Location Type',
        },
      },
      {
        path: 'editLocationType/:id/:cmpId',
        component: EditLocationTypeComponent,
        data: {
          title: 'Edit Location Type',
        },
      },
      {
        path: 'status',
        component: LocationStatusComponent,
        data: {
          title: 'Status',
        },
      },
      {
        path: 'status/:id',
        component: LocationStatusComponent,
        data: {
          title: 'Status',
        },
      },
      {
        path: 'addLocationStatus',
        component: AddLocationStatusComponent,
        data: {
          title: 'Add Location Status',
        },
      },
      {
        path: 'editLocationStatus/:id',
        component: EditLocationStatusComponent,
        data: {
          title: 'Edit Location Status',
        },
      },
      {
        path: 'attachments',
        component: LocationAttachmentComponent,
        data: {
          title: 'Attachment',
        },
      },
      {
        path: 'attachments/:id',
        component: LocationAttachmentComponent,
        data: {
          title: 'Attachment',
        },
      },
      {
        path: 'addAttachment/:id',
        component: AddLocationAttachmentComponent,
        data: {
          title: 'Add Location Attachment',
        },
      },

      {
        path: 'editAttachment/:id/:locId',
        component: EditLocationAttachmentComponent,
        data: {
          title: 'Edit Location Attachment',
        },
      },
      {
        path: 'noteAttchments/:noteId/:noteId',
        component: LocationNoteAttachmentsComponent,
        data: {
          title: 'Note Attachments',
        },
      },
      {
        path: 'editNoteAttchments/:attachmentId/:noteId',
        component: EditLocationNoteAttachmentsComponent,
        data: {
          title: 'Edit Note Attachement',
        },
      },
      {
        path: 'addNoteAttchments/:noteId',
        component: AddLocationNoteAttachmentsComponent,
        data: {
          title: 'Add Note Attachement',
        },
      },
      {
        path: 'locationNote/:locationId',
        component: NotesComponent,
        data: {
          title: 'Location notes',
        },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LocationRoutingModule {}
