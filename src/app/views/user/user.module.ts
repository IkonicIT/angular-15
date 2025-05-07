import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserRoutingModule } from "./user-routing.module";
import { UserManagementComponent } from './user-management/user-management.component';
import { AddUserComponent } from './add-user/add-user.component';
import { EditUserComponent } from './edit-user/edit-user.component';
import { FormsModule } from "@angular/forms";
import { NgxPaginationModule } from "ngx-pagination";
import { NgPipesModule } from "ngx-pipes";
import { AlertModule } from "ngx-bootstrap/alert";
import { UserSecurityRoleComponent } from './user-security-role/user-security-role.component';
import { UserTypesComponent } from './user-types/user-types.component';
import { AddUserTypeComponent } from './add-user-type/add-user-type.component';
import { EditUserTypeComponent } from './edit-user-type/edit-user-type.component';
import { UserAttributesComponent } from './user-attributes/user-attributes.component';
import { TreeviewModule } from "ngx-treeview";
import { DropdownTreeviewModule } from "../dropdown-treeview-select/dropdown-treeview.module";
import { NgxSortableModule } from 'ngx-sortable';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { ViewUserComponent } from './view-user/view-user.component';
import { UserLogManagementComponent } from './userlog/user-log-management/user-log-management.component';
import { ViewuserLogComponent } from './userlog/viewuser-log/viewuser-log.component';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NgxPaginationModule,
    NgPipesModule,
    TooltipModule.forRoot(),
    NgxSortableModule,
    TreeviewModule.forRoot(),
    DropdownTreeviewModule,
    AlertModule.forRoot(),
    UserRoutingModule,
  ],
  declarations: [UserManagementComponent, AddUserComponent, EditUserComponent, UserSecurityRoleComponent, UserTypesComponent, AddUserTypeComponent, EditUserTypeComponent, UserAttributesComponent, ViewUserComponent, UserLogManagementComponent, ViewuserLogComponent]
})
export class UserModule { }
