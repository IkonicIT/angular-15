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
  companyId: number = 0;
  itemId: string | null = null;
  transferLogId: string = '';
  model: any;
  item: any;
  attributes: any;
  itemTransfer: any;
  companyName: string = '';
  order: string = 'date';
  globalCompany: any;
  loader = false;

  constructor(
    private companyManagementService: CompanyManagementService,
    private _location: Location,
    private itemManagementService: ItemManagementService,
    private router: Router,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService
  ) {
    this.transferLogId = this.route.snapshot.params['transferLogId'] ?? '';

    if (this.transferLogId) {
      this.getItemTransferDetails(this.transferLogId);
    }

    this.globalCompany = this.companyManagementService.getGlobalCompany();
    if (this.globalCompany) {
      this.companyName = this.globalCompany.name;
      this.companyId = this.globalCompany.companyId;
    }

    this.companyManagementService.globalCompanyChange.subscribe((value) => {
      this.globalCompany = value;
      this.companyName = value.name;
      this.companyId = value.companyId;
    });

    this.itemId = sessionStorage.getItem('transferItemId');
    if (this.itemId) {
      this.itemManagementService.getItemDetails(this.itemId).subscribe(
        (response) => {
          this.item = response;
        },
        () => {}
      );

      this.itemManagementService
        .getAttributesForReplacements(this.itemId)
        .subscribe(
          (response) => {
            this.attributes = response;
          },
          () => {}
        );
    }

    setTimeout(() => {
      this.print();
    }, 2000);
  }

  ngOnInit(): void {}

  print(): void {
    const printContents = document.getElementById('print-section')?.innerHTML;
    if (!printContents) return;

    const popupWin = window.open(
      '',
      '_blank',
      'top=0,left=0,height=100%,width=100%'
    );

    if (popupWin) {
      popupWin.document.open();
      popupWin.document.write(printContents);
      popupWin.focus();
      popupWin.print();
      popupWin.document.close();
    }
  }

  getItemTransferDetails(transferLogId: string): void {
    this.spinner.show();

    this.itemManagementService.getItemTransferDetails(transferLogId).subscribe(
      (response) => {
        this.spinner.hide();

        this.model = response;
        if (this.model?.transfeDate) {
          this.model.transfeDate = this.model.transfeDate.split(' ')[0];
        }
        this.itemTransfer = response;
      },
      () => {
        this.spinner.hide();
      }
    );
  }

  back(): void {
    this.router.navigate([
      `../items/viewtItemTransfer/${this.transferLogId}`,
    ]);
  }
}
