import { Component, OnInit, TemplateRef } from '@angular/core';
import { TreeviewItem, TreeviewConfig } from 'ngx-treeview';
import { AlertModule } from 'ngx-bootstrap/alert';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { CompanyManagementService } from '../../services';
import { NgxSpinnerService } from 'ngx-spinner';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-template',
  templateUrl: './template.component.html',
  styleUrls: ['./template.component.scss'],
})
export class TemplateComponent implements OnInit {
  templateID: any = 0;
  company: any = {};
  model: any = {};
  companies: any = [];
  templates: any = [];
  companyId: any;
  globalCompany: any;
  userName: string;
  index: number = 0;
  savedCompanyName: any;
  index1: number = 0;
  savedTemplateName: any;
  deletedTemplateName: any;
  helpFlag: any = false;
  modalRef: BsModalRef;
  message: string;
  currentTemplateName: any;
  highestRank: any;
  dismissible = true;
  loader = false;
  constructor(
    private companyManagementService: CompanyManagementService,
    private spinner: NgxSpinnerService,
    private modalService: BsModalService
  ) {
    this.globalCompany = this.companyManagementService.getGlobalCompany();
    this.companyId = this.globalCompany.companyid;
    this.companies = this.companyManagementService.getGlobalCompanyList();
  }

  ngOnInit() {
    this.userName = sessionStorage.getItem('userName') as string;
    this.highestRank = sessionStorage.getItem('highestRank');
    this.getAllTemplates(this.companyId);
  }

  getAllTemplates(companyId: string) {
    this.spinner.show();

    this.companyManagementService.getAllTemplates(companyId).subscribe(
      (response) => {
        this.spinner.hide();

        this.templates = response;
      },
      (error) => {
        this.spinner.hide();
      }
    );
  }

  saveCompany() {
    if (this.templateID == 0) {
      this.index = -1;
    } else if (this.company.name == undefined) {
      this.index = -2;
    } else {
      var req = {
        templateId: this.templateID,
        companyName: this.company.name,
        userName: this.userName,
      };
      this.spinner.show();

      this.companyManagementService.saveCompanyFromTemplate(req).subscribe(
        (response) => {
          this.spinner.hide();

          this.savedCompanyName = this.company.name;
          this.company.name = '';
          alert('Company successfully Added from Template,Refreshing List');
          this.companyManagementService.setCompaniesListModified(true);
        },
        (error) => {
          this.spinner.hide();
        }
      );
    }
  }

  openModal(template: TemplateRef<any>, id: any) {
    this.templateID = id;
    if (this.templateID == 0) {
      this.index = -1;
    } else {
      this.modalRef = this.modalService.show(template, { class: 'modal-lg' });
    }
  }

  confirm(): void {
    this.message = 'Confirmed!';
    this.spinner.show();

    if (this.templateID == 0) {
      this.index = -1;
      this.spinner.hide();

      this.modalRef.hide();
    } else {
      this.spinner.show();

      this.setTemplateName(this.templateID);
      this.companyManagementService
        .removeTemplate(
          this.templateID,
          this.companyId,
          this.userName,
          this.currentTemplateName
        )
        .subscribe((response) => {
          this.modalRef.hide();
          this.index = 2;
          this.deletedTemplateName = this.currentTemplateName;
          setTimeout(() => {
            this.index = 0;
          }, 5000);
          this.templateID = 0;
          this.getAllTemplates(this.companyId);
          this.spinner.hide();
        });
    }
  }

  setTemplateName(templateID: any) {
    this.templates.forEach((template: { templateID: any; name: any }) => {
      if (templateID == template.templateID)
        this.currentTemplateName = template.name;
    });
  }

  decline(): void {
    this.message = 'Declined!';
    this.modalRef.hide();
  }

  saveTemplate() {
    if (this.model.companyid == undefined) {
      this.index1 = -1;
    } else if (this.model.templateName == undefined) {
      this.index1 = -2;
    } else {
      var req = {
        companyId: this.model.companyid,
        userName: this.userName,
        templateName: this.model.templateName,
        includeAllElements: false,
      };
      this.spinner.show();

      this.companyManagementService.saveTemplate(req).subscribe(
        (response: any) => {
          this.savedTemplateName = response.name;
          this.index1 = 1;
          setTimeout(() => {
            this.index1 = 0;
          }, 5000);
          this.model = {};
          this.spinner.hide();

          this.getAllTemplates(this.companyId);
        },
        (error) => {
          this.spinner.hide();
        }
      );
    }
  }

  help() {
    this.helpFlag = !this.helpFlag;
  }
}
