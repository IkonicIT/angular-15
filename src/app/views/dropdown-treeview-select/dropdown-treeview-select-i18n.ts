import { Injectable } from '@angular/core';
import { DefaultTreeviewI18n, TreeviewItem, TreeviewSelection } from 'ngx-treeview';

@Injectable()
export class DropdownTreeviewSelectI18n extends DefaultTreeviewI18n {
  private internalSelectedItem?: TreeviewItem;

  set selectedItem(value: TreeviewItem | undefined) {
    this.internalSelectedItem = value;
  }

  get selectedItem(): TreeviewItem | undefined {
    return this.internalSelectedItem;
  }

  override getText(selection: TreeviewSelection): string {
    return this.internalSelectedItem?.text ?? 'All';
  }
}
