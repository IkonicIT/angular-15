import {
  Component,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  ElementRef,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import {
  TreeviewConfig,
  TreeviewItem,
  DropdownTreeviewComponent,
  TreeviewI18n,
  TreeviewHelper,
  DropdownDirective,
} from 'ngx-treeview';
import { DropdownTreeviewSelectI18n } from './dropdown-treeview-select-i18n';

@Component({
  selector: 'app-dropdown-treeview-select',
  templateUrl: './dropdown-treeview-select.component.html',
  styleUrls: ['./dropdown-treeview-select.component.scss'],
  providers: [{ provide: TreeviewI18n, useClass: DropdownTreeviewSelectI18n }],
})
export class DropdownTreeviewSelectComponent implements OnInit, OnChanges {
  @Input() config: TreeviewConfig = TreeviewConfig.create({
    hasAllCheckBox: true,
    hasCollapseExpand: true,
    hasFilter: true,
    maxHeight: 200,
  });

  @Input() items: TreeviewItem[] = [];
  @Input() value: any;

  @Output() valueChange = new EventEmitter<any>();
  @Output() filterTextChange = new EventEmitter<string>();

  @ViewChild(DropdownTreeviewComponent)
  dropdownTreeviewComponent?: DropdownTreeviewComponent;

  @ViewChild('myfckvi')
  myFocusText!: ElementRef<HTMLElement>;

  dropdownDirective?: DropdownDirective;
  filterText = '';

  private dropdownTreeviewSelectI18n: DropdownTreeviewSelectI18n;

  constructor(public i18n: TreeviewI18n) {
    this.dropdownTreeviewSelectI18n = i18n as DropdownTreeviewSelectI18n;
  }

  ngOnInit(): void {
    if (this.items?.length > 0) {
      this.updateSelectedItem();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['items'] || changes['value']) {
      this.updateSelectedItem();
    }
  }

  select(item: TreeviewItem): void {
    this.selectItem(item);
  }

  onFilterChange(filterText: string, onFilterTextChange: (filterText: string) => void): void {
    onFilterTextChange(filterText);
    this.filterTextChange.emit(filterText);
  }

  private updateSelectedItem(): void {
    if (this.items && this.items.length > 0) {
      const selectedItem = TreeviewHelper.findItemInList(this.items, this.value);
      if (selectedItem) {
        this.syncSelectedItem(selectedItem);
      }
      // Do not auto-select "all" when the current value does not match an item.
    }
  }

  private selectItem(item: TreeviewItem): void {
    this.myFocusText?.nativeElement.click();

    this.syncSelectedItem(item);

    if (item && this.value !== item.value) {
      this.value = item.value;
      this.valueChange.emit(item.value);
    }
  }

  private syncSelectedItem(item: TreeviewItem): void {
    if (this.dropdownTreeviewSelectI18n.selectedItem !== item) {
      this.dropdownTreeviewSelectI18n.selectedItem = item;

      this.dropdownTreeviewComponent?.onSelectedChange([item]);
    }
  }

  private selectAll(): void {
    if (this.dropdownTreeviewComponent) {
      const allItem = this.dropdownTreeviewComponent.treeviewComponent.allItem;
      this.selectItem(allItem);
    }
  }
}
