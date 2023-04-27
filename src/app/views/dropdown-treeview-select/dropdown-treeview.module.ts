import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {DropdownTreeviewSelectComponent} from "./dropdown-treeview-select.component";
import {FormsModule} from "@angular/forms";
import {HttpClientModule} from "@angular/common/http";
import {TreeviewModule} from "ngx-treeview";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    TreeviewModule.forRoot(),
  ],
  declarations: [
    DropdownTreeviewSelectComponent
  ],
  exports: [
    DropdownTreeviewSelectComponent
  ]
})
export class DropdownTreeviewModule { }
