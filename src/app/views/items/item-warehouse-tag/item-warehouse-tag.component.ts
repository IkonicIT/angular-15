import { Component, OnInit, TemplateRef } from '@angular/core';
import { CompanyManagementService } from '../../../services/company-management.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ItemManagementService } from '../../../services';
import { Location } from '@angular/common';

@Component({
  selector: 'app-item-warehousetag',
  templateUrl: './item-warehouse-tag.component.html',
  styleUrls: ['./item-warehouse-tag.component.scss'],
})
export class ItemWareHouseTagComponent implements OnInit {
  companyId: string;
  itemId: string;
  model: any;
  attributes: any;
  companyName: string = '';
  order: string = 'date';
  globalCompany: any;
  repair: any;
  constructor(
    private companyManagementService: CompanyManagementService,
    private _location: Location,
    private itemManagementService: ItemManagementService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.itemId = route.snapshot.params['itemId'];
    this.globalCompany = this.companyManagementService.getGlobalCompany();
    if (this.globalCompany) {
      this.companyName = this.globalCompany.name;
    }
    this.companyManagementService.globalCompanyChange.subscribe((value) => {
      this.globalCompany = value;
      this.companyName = value.name;
    });
    this.model = this.itemManagementService.item;

    this.itemManagementService
      .getLastRepairAndRepairBy(this.itemId)
      .subscribe((response) => {
        this.repair = response;
        if (this.repair.lastRepairDate != null) {
          this.repair.lastRepairDate = this.repair.lastRepairDate.split(' ')[0];
        } else {
          this.repair.lastRepairDate = 'N/A';
        }
        if (this.repair.repairBy == null) this.repair.repairBy = 'N/A';
      });
    this.itemManagementService
      .getAttributesForReplacements(this.itemId)
      .subscribe((response) => {
        this.attributes = response;
      });

    setTimeout(() => {
      this.print();
    }, 3000);
  }

  ngOnInit() {}

  print(): void {
    let printContents, popupWin: any;
    printContents = document.getElementById('print-section')!.innerHTML;
    popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=100%');
    popupWin?.document.open();
    popupWin?.document.write(printContents);
    popupWin?.focus();
    popupWin?.print();
    popupWin?.document.close();
  }

  back() {
    this._location.back();
  }
}
