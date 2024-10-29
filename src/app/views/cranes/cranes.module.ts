import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CranesComponent } from './manage-cranes/cranes.component';
import { CranesRoutingModule } from './cranes-routing.module';
import { FormsModule } from '@angular/forms';
import { AlertModule } from 'ngx-bootstrap/alert';
import { TreeviewModule } from 'ngx-treeview';
import { DropdownTreeviewModule } from '../dropdown-treeview-select/dropdown-treeview.module';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
// import { NgxPasswordToggleModule } from 'ngx-password-toggle';
import { CranesService } from 'src/app/services/cranes.service';
import { EditCranesComponent } from './edit-cranes/edit-cranes.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    TooltipModule.forRoot(),
    AlertModule.forRoot(),
    TreeviewModule.forRoot(),
    DropdownTreeviewModule,
    CranesRoutingModule,
    // NgxPasswordToggleModule,
  ],
  providers: [CranesService],
  declarations: [CranesComponent, EditCranesComponent],
})
export class CranesModule {}
