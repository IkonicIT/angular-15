import { Component, OnInit } from '@angular/core';
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
  companyId: string = '';
  itemId: string;
  model: any;
  attributes: any;
  companyName = '';
  order = 'date';
  globalCompany: any;
  repair: any;

  constructor(
    private companyManagementService: CompanyManagementService,
    private _location: Location,
    private itemManagementService: ItemManagementService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.itemId = this.route.snapshot.params['itemId'];

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
        if (this.repair) {
          this.repair.lastRepairDate = this.repair.lastRepairDate
            ? this.repair.lastRepairDate.split(' ')[0]
            : 'N/A';
          this.repair.repairBy = this.repair.repairBy ? this.repair.repairBy : 'N/A';
        }
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
    const printContents = document.getElementById('print-section');

    if (printContents) {
      const printFrame: HTMLIFrameElement = document.createElement('iframe');
      printFrame.style.display = 'none';
      document.body.appendChild(printFrame);

      if (printFrame.contentDocument) {
        printFrame.contentDocument.open();
        printFrame.contentDocument.write(`
          <html>
            <head>
              <title>Print</title>
            </head>
            <body>${printContents.innerHTML}</body>
          </html>
        `);
        printFrame.contentDocument.close();
      }

      if (printFrame.contentWindow) {
        printFrame.contentWindow.onafterprint = () => {
          document.body.removeChild(printFrame);
        };
        printFrame.contentWindow.print();
      }
    }
  }

  back() {
    this._location.back();
  }
}
