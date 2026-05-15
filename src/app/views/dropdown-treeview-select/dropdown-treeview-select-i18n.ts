import {DefaultTreeviewI18n, TreeviewItem, TreeviewSelection} from "ngx-treeview";
import { Injectable } from '@angular/core';

@Injectable()
export class DropdownTreeviewSelectI18n extends DefaultTreeviewI18n {
    private internalSelectedItem: TreeviewItem | null = null;

    set selectedItem(value: TreeviewItem | null) {
        this.internalSelectedItem = value;
        console.log(`[treeview] selectedItem value ${value} and this.internalSelectedItem  ${this.internalSelectedItem }`);
    }

    get selectedItem(): TreeviewItem | null {
        return this.internalSelectedItem;
    }

    override getText(selection: TreeviewSelection): string {
        return this.internalSelectedItem ? this.internalSelectedItem.text : 'All';
    }
}