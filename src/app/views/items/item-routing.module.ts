import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ItemManagementComponent } from './item-management/item-management.component';
import { ItemAttributesComponent } from './item-attributes/item-attributes.component';
import { ItemTypesComponent } from './item-types/item-types.component';
import { AddItemTypeComponent } from './add-item-type/add-item-type.component';
import { EditItemTypeComponent } from './edit-item-type/edit-item-type.component';
import { ItemStatusComponent } from './item-status/item-status.component';
import { AddItemStatusComponent } from './add-item-status/add-item-status.component';
import { EditItemStatusComponent } from './edit-item-status/edit-item-status.component';
import { AddItemComponent } from './add-item/add-item.component';
import { EditItemComponent } from './edit-item/edit-item.component';
import { ItemNotesComponent } from './item-notes/item-notes.component';
import { AddItemNoteComponent } from './add-item-note/add-item-note.component';
import { EditItemNoteComponent } from './edit-item-note/edit-item-note.component';
import { ItemAttachmentsComponent } from './item-attachments/item-attachments.component';
import { AddItemAttachmentComponent } from './add-item-attachment/add-item-attachment.component';
import { EditItemAttachmentComponent } from './edit-item-attachment/edit-item-attachment.component';
import { ItemNoteAttachementsComponent } from './item-note-attachements/item-note-attachements.component';
import { EditItemNoteAttachementComponent } from './edit-item-note-attachement/edit-item-note-attachement.component';
import { AddItemNoteAttachementComponent } from './add-item-note-attachement/add-item-note-attachement.component';
import { ViewItemComponent } from './view-item/view-item.component';
import { ItemChangeLogComponent } from './item-change-log/item-change-log.component';
import { ViewItemChangeLogComponent } from './view-item-change-log/view-item-change-log.component';
import { ItemRepairItemsComponent } from './item-repair-items/item-repair-items.component';
import { ItemRepairsComponent } from './item-repairs/item-repairs.component';
import { AddItemRepairsComponent } from './add-item-repairs/add-item-repairs.component';
import { EditItemRepairsComponent } from './edit-item-repairs/edit-item-repairs.component';
import { AdvancedItemSearchComponent } from './advanced-item-search/advanced-item-search.component';
import { AdvancedSearchResultsComponent } from './advanced-search-results/advanced-search-results.component';
import { ItemTransferComponent } from './item-transfer/item-transfer.component';
import { ItemWareHouseTagComponent } from './item-warehouse-tag/item-warehouse-tag.component';
import { CloneItemComponent } from './clone-item/clone-item.component';
import { ItemTransferViewComponent } from './item-transfer-view/item-transfer-view.component';
import { AdvancedItemSearchReplacementComponent } from './advanced-item-search-replacement/advanced-item-search-replacement.component';
import { EditItemRepairItemsComponent } from './edit-item-repair-items/edit-item-repair-items.component';
import { ItemRepairAttachmentsComponent } from './item-repair-attachments/item-repair-attachments.component';
import { AddItemRepairAttachmentsComponent } from './add-item-repair-attachments/add-item-repair-attachments.component';
import { EditItemRepairAttachmentsComponent } from './edit-item-repair-attachments/edit-item-repair-attachments.component';
import { ViewItemRepairComponent } from './view-item-repair/view-item-repair.component';
import { ItemChangelogAttachmentsComponent } from './item-changelog-attachments/item-changelog-attachments.component';
import { NotesComponent } from './notes/notes.component';
import { ItemPackingListComponent } from './item-packing-list/item-packing-list.component';
import { ViewAllRepairsComponent } from './view-all-repairs/view-all-repairs.component';
import { ItemMasterSearchComponent } from './item-master-search/item-master-search.component';
import { AddItemServiceComponent } from './add-item-service/add-item-service.component';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Items',
    },
    children: [
      {
        path: '',
        redirectTo: 'list',
        pathMatch: 'full',
      },
      {
        path: 'addItem',
        component: AddItemComponent,
        data: {
          title: 'Add Item',
        },
      },
      {
        path: 'addItem/:id',
        component: AddItemComponent,
        data: {
          title: 'Add Item',
        },
      },
      {
        path: 'editItem/:id',
        component: EditItemComponent,
        data: {
          title: 'Edit Item',
        },
      },
      {
        path: 'viewItem/:id',
        component: ViewItemComponent,
        data: {
          title: 'View Item',
        },
      },
      {
        path: 'list',
        component: ItemManagementComponent,
        data: {
          title: 'list',
        },
      },
      {
        path: 'lists/:type',
        component: ItemManagementComponent,
        data: {
          title: 'list',
        },
      },
      {
        path: 'attributes/:id/:companyId',
        component: ItemAttributesComponent,
        data: {
          title: 'Attributes',
        },
      },
      {
        path: 'types',
        component: ItemTypesComponent,
        data: {
          title: 'Types',
        },
      },
      {
        path: 'addItemType',
        component: AddItemTypeComponent,
        data: {
          title: 'Add Item Type',
        },
      },
      {
        path: 'editItemType/:id/:cmpId',
        component: EditItemTypeComponent,
        data: {
          title: 'Edit Item Type',
        },
      },
      {
        path: 'status',
        component: ItemStatusComponent,
        data: {
          title: 'Status',
        },
      },
      {
        path: 'addItemStatus',
        component: AddItemStatusComponent,
        data: {
          title: 'Add item Status',
        },
      },
      {
        path: 'editItemStatus/:id',
        component: EditItemStatusComponent,
        data: {
          title: 'Edit Item Status',
        },
      },
      {
        path: 'notes/:id',
        component: ItemNotesComponent,
        data: {
          title: 'Notes',
        },
      },
      {
        path: 'addItemNotes/:id',
        component: AddItemNoteComponent,
        data: {
          title: 'Add item Notes',
        },
      },
      {
        path: 'editItemNotes/:id/:itemId',
        component: EditItemNoteComponent,
        data: {
          title: 'Edit Item Notes',
        },
      },
      {
        path: 'attachments/:id/:attachmentId',
        component: ItemAttachmentsComponent,
        data: {
          title: 'Attachment',
        },
      },
      {
        path: 'addAttachment/:id/:attachmentId',
        component: AddItemAttachmentComponent,
        data: {
          title: 'Add Item Attachment',
        },
      },
      {
        path: 'editAttachment/:id/:itemId/:attachmentId',
        component: EditItemAttachmentComponent,
        data: {
          title: 'Edit Item Attachment',
        },
      },
      {
        path: 'noteAttachments/:id/:itemId',
        component: ItemNoteAttachementsComponent,
        data: {
          title: 'Note Attachment',
        },
      },
      {
        path: 'addNoteAttachment/:id/:itemId',
        component: AddItemNoteAttachementComponent,
        data: {
          title: 'Add Note Attachment',
        },
      },
      {
        path: 'editNoteAttachment/:id/:itemId/:journalId',
        component: EditItemNoteAttachementComponent,
        data: {
          title: 'Edit Note Attachment',
        },
      },
      {
        path: 'changeLog/:itemId/:journalId',
        component: ItemChangeLogComponent,
        data: {
          title: 'Item Change Log',
        },
      },
      {
        path: 'viewChangeLogItem/:itemId/:journalId',
        component: ViewItemChangeLogComponent,
        data: {
          title: 'view Item Change Log',
        },
      },
      {
        path: 'repairItems',
        component: ItemRepairItemsComponent,
        data: {
          title: 'Item Repair Items',
        },
      },
      {
        path: 'itemRepairs/:id',
        component: ItemRepairsComponent,
        data: {
          title: 'Item Repairs',
        },
      },
      {
        path: 'addItemRepair/:itemId',
        component: AddItemRepairsComponent,
        data: {
          title: ' Add Item Repairs',
        },
      },
      {
        path: 'editItemRepairItem/:repairId',
        component: EditItemRepairItemsComponent,
        data: {
          title: ' Edit Item Repairs items',
        },
      },
      {
        path: 'editItemRepair/:itemId/:repairId',
        component: EditItemRepairsComponent,
        data: {
          title: ' Edit Item Repairs',
        },
      },
      {
        path: 'viewItemRepair/:itemId/:repairId',
        component: ViewItemRepairComponent,
        data: {
          title: ' View Item Repairs',
        },
      },
      {
        path: 'itemRepairAttachments/:repairLogId',
        component: ItemRepairAttachmentsComponent,
        data: {
          title: '  Item Repairs Attachments',
        },
      },
      {
        path: 'editItemRepairAttachments/:repairLogId/:attachmentId',
        component: EditItemRepairAttachmentsComponent,
        data: {
          title: ' Edit Item Repairs Attachments',
        },
      },
      {
        path: 'addItemRepairAttachments/:repairLogId',
        component: AddItemRepairAttachmentsComponent,
        data: {
          title: ' Add Item Repairs Attachments',
        },
      },
      {
        path: 'advancedSearch',
        component: AdvancedItemSearchComponent,
        data: {
          title: 'Advanced Item Search',
        },
      },
      {
        path: 'advancedSearchResults',
        component: AdvancedSearchResultsComponent,
        data: {
          title: 'Advanced Item Search Results',
        },
      },
      {
        path: 'advancedSearch/:itemId/:typeID',
        component: AdvancedItemSearchReplacementComponent,
        data: {
          title: 'Advanced Item Search',
        },
      },
      {
        path: 'warehousetag/:itemId',
        component: ItemWareHouseTagComponent,
        data: {
          title: 'warehousetag',
        },
      },
      {
        path: 'cloneItem/:itemId',
        component: CloneItemComponent,
        data: {
          title: 'Clone Item',
        },
      },
      {
        path: 'transferItem/:itemId',
        component: ItemTransferComponent,
        data: {
          title: 'Item transfer',
        },
      },
      {
        path: 'itemChangeLogAttachments/:itemId/:journalId',
        component: ItemChangelogAttachmentsComponent,
        data: {
          title: '  Item ChangeLog Attachments',
        },
      },
      {
        path: 'viewtItemTransfer/:transferLogID',
        component: ItemTransferViewComponent,
        data: {
          title: 'Item transfer',
        },
      },
      {
        path: 'itemNotes/:itemId/:journalId',
        component: NotesComponent,
        data: {
          title: 'Item notes',
        },
      },
      {
        path: 'viewItemPackingList/:transferLogID',
        component: ItemPackingListComponent,
        data: {
          title: 'Item Packing List',
        },
      },
      {
        path: 'viewAllRepairs/:companyId',
        component: ViewAllRepairsComponent,
        data: {
          title: 'View All Repairs',
        },
      },
      {
        path: 'masterSearch',
        component: ItemMasterSearchComponent,
        data: {
          title: 'Item Master Search',
        },
      },
      {
        path: 'itemService/:itemId',
        component: AddItemServiceComponent,
        data: {
          title: 'Add Item Service',
        },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ItemRoutingModule {}
