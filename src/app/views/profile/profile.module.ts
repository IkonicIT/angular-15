import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MyProfileComponent } from './my-profile/my-profile.component';
import { ProfileRoutingModule } from "./profile-routing.module";
import { FormsModule } from "@angular/forms";
import { AlertModule } from "ngx-bootstrap/alert";
import { ChangePasswordComponent } from './change-password/change-password.component';
import { TreeviewModule } from "ngx-treeview";
import { DropdownTreeviewModule } from "../dropdown-treeview-select/dropdown-treeview.module";
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { NgxPasswordToggleModule } from 'ngx-password-toggle';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    TooltipModule.forRoot(),
    AlertModule.forRoot(),
    TreeviewModule.forRoot(),
    DropdownTreeviewModule,
    ProfileRoutingModule,
    // NgxPasswordToggleModule
  ],
  declarations: [
    MyProfileComponent,
    ChangePasswordComponent
  ]
})
export class ProfileModule { }
