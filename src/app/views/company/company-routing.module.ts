import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CompanymanagementComponent } from './companymanagement/companymanagement.component';
import { CompanydocumentsComponent } from './companydocuments/companydocuments.component';
import { CompanyattributesComponent } from './companyattributes/companyattributes.component';
import { CompanystatusesComponent } from './companystatuses/companystatuses.component';
import { CompanytypesComponent } from './companytypes/companytypes.component';
import { ViewcompanydetailsComponent } from './viewcompanydetails/viewcompanydetails.component';
import { EditcompanydetailsComponent } from './editcompanydetails/editcompanydetails.component';
import { AddcompanydetailsComponent } from './addcompanydetails/addcompanydetails.component';
import { AddcompanydocumentsComponent } from './addcompanydocuments/addcompanydocuments.component';
import { EditcompanystatusComponent } from './editcompanystatus/editcompanystatus.component';
import { AddcompanystatusComponent } from './addcompanystatus/addcompanystatus.component';
import { EditcompanydocumentComponent } from './editcompanydocument/editcompanydocument.component';
import { CompanyNotesComponent } from './company-notes/company-notes.component';
import { AddCompanyNotesComponent } from './add-company-notes/add-company-notes.component';
import { EditCompanyNotesComponent } from './edit-company-notes/edit-company-notes.component';
import { ViewCompanyNotesComponent } from './view-company-notes/view-company-notes.component';
import { AddCompanyTypeComponent } from './add-company-type/add-company-type.component';
import { EditCompanyTypeComponent } from './edit-company-type/edit-company-type.component';
import { EditCompanyAtrributeComponent } from './edit-company-atrribute/edit-company-atrribute.component';
import { AddCompanyAtrributeComponent } from './add-company-atrribute/add-company-atrribute.component';
import { NoteAttachmentsComponent } from './note-attachments/note-attachments.component';
import { AddNoteAttachmentComponent } from './add-note-attachment/add-note-attachment.component';
import { EditNoteAttachmentComponent } from './edit-note-attachment/edit-note-attachment.component';
import { ManageComponent } from './manage/manage.component';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Company',
    },
    children: [
      {
        path: '',
        redirectTo: 'list',
        pathMatch: 'full',
      },
      {
        path: 'list',
        component: CompanymanagementComponent,
        data: {
          title: 'list',
        },
      },
      {
        path: 'documents',
        component: CompanydocumentsComponent,
        data: {
          title: 'Documents',
        },
      },
      {
        path: 'documents/:id',
        component: CompanydocumentsComponent,
        data: {
          title: 'Documents',
        },
      },
      {
        path: 'attributes/:id/:cmpId',
        component: CompanyattributesComponent,
        data: {
          title: 'Attributes',
        },
      },
      {
        path: 'statuses',
        component: CompanystatusesComponent,
        data: {
          title: 'Statuses',
        },
      },
      {
        path: 'types',
        component: CompanytypesComponent,
        data: {
          title: 'Types',
        },
      },
      {
        path: 'types/:id',
        component: CompanytypesComponent,
        data: {
          title: 'Types',
        },
      },
      {
        path: 'view/:id',
        component: ViewcompanydetailsComponent,
        data: {
          title: 'Company Details',
        },
      },
      {
        path: 'edit/:id',
        component: EditcompanydetailsComponent,
        data: {
          title: 'Edit Company Details',
        },
      },
      {
        path: 'add',
        component: AddcompanydetailsComponent,
        data: {
          title: 'Add Company Details',
        },
      },
      {
        path: 'addDocument',
        component: AddcompanydocumentsComponent,
        data: {
          title: 'Add Company Documents',
        },
      },
      {
        path: 'editDocument',
        component: EditcompanydocumentComponent,
        data: {
          title: 'Edit Company Documents',
        },
      },
      {
        path: 'editStatus',
        component: EditcompanystatusComponent,
        data: {
          title: 'Edit Company Statuses',
        },
      },
      {
        path: 'addStatus',
        component: AddcompanystatusComponent,
        data: {
          title: 'Add Company Statuses',
        },
      },
      {
        path: 'notes/:id',
        component: CompanyNotesComponent,
        data: {
          title: 'Company Notes',
        },
      },
      {
        path: 'editNotes',
        component: EditCompanyNotesComponent,
        data: {
          title: 'Edit Company Notes',
        },
      },
      {
        path: 'addNotes',
        component: AddCompanyNotesComponent,
        data: {
          title: 'Add Company Notes',
        },
      },
      {
        path: 'viewNotes',
        component: ViewCompanyNotesComponent,
        data: {
          title: 'View Company Notes',
        },
      },
      {
        path: 'editCompanyType',
        component: EditCompanyTypeComponent,
        data: {
          title: 'Edit Company Type',
        },
      },
      {
        path: 'addCompanyType',
        component: AddCompanyTypeComponent,
        data: {
          title: 'Add Company Type',
        },
      },
      {
        path: 'editCompanyAtrribute',
        component: EditCompanyAtrributeComponent,
        data: {
          title: 'Edit Company Atrribute',
        },
      },
      {
        path: 'addCompanyAtrribute',
        component: AddCompanyAtrributeComponent,
        data: {
          title: 'Add Company Atrribute',
        },
      },
      {
        path: 'noteAttchments/:noteId/:noteId',
        component: NoteAttachmentsComponent,
        data: {
          title: 'Note Attachments',
        },
      },
      {
        path: 'addNoteAttchments/:noteId',
        component: AddNoteAttachmentComponent,
        data: {
          title: 'Add Note Attachment',
        },
      },
      {
        path: 'editNoteAttchments/:attachmentId/:noteId',
        component: EditNoteAttachmentComponent,
        data: {
          title: 'Edit Note Attachment',
        },
      },
      {
        path: 'companyNote/:id',
        component: ManageComponent,
        data: {
          title: 'CompanyNotes ',
        },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CompanyRoutingModule {}
