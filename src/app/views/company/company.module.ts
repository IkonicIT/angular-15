import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { AlertModule } from 'ngx-bootstrap/alert';
import { CompanyRoutingModule } from './company-routing.module';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { CarouselModule } from 'ngx-bootstrap/carousel';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgPipesModule } from 'ngx-pipes';
import { PopoverModule } from 'ngx-bootstrap/popover';
import { ProgressbarModule } from 'ngx-bootstrap/progressbar';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { CompanydocumentsComponent } from './companydocuments/companydocuments.component';
import { CompanytypesComponent } from './companytypes/companytypes.component';
import { CompanyattributesComponent } from './companyattributes/companyattributes.component';
import { CompanystatusesComponent } from './companystatuses/companystatuses.component';
import { ViewcompanydetailsComponent } from './viewcompanydetails/viewcompanydetails.component';
import { EditcompanydetailsComponent } from './editcompanydetails/editcompanydetails.component';
import { AddcompanydetailsComponent } from './addcompanydetails/addcompanydetails.component';
import { AddcompanydocumentsComponent } from './addcompanydocuments/addcompanydocuments.component';
import { EditcompanydocumentComponent } from './editcompanydocument/editcompanydocument.component';
import { AddcompanystatusComponent } from './addcompanystatus/addcompanystatus.component';
import { EditcompanystatusComponent } from './editcompanystatus/editcompanystatus.component';
import { CompanyNotesComponent } from './company-notes/company-notes.component';
import { AddCompanyNotesComponent } from './add-company-notes/add-company-notes.component';
import { EditCompanyNotesComponent } from './edit-company-notes/edit-company-notes.component';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { ViewCompanyNotesComponent } from './view-company-notes/view-company-notes.component';
import { AddCompanyTypeComponent } from './add-company-type/add-company-type.component';
import { EditCompanyTypeComponent } from './edit-company-type/edit-company-type.component';
import { EditCompanyAtrributeComponent } from './edit-company-atrribute/edit-company-atrribute.component';
import { AddCompanyAtrributeComponent } from './add-company-atrribute/add-company-atrribute.component';
import { CompanymanagementComponent } from './companymanagement/companymanagement.component';
import { TreeviewModule } from 'ngx-treeview';
import { DropdownTreeviewSelectComponent } from '../dropdown-treeview-select/dropdown-treeview-select.component';
import { DropdownTreeviewModule } from '../dropdown-treeview-select/dropdown-treeview.module';
import { NoteAttachmentsComponent } from './note-attachments/note-attachments.component';
import { AddNoteAttachmentComponent } from './add-note-attachment/add-note-attachment.component';
import { EditNoteAttachmentComponent } from './edit-note-attachment/edit-note-attachment.component';
import { AddcompanyattributesComponent } from './addcompanyattributes/addcompanyattributes.component';
import { EditcompanyattributesComponent } from './editcompanyattributes/editcompanyattributes.component';
import { NgxSortableModule } from 'ngx-sortable';
import { CompanyComponent } from './company.component';
import { ManageComponent } from './manage/manage.component';

@NgModule({
  imports: [
    BsDatepickerModule.forRoot(),
    CommonModule,
    FormsModule,
    AlertModule.forRoot(),
    BsDropdownModule.forRoot(),
    TabsModule,
    NgxSortableModule,
    CompanyRoutingModule,
    CarouselModule.forRoot(),   
    CollapseModule.forRoot(),
    PaginationModule.forRoot(),
    PopoverModule.forRoot(),
    ProgressbarModule.forRoot(),
    TooltipModule.forRoot(),
    NgxPaginationModule,
    NgPipesModule,
    TreeviewModule.forRoot(),
    DropdownTreeviewModule,
  ],
  declarations: [
    CompanymanagementComponent,
    CompanydocumentsComponent,
    CompanytypesComponent,
    CompanyattributesComponent,
    CompanystatusesComponent,
    ViewcompanydetailsComponent,
    EditcompanydetailsComponent,
    AddcompanydetailsComponent,
    AddcompanydocumentsComponent,
    EditcompanydocumentComponent,
    AddcompanystatusComponent,
    EditcompanystatusComponent,
    CompanyNotesComponent,
    AddCompanyNotesComponent,
    EditCompanyNotesComponent,
    ViewCompanyNotesComponent,
    AddCompanyTypeComponent,
    EditCompanyTypeComponent,
    EditCompanyAtrributeComponent,
    AddCompanyAtrributeComponent,
    NoteAttachmentsComponent,
    AddNoteAttachmentComponent,
    EditNoteAttachmentComponent,
    AddcompanyattributesComponent,
    EditcompanyattributesComponent,
    CompanyComponent,
    ManageComponent,
  ],
})
export class CompanyModule {}
