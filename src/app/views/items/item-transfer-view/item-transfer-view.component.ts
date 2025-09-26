import { Component, OnInit } from '@angular/core';
import { CompanyManagementService } from '../../../services/company-management.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ActivatedRoute, Router } from '@angular/router';
import { ItemManagementService } from '../../../services/Items/item-management.service';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { TreeviewConfig, TreeviewItem } from 'ngx-treeview';

@Component({
  selector: 'app-item-transfer-view',
  templateUrl: './item-transfer-view.component.html',
  styleUrls: ['./item-transfer-view.component.scss'],
})
export class ItemTransferViewComponent implements OnInit {
  transfers: any[] = [];
  model: any = {};
  index = 0;
  p = 1;
  order = '';
  reverse = '';
  transferFilter = '';
  itemsForPagination = 10;

  companyId = 0;
  transferLogId = '';
  globalCompany: any = {};
  itemTransfer: any;
  companyName = '';
  itemId = '';
  item: any;

  helpFlag = false;
  bsConfig: Partial<BsDatepickerConfig> = {};
  locationValue: any;
  itemTypeItems: TreeviewItem[] = [];
  config = TreeviewConfig.create({
    hasFilter: false,
    hasCollapseExpand: false,
  });
  loader = false;

  constructor(
    private companyManagementService: CompanyManagementService,
    private itemManagementService: ItemManagementService,
    private router: Router,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService
  ) {
    this.globalCompany = this.companyManagementService.getGlobalCompany();
    if (this.globalCompany) {
      this.companyName = this.globalCompany.name;
      this.companyId = this.globalCompany.companyId;
    }

    this.companyManagementService.globalCompanyChange.subscribe((value) => {
      this.globalCompany = value;
      this.companyId = value.companyId;
      this.companyName = value.name;
    });

    this.spinner.show();
    this.itemId = sessionStorage.getItem('transferItemId') || '';

    if (this.itemId) {
      this.itemManagementService.getAllTransfers(this.itemId).subscribe((response) => {
        this.transfers = Array.isArray(response) ? response : [];
        this.spinner.hide();
      });
    } else {
      this.spinner.hide();
    }
  }

  ngOnInit() {
    const transferLogId = this.route.snapshot.params['transferLogId'];
    if (transferLogId) {
      this.transferLogId = transferLogId;
      this.getItemTransferDetails(this.transferLogId);
    }
  }

  getItemTransferDetails(transferLogId: string) {
    this.spinner.show();

    this.itemManagementService.getItemTransferDetails(transferLogId).subscribe(
      (response) => {
        this.spinner.hide();
        this.model = response || {};
        if (this.model.transfeDate) {
          this.model.transfeDate = this.model.transfeDate.split(' ')[0];
        }
        this.itemTransfer = response;
      },
      () => {
        this.spinner.hide();
      }
    );
  }

  view(transferLogId: string) {
    this.getItemTransferDetails(transferLogId);
    this.router.navigate([`/items/viewtItemTransfer/${transferLogId}`]);
  }

  setOrder(orderType: string) {
    if (this.order === orderType) {
      this.reverse = this.reverse === '' ? '-' : '';
    }
    this.order = orderType;
  }

  back() {
    this.router.navigate([`/items/transferItem/${this.itemId}`]);
  }

  help() {
    this.helpFlag = !this.helpFlag;
  }
}
