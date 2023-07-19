import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  SimpleChanges,
  OnChanges,
} from '@angular/core';
import {
  TreeviewConfig,
  TreeviewItem,
  DropdownTreeviewComponent,
  TreeviewI18n,
  TreeviewHelper,
  DropdownDirective,
  TreeviewComponent,
} from 'ngx-treeview';
import { DropdownTreeviewSelectI18n } from './dropdown-treeview-select-i18n';
import { isNil } from 'lodash';

@Component({
  selector: 'app-dropdown-treeview-select',
  templateUrl: './dropdown-treeview-select.component.html',
  styleUrls: ['./dropdown-treeview-select.component.scss'],
  providers: [{ provide: TreeviewI18n, useClass: DropdownTreeviewSelectI18n }],
})
export class DropdownTreeviewSelectComponent implements OnChanges {
  @Input() config: TreeviewConfig;
  @Input() items: TreeviewItem[];
  @Input() value: any;
  @Output() valueChange = new EventEmitter<any>();

  @ViewChild(DropdownTreeviewComponent)
  dropdownTreeviewComponent: DropdownTreeviewComponent;
  // @ViewChild(DropdownDirective)
  dropdownDirective: DropdownDirective;
  filterText: string;
  private dropdownTreeviewSelectI18n: DropdownTreeviewSelectI18n;

  // dropdownEnabled = true;
  // dropdownOptions: TreeviewItem[] = [
  //   new TreeviewItem({ text: 'Option 1', value: 1 }),
  //   new TreeviewItem({ text: 'Option 2', value: 2 }),
  //   new TreeviewItem({ text: 'Option 3', value: 3 }),
  // ];
  // selectedOption: TreeviewItem[];
  // dropdownConfig: TreeviewConfig = {
  //   hasDivider: false,
  //   hasAllCheckBox: false,
  //   hasFilter: true,
  //   hasCollapseExpand: false,
  //   decoupleChildFromParent: false,
  //   maxHeight: 200,
  //   // mode: 'single'
  // };

  constructor(public i18n: TreeviewI18n) {
    this.config = TreeviewConfig.create({
      hasAllCheckBox: true,
      hasCollapseExpand: true,
      hasFilter: true,
      maxHeight: 200,
    });

    /* this.dropdownConfig = TreeviewConfig.create({
      hasAllCheckBox: true,
      hasCollapseExpand: true,
      hasFilter: true,
      maxHeight: 200,
    }); */
    // this.dropdownOptions = this.getTreeViewItems();
    this.dropdownTreeviewSelectI18n = i18n as DropdownTreeviewSelectI18n;
  }

  /* private getTreeViewItems(): TreeviewItem[] {
    // Return an array of TreeviewItems representing your data
    // Example:
    return [
      new TreeviewItem({ text: 'Item 1', value: 1 }),
      new TreeviewItem({ text: 'Item 2', value: 2 }),
      new TreeviewItem({ text: 'Item 3', value: 3 }),
    ];
  } */

  ngOnInit() {
    console.log(`tree view ngonit()`, this.items);
    if (this.items && this.items.length > 0) {
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (isNil(this.value) || this.value == 0) {
      this.selectAll();
    } else {
      this.updateSelectedItem();
    }
  }

  select(item: TreeviewItem) {
    this.selectItem(item);
  }

  /* onSelectedChange(selectedItems: TreeviewItem[]) {
    console.log(selectedItems);
  } */

  private updateSelectedItem() {
    if (!isNil(this.items)) {
      const selectedItem = TreeviewHelper.findItemInList(
        this.items,
        this.value
      );
      if (selectedItem) {
        this.selectItem(selectedItem);
      } else {
        this.selectAll();
      }
    }
  }

  private selectItem(item: TreeviewItem) {
    if (this.dropdownDirective) this.dropdownDirective.close();
    if (this.dropdownTreeviewSelectI18n.selectedItem !== item) {
      this.dropdownTreeviewSelectI18n.selectedItem = item;
      if (this.value !== item.value) {
        this.value = item.value;
        this.valueChange.emit(item.value);
      }
    }
  }

  private selectAll() {
    if (this.dropdownTreeviewComponent) {
      const treeviewComponent =
        this.dropdownTreeviewComponent.treeviewComponent;
      if (TreeviewComponent) {
        const allItem = treeviewComponent.allItem;
        this.selectItem(allItem);
      }
    }
  }
}
