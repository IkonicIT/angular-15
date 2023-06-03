import { Component, OnInit } from '@angular/core';
import { CompanyManagementService } from '../../../services/company-management.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ItemManagementService } from '../../../services';
import { NgxSpinnerService } from 'ngx-spinner';
import { Location } from '@angular/common';

@Component({
  selector: 'app-item-packing-list',
  templateUrl: './item-packing-list.component.html',
  styleUrls: ['./item-packing-list.component.scss'],
})
export class ItemPackingListComponent implements OnInit {
  companyId: string;
  itemId: string | null;
  transferLogID: string;
  model: any;
  item: any;
  attributes: any;
  itemTransfer: any;
  companyName: string = '';
  order: string = 'date';
  globalCompany: any;

  constructor(
    private companyManagementService: CompanyManagementService,
    private _location: Location,
    private itemManagementService: ItemManagementService,
    private router: Router,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService
  ) {
    this.transferLogID = route.snapshot.params['transferLogID'];
    this.getItemTransferDetails(this.transferLogID);
    this.globalCompany = this.companyManagementService.getGlobalCompany();
    if (this.globalCompany) {
      this.companyName = this.globalCompany.name;
    }
    this.companyManagementService.globalCompanyChange.subscribe((value) => {
      this.globalCompany = value;
      this.companyName = value.name;
    });
    this.itemId = sessionStorage.getItem('transferItemId');
    this.itemManagementService
      .getItemDetails(this.itemId)
      .subscribe((response) => {
        this.item = response;
      });

    this.itemManagementService
      .getAttributesForReplacements(this.itemId)
      .subscribe((response) => {
        this.attributes = response;
      });

    setTimeout(() => {
      this.print();
    }, 2000);
  }

  ngOnInit() {}
  print(): void {
    let printContents, popupWin: any;
    printContents = document.getElementById('print-section')?.innerHTML;
    popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=100%');
    popupWin.document.open();
    popupWin.document.write(printContents);
    popupWin.focus();
    popupWin.print();
    popupWin.document.close();
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

  back() {
    this.router.navigate(['../items/viewtItemTransfer/' + this.transferLogID]);
  }
}
