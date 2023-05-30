import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CompanyTypesService } from '../../../services/index';
import { TemplateRef, SecurityContext } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { CompanyManagementService } from '../../../services/index';
import { NgxSpinnerService } from 'ngx-spinner';
import { TreeviewItem, TreeviewConfig } from 'ngx-treeview';

@Component({
  selector: 'app-companytypes',
  templateUrl: './companytypes.component.html',
  styleUrls: ['./companytypes.component.scss'],
})
export class CompanytypesComponent implements OnInit {
  companyId: string;
  model: any;
  index: string = 'companytype';
  types: any = [];
  router: Router;
  message: string;
  modalRef: BsModalRef;
  companyName: string = '';
  order: string = 'nameOfType';
  reverse: string = '';
  companyTypeFilter: any = '';
  itemsForPagination: any = 5;
  globalCompany: any;
  currentRole: any;
  highestRank: any;
  helpFlag: any = false;
  userName: any;
  p: any;

  constructor(
    private modalService: BsModalService,
    private companyTypesService: CompanyTypesService,
    private companyManagementService: CompanyManagementService,
    router: Router,
    route: ActivatedRoute,
    private spinner: NgxSpinnerService
  ) {
    this.companyId = route.snapshot.params['id'];
    this.router = router;
    console.log('companuyid=' + this.companyId);
    if (this.companyId) {
      this.getAllTypes(this.companyId);
    } else {
      this.globalCompany = this.companyManagementService.getGlobalCompany();
      this.companyName = this.globalCompany.name;
      this.companyId = this.globalCompany.companyid;
      this.getAllTypes(this.globalCompany.companyid);
    }
    this.companyManagementService.globalCompanyChange.subscribe((value) => {
      this.globalCompany = value;
      this.companyName = value.name;
      this.companyId = value.companyid;
    });
  }

  ngOnInit() {
    this.currentRole = sessionStorage.getItem('currentRole');
    this.highestRank = sessionStorage.getItem('highestRank');
    console.log('currentRole is' + this.currentRole);
    console.log('highestRank is' + this.highestRank);
  }

  getAllTypes(companyId: string) {
    this.spinner.show();
    this.types = [];
    this.companyTypesService.getAllCompanyTypes(companyId).subscribe(
      (response) => {
        this.spinner.hide();
        this.types = response;
        this.types.forEach((type: { parentid: string }) => {
          if (!type.parentid) {
            type.parentid = 'Top Level';
          }
        });
      },
      (error) => {
        this.spinner.hide();
      }
    );
  }

  openModal(template: TemplateRef<any>, id: string) {
    this.index = id;
    this.modalRef = this.modalService.show(template, { class: 'modal-lg' });
  }

  closeFirstModal() {
    this.modalRef.hide();
    // this.modalRef = null;
  }

  addCompanyType() {
    this.router.navigate(['/company/addCompanyType/'], {
      queryParams: { q: this.companyId },
    });
  }

  editCompanyType(company: { typeid: any }) {
    this.router.navigate(['/company/editCompanyType/'], {
      queryParams: { q: this.companyId, a: company.typeid },
    });
  }

  gotoAttributesForType(companyType: { typeid: string }) {
    this.router.navigate([
      '/company/attributes/' + companyType.typeid + '/' + this.companyId,
    ]);
  }

  confirm(): void {
    this.message = 'Confirmed!';
    this.spinner.show();
    this.userName = sessionStorage.getItem('userName');
    this.companyTypesService
      .removeCompanyType(this.index, this.userName)
      .subscribe(
        (response) => {
          this.spinner.hide();
          this.modalRef.hide();
          this.getAllTypes(this.companyId);
        },
        (error) => {
          this.spinner.hide();
        }
      );
  }

  decline(): void {
    this.message = 'Declined!';
    this.modalRef.hide();
  }

  setOrder(value: string) {
    if (this.order === value) {
      if (this.reverse == '') {
        this.reverse = '-';
      } else {
        this.reverse = '';
      }
    }
    this.order = value;
  }

  print() {
    this.helpFlag = false;
    window.print();
  }
  help() {
    this.helpFlag = !this.helpFlag;
  }
}
