import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PartsRoutingModule } from './parts-routing.module';
import { FormsModule } from '@angular/forms';
import { AlertModule } from 'ngx-bootstrap/alert';
import { TreeviewModule } from 'ngx-treeview';
import { DropdownTreeviewModule } from '../dropdown-treeview-select/dropdown-treeview.module';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
// import { NgxPasswordToggleModule } from 'ngx-password-toggle';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgPipesModule } from 'ngx-pipes';
import { PartsService } from 'src/app/services/parts.service';
import { PartsComponent } from './manage-parts/parts.component';
import { EditPartComponent } from './edit-parts/edit-parts.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    TooltipModule.forRoot(),
    AlertModule.forRoot(),
    TreeviewModule.forRoot(),
    DropdownTreeviewModule,
    PartsRoutingModule,
    // NgxPasswordToggleModule,
    NgxPaginationModule,
    NgPipesModule,
    ReactiveFormsModule,
  ],
  providers: [PartsService],
  declarations: [PartsComponent, EditPartComponent],
})
export class PartsModule {}
