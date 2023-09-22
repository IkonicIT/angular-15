import { Component, OnInit } from '@angular/core';
import { CompanyDocumentsService } from '../../../services/index';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Location } from '@angular/common';
import { CompanyManagementService } from '../../../services/company-management.service';
import { BroadcasterService } from '../../../services/broadcaster.service';
@Component({
  selector: 'app-edit-item-repair-attachments',
  templateUrl: './edit-item-repair-attachments.component.html',
  styleUrls: ['./edit-item-repair-attachments.component.scss'],
})
export class EditItemRepairAttachmentsComponent implements OnInit {
  model: any = {};
  index: number = 0;
  date = Date.now();
  companyName: string;
  globalCompany: any;
  userName: any;
  companyId: number = 0;
  repairlogid: number;
  documentId: number = 0;
  private sub: any;
  id: number;
  router: Router;
  helpFlag: any = false;
  itemRepair: any;
  dismissible = true;
  loader = false;
  constructor(
    private companyDocumentsService: CompanyDocumentsService,
    router: Router,
    private _location: Location,
    private route: ActivatedRoute,
    private companyManagementService: CompanyManagementService,
    private spinner: NgxSpinnerService,
    private broadcasterService: BroadcasterService
  ) {
    this.companyManagementService.globalCompanyChange.subscribe((value) => {
      this.globalCompany = value;
      this.companyId = value.companyid;
    });
    this.globalCompany = this.companyManagementService.getGlobalCompany();
    if (this.globalCompany) {
      this.companyName = this.globalCompany.name;
      this.companyId = this.globalCompany.companyid;
    }

    this.repairlogid = route.snapshot.params['repairlogId'];
    console.log('repairlogid=' + this.repairlogid);
    this.documentId = route.snapshot.params['attachmentid'];
    console.log('repairlogid=' + this.documentId);
    this.router = router;
    this.spinner.show();
    this.loader = true;

    this.companyDocumentsService.getCompanyDocuments(this.documentId).subscribe(
      (response) => {
        this.spinner.hide();
        this.loader = false;
        this.model = response;
      },
      (error) => {
        this.spinner.hide();
        this.loader = false;
      }
    );
  }

  ngOnInit() {
    this.itemRepair = this.broadcasterService.itemRepair;
    this.userName = sessionStorage.getItem('userName');
  }

  updateItemRepairDocument() {
    this.spinner.show();
    this.loader = true;
    this.model.moduleType = 'itemrepairtype';
    this.model.companyID = this.companyId;
    this.model.attachmentUserLogDTO = {
      itemTag: this.itemRepair.tag,
      itemTypeName: this.itemRepair.itemtype,
      poNumber: this.itemRepair.ponumber,
      jobNumber: this.itemRepair.jobnumber,
    };
    this.model.updatedBy = this.userName;
    this.companyDocumentsService.updateCompanyDocument(this.model).subscribe(
      (response) => {
        this.spinner.hide();
        this.loader = false;
        window.scroll(0, 0);
        this.index = 1;
        setTimeout(() => {
          this.index = 0;
        }, 7000);
        this.router.navigate([
          '/items/itemRepairAttachments/' + this.repairlogid,
        ]);
      },
      (error) => {
        this.spinner.hide();
        this.loader = false;
      }
    );
  }

  cancelCompanyDocument() {
    this.router.navigate(['/company/documents/' + this.companyId]);
  }
  back() {
    this._location.back();
  }
  print() {
    this.helpFlag = false;
    window.print();
  }
  help() {
    this.helpFlag = !this.helpFlag;
  }
}
