import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ItemManagementComponent } from './item-management/item-management.component';
import { ItemTypesComponent } from './item-types/item-types.component';
import { ItemStatusComponent } from './item-status/item-status.component';
import { ItemAttributesComponent } from './item-attributes/item-attributes.component';
import { AddItemTypeComponent } from './add-item-type/add-item-type.component';
import { EditItemTypeComponent } from './edit-item-type/edit-item-type.component';
import { AddItemStatusComponent } from './add-item-status/add-item-status.component';
import { EditItemStatusComponent } from './edit-item-status/edit-item-status.component';
import { ItemRoutingModule } from './item-routing.module';
import { FormsModule } from '@angular/forms';
import { AlertModule } from 'ngx-bootstrap/alert';
import { ModalModule } from 'ngx-bootstrap/modal';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgPipesModule } from 'ngx-pipes';
import { AddItemComponent } from './add-item/add-item.component';
import { EditItemComponent } from './edit-item/edit-item.component';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { ItemAttachmentsComponent } from './item-attachments/item-attachments.component';
import { AddItemAttachmentComponent } from './add-item-attachment/add-item-attachment.component';
import { EditItemAttachmentComponent } from './edit-item-attachment/edit-item-attachment.component';
import { ItemNotesComponent } from './item-notes/item-notes.component';
import { AddItemNoteComponent } from './add-item-note/add-item-note.component';
import { EditItemNoteComponent } from './edit-item-note/edit-item-note.component';
import { ItemNoteAttachementsComponent } from './item-note-attachements/item-note-attachements.component';
import { AddItemNoteAttachementComponent } from './add-item-note-attachement/add-item-note-attachement.component';
import { EditItemNoteAttachementComponent } from './edit-item-note-attachement/edit-item-note-attachement.component';
import { ViewItemComponent } from './view-item/view-item.component';
import { ItemRepairItemsComponent } from './item-repair-items/item-repair-items.component';
import { ItemChangeLogComponent } from './item-change-log/item-change-log.component';
import { ViewItemChangeLogComponent } from './view-item-change-log/view-item-change-log.component';
import { ItemRepairsComponent } from './item-repairs/item-repairs.component';
import { AddItemRepairsComponent } from './add-item-repairs/add-item-repairs.component';
import { EditItemRepairsComponent } from './edit-item-repairs/edit-item-repairs.component';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';
import { TreeviewModule } from 'ngx-treeview';
import { DropdownTreeviewModule } from '../dropdown-treeview-select/dropdown-treeview.module';
import { AdvancedItemSearchComponent } from './advanced-item-search/advanced-item-search.component';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { AdvancedSearchResultsComponent } from './advanced-search-results/advanced-search-results.component';
import { ItemTransferComponent } from './item-transfer/item-transfer.component';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { ItemWareHouseTagComponent } from './item-warehouse-tag/item-warehouse-tag.component';
import { CloneItemComponent } from './clone-item/clone-item.component';
import { ItemTransferViewComponent } from './item-transfer-view/item-transfer-view.component';
import { ImageViewerModule } from 'ngx-image-viewer';
import { NgxSortableModule } from 'ngx-sortable';
import { AdvancedItemSearchReplacementComponent } from './advanced-item-search-replacement/advanced-item-search-replacement.component';
import { EditItemRepairItemsComponent } from './edit-item-repair-items/edit-item-repair-items.component';
import { ItemRepairAttachmentsComponent } from './item-repair-attachments/item-repair-attachments.component';
import { EditItemRepairAttachmentsComponent } from './edit-item-repair-attachments/edit-item-repair-attachments.component';
import { AddItemRepairAttachmentsComponent } from './add-item-repair-attachments/add-item-repair-attachments.component';
import { ViewItemRepairComponent } from './view-item-repair/view-item-repair.component';
import { ItemChangelogAttachmentsComponent } from './item-changelog-attachments/item-changelog-attachments.component';
import { NotesComponent } from './notes/notes.component';
import { ItemPackingListComponent } from './item-packing-list/item-packing-list.component';
import { ViewAllRepairsComponent } from './view-all-repairs/view-all-repairs.component';
import { MasterSearchComponent } from './master-search/master-search.component';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { DpDatePickerModule } from 'ng2-date-picker';
import { AddItemServiceComponent } from './add-item-service/add-item-service.component';
import { ItemMasterSearchComponent } from './item-master-search/item-master-search.component';
import { NgChartsModule } from 'ng2-charts';
import { ButtonsModule } from 'ngx-bootstrap/buttons';

@NgModule({
  imports: [
    BsDatepickerModule.forRoot(),
    CommonModule,
    FormsModule,
    NgxPaginationModule,
    NgxSortableModule,
    NgPipesModule,
    AlertModule.forRoot(),
    ItemRoutingModule,
    TypeaheadModule,
    TreeviewModule.forRoot(),
    ModalModule,
    DropdownTreeviewModule,
    TabsModule.forRoot(),
    TooltipModule.forRoot(),
    ImageViewerModule.forRoot(),
    MatTabsModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatExpansionModule,
    DpDatePickerModule,
    NgChartsModule,
    ButtonsModule.forRoot(),
  ],
  exports: [AdvancedSearchResultsComponent],
  declarations: [
    ItemManagementComponent,
    ItemTypesComponent,
    ItemStatusComponent,
    ItemAttributesComponent,
    AddItemTypeComponent,
    EditItemTypeComponent,
    AddItemStatusComponent,
    EditItemStatusComponent,
    AddItemComponent,
    EditItemComponent,
    ItemAttachmentsComponent,
    AddItemAttachmentComponent,
    EditItemAttachmentComponent,
    ItemNotesComponent,
    AddItemNoteComponent,
    EditItemNoteComponent,
    ItemNoteAttachementsComponent,
    AddItemNoteAttachementComponent,
    EditItemNoteAttachementComponent,
    ViewItemComponent,
    ItemRepairItemsComponent,
    ItemChangeLogComponent,
    ViewItemChangeLogComponent,
    ItemRepairsComponent,
    AddItemRepairsComponent,
    EditItemRepairsComponent,
    AdvancedItemSearchComponent,
    AdvancedSearchResultsComponent,
    ItemTransferComponent,
    ItemTransferViewComponent,
    ItemWareHouseTagComponent,
    CloneItemComponent,
    AdvancedItemSearchReplacementComponent,
    EditItemRepairItemsComponent,
    ItemRepairAttachmentsComponent,
    EditItemRepairAttachmentsComponent,
    AddItemRepairAttachmentsComponent,
    ViewItemRepairComponent,
    ItemChangelogAttachmentsComponent,
    ItemChangelogAttachmentsComponent,
    NotesComponent,
    ItemPackingListComponent,
    ViewAllRepairsComponent,
    MasterSearchComponent,
    AddItemServiceComponent,
    ItemMasterSearchComponent,
  ],
})
export class ItemsModule {}
