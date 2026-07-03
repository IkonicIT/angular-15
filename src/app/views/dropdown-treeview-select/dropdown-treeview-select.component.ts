import {
  Component,
  Input,
  Output,
  EventEmitter,
  ElementRef,
  ViewChild,
  SimpleChanges,
  OnChanges,
  OnInit
} from '@angular/core';

import {
  TreeviewConfig,
  TreeviewItem,
  DropdownTreeviewComponent,
  TreeviewI18n,
  TreeviewHelper,
  DropdownDirective
} from 'ngx-treeview';

import { DropdownTreeviewSelectI18n } from './dropdown-treeview-select-i18n';

@Component({
  selector: 'app-dropdown-treeview-select',
  templateUrl: './dropdown-treeview-select.component.html',
  styleUrls: ['./dropdown-treeview-select.component.scss'],
  providers: [
    { provide: TreeviewI18n, useClass: DropdownTreeviewSelectI18n }
  ]
})
export class DropdownTreeviewSelectComponent
  implements OnInit, OnChanges {

  @Input() config: TreeviewConfig;
  @Input() items: TreeviewItem[] = [];
  @Input() value: any;

  @Output() valueChange = new EventEmitter<any>();
  @Output() filterTextChange = new EventEmitter<string>();

  @ViewChild(DropdownTreeviewComponent)
  dropdownTreeviewComponent: DropdownTreeviewComponent | null = null;

  @ViewChild(DropdownDirective)
  dropdownDirective: DropdownDirective | null = null;

  @ViewChild(DropdownTreeviewComponent, { read: ElementRef })
  dropdownTreeviewElement: ElementRef<HTMLElement> | null = null;

  filterText: string = '';

  private dropdownTreeviewSelectI18n: DropdownTreeviewSelectI18n;

  constructor(public i18n: TreeviewI18n) {

    this.config = TreeviewConfig.create({
      hasAllCheckBox: false,
      hasCollapseExpand: true,
      hasFilter: true,
      maxHeight: 200
    });

    this.dropdownTreeviewSelectI18n =
      i18n as unknown as DropdownTreeviewSelectI18n;
  }

  ngOnInit(): void {
    console.log('tree view ngOnInit()', this.items);
  }

  ngOnChanges(changes: SimpleChanges): void {

    if (
      (changes['value'] || changes['items']) &&
      this.value != null &&
      this.items &&
      this.items.length > 0
    ) {
      this.updateSelectedItem();
    }
  }

  select(item: TreeviewItem): void {

    if (!item) {
      return;
    }

    this.selectItem(item);
  }

  onFilterChange(
    filterText: string,
    onFilterTextChange: (filterText: string) => void
  ): void {

    onFilterTextChange(filterText);
    this.filterTextChange.emit(filterText);
  }

  private updateSelectedItem(): void {

    if (!this.items) {
      return;
    }

    let selectedItem: TreeviewItem | null =
      TreeviewHelper.findItemInList(this.items, this.value);

    if (!selectedItem && this.value != null) {
      selectedItem = this.findItemByValue(this.items, this.value);
    }

    if (selectedItem) {
      this.syncSelectedItem(selectedItem);
    } else {
      this.clearSelection();
    }
  }

  private findItemByValue(items: TreeviewItem[], value: any): TreeviewItem | null {
    if (!items) {
      return null;
    }

    const target = value != null ? value.toString() : value;

    for (const item of items) {
      if (item.value != null && item.value.toString() === target) {
        return item;
      }
      if (item.children && item.children.length > 0) {
        const childMatch = this.findItemByValue(item.children, value);
        if (childMatch) {
          return childMatch;
        }
      }
    }

    return null;
  }

  private selectItem(item: TreeviewItem): void {

    this.syncSelectedItem(item);

    if (this.value !== item.value) {
      this.value = item.value;
      this.valueChange.emit(item.value);
    }

    this.closeDropdown();
  }

  private closeDropdown(): void {
    if (this.dropdownDirective) {
      this.dropdownDirective.close();
      return;
    }

    if (this.dropdownTreeviewElement) {
      this.dropdownTreeviewElement.nativeElement.dispatchEvent(
        new MouseEvent('click', {
          bubbles: true,
          cancelable: true,
          view: window
        })
      );
    }
  }

  private syncSelectedItem(item: TreeviewItem): void {

    if (this.dropdownTreeviewSelectI18n.selectedItem === item) {
      return;
    }

    this.dropdownTreeviewSelectI18n.selectedItem = item;

    if (this.dropdownTreeviewComponent) {
      this.dropdownTreeviewComponent.onSelectedChange([item]);
    }
  }

  private clearSelection(): void {

    this.dropdownTreeviewSelectI18n.selectedItem = null;

    if (this.dropdownTreeviewComponent) {
      this.dropdownTreeviewComponent.onSelectedChange([]);
    }
  }

  private selectAll(): void {

    if (
      this.dropdownTreeviewComponent &&
      this.dropdownTreeviewComponent.treeviewComponent
    ) {

      var allItem =
        this.dropdownTreeviewComponent.treeviewComponent.allItem;

      if (allItem) {
        this.selectItem(allItem);
      }
    }
  }
}
