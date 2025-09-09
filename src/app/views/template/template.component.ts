import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NgxSpinnerService } from 'ngx-spinner';
import { CompanyManagementService } from '../../services';

@Component({
  selector: 'app-template',
  templateUrl: './template.component.html',
  styleUrls: ['./template.component.scss'],
})
export class TemplateComponent implements OnInit {
  templateId: number = 0;
  company: { name?: string } = {};
  model: { companyId?: string; templateName?: string } = {};
  companies: any[] = [];
  templates: any[] = [];
  companyId!: string;
  globalCompany: any;
  userName!: string;
  index = 0;
  savedCompanyName?: string;
  index1 = 0;
  savedTemplateName?: string;
  deletedTemplateName?: string;
  helpFlag = false;
  modalRef?: BsModalRef;
  message = '';
  currentTemplateName?: string;
  highestRank: string | null = null;
  dismissible = true;
  loader = false;

  constructor(
    private companyManagementService: CompanyManagementService,
    private spinner: NgxSpinnerService,
    private modalService: BsModalService
  ) {
    this.globalCompany = this.companyManagementService.getGlobalCompany();
    this.companyId = this.globalCompany.companyId;
    this.companies = this.companyManagementService.getGlobalCompanyList();
  }

  ngOnInit(): void {
    this.userName = sessionStorage.getItem('userName') ?? '';
    this.highestRank = sessionStorage.getItem('highestRank');
    this.getAllTemplates(this.companyId);
  }

  getAllTemplates(companyId: string): void {
    this.spinner.show();
    this.companyManagementService.getAllTemplates(companyId).subscribe({
      next: (response) => {
        this.templates = Array.isArray(response) ? response : [];;
        this.spinner.hide();
      },
      error: () => this.spinner.hide(),
    });
  }

  saveCompany(): void {
    if (this.templateId === 0) {
      this.index = -1;
      return;
    }

    if (!this.company.name) {
      this.index = -2;
      return;
    }

    const req: any = {
      templateId: this.templateId,
      companyName: this.company.name,
      userName: this.userName,
      isPartnerCompany: this.highestRank === '10',
    };

    if (this.highestRank === '10' || this.highestRank === '0') {
      req.userId = sessionStorage.getItem('userId');
    }

    this.spinner.show();
    this.companyManagementService.saveCompanyFromTemplate(req).subscribe({
      next: () => {
        this.savedCompanyName = this.company.name;
        this.company.name = '';
        this.companyManagementService.setCompaniesListModified(true);
        this.spinner.hide();
      },
      error: () => this.spinner.hide(),
    });
  }

  openModal(template: TemplateRef<any>, id: number): void {
    this.templateId = id;
    if (this.templateId === 0) {
      this.index = -1;
    } else {
      this.modalRef = this.modalService.show(template, { class: 'modal-lg' });
    }
  }

  confirm(): void {
    this.message = 'Confirmed!';

    if (this.templateId === 0) {
      this.index = -1;
      this.spinner.hide();
      this.modalRef?.hide();
      return;
    }

    this.spinner.show();
    this.setTemplateName(this.templateId);

    this.companyManagementService
      .removeTemplate(String(this.templateId), this.companyId, this.userName, String(this.currentTemplateName))
      .subscribe({
        next: () => {
          this.modalRef?.hide();
          this.index = 2;
          this.deletedTemplateName = this.currentTemplateName;
          setTimeout(() => (this.index = 0), 5000);
          this.templateId = 0;
          this.getAllTemplates(this.companyId);
          this.spinner.hide();
        },
        error: () => this.spinner.hide(),
      });
  }

  setTemplateName(templateId: number): void {
    const template = this.templates.find((t: any) => t.templateId === templateId);
    this.currentTemplateName = template?.name;
  }

  decline(): void {
    this.message = 'Declined!';
    this.modalRef?.hide();
  }

  saveTemplate(): void {
    if (!this.model.companyId) {
      this.index1 = -1;
      return;
    }

    if (!this.model.templateName) {
      this.index1 = -2;
      return;
    }

    const req = {
      companyId: this.model.companyId,
      userName: this.userName,
      templateName: this.model.templateName,
      includeAllElements: false,
    };

    this.spinner.show();
    this.companyManagementService.saveTemplate(req).subscribe({
      next: (response: any) => {
        this.savedTemplateName = response.name;
        this.index1 = 1;
        setTimeout(() => (this.index1 = 0), 5000);
        this.model = {};
        this.getAllTemplates(this.companyId);
        this.spinner.hide();
      },
      error: () => this.spinner.hide(),
    });
  }

  help(): void {
    this.helpFlag = !this.helpFlag;
  }
}