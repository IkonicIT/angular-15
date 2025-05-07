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
  transfers: any = [];
  model: any = {};
  index: number = 0;
  p: any;
  order: any;
  reverse: any;
  transferFilter: any;
  itemsForPagination = 10;
  companyId: any;
  transferLogID: any;
  globalCompany: any;
  itemTransfer: any;
  companyName: any;
  itemId: any;
  item: any;
  helpFlag: any = false;
  bsConfig: Partial<BsDatepickerConfig>;
  locationValue: any;
  itemTypeItems: TreeviewItem[];
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
      this.companyId = this.globalCompany.companyid;
    }
    this.companyManagementService.globalCompanyChange.subscribe((value) => {
      this.globalCompany = value;
      this.companyId = value.companyid;
      this.companyName = this.globalCompany.name;
    });
    this.spinner.show();

    this.itemId = sessionStorage.getItem('transferItemId');
    this.itemManagementService
      .getAllTransfers(this.itemId)
      .subscribe((response) => {
        this.transfers = response;
        this.spinner.hide();
      });
  }

  ngOnInit() {
    if (this.route.snapshot.params['transferLogID']) {
      this.transferLogID = this.route.snapshot.params['transferLogID'];
      this.getItemTransferDetails(this.transferLogID);
    }
  }

  getItemTransferDetails(transferLogID: string) {
    this.spinner.show();

    this.itemManagementService.getItemTransferDetails(transferLogID).subscribe(
      (response) => {
        this.spinner.hide();

        this.model = response;
        this.model.transfeDate = this.model.transfeDate.split(' ')[0];
        this.itemTransfer = response;
      },
      (error) => {
        this.spinner.hide();
      }
    );
  }

  view(transferLogID: string) {
    this.getItemTransferDetails(transferLogID);
    this.router.navigate(['/items/viewtItemTransfer/' + transferLogID]);
  }

  setOrder(orderType: string) {}

  back() {
    this.router.navigate(['/items/transferItem/' + this.itemId]);
  }

  help() {
    this.helpFlag = !this.helpFlag;
  }
}
