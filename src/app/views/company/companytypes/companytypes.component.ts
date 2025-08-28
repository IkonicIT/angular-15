import { Component, OnInit, TemplateRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CompanyTypesService } from '../../../services/index';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { CompanyManagementService } from '../../../services/index';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-companytypes',
  templateUrl: './companytypes.component.html',
  styleUrls: ['./companytypes.component.scss'],
})
export class CompanytypesComponent implements OnInit {
  companyId!: string;
  model: any;
  index: string = 'companytype';
  types: any[] = [];
  message: string = '';
  modalRef!: BsModalRef;
  companyName: string = '';
  order: string = 'nameOfType';
  reverse: string = '';
  companyTypeFilter: any = '';
  itemsForPagination: number = 5;
  globalCompany: any;
  currentRole: any;
  highestRank: any;
  helpFlag: boolean = false;
  userName: any;
  p: number = 1;
  loader = false;

  constructor(
    private modalService: BsModalService,
    private companyTypesService: CompanyTypesService,
    private companyManagementService: CompanyManagementService,
    private router: Router,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService
  ) {
    this.companyId = this.route.snapshot.params['id'];
    if (this.companyId) {
      this.getAllTypes(this.companyId);
    } else {
      this.globalCompany = this.companyManagementService.getGlobalCompany();
      this.companyName = this.globalCompany.name;
      this.companyId = this.globalCompany.companyId;
      this.getAllTypes(this.globalCompany.companyId);
    }
    this.companyManagementService.globalCompanyChange.subscribe((value) => {
      this.globalCompany = value;
      this.companyName = value.name;
      this.companyId = value.companyId;
    });
  }

  ngOnInit(): void {
    this.currentRole = sessionStorage.getItem('currentRole');
    this.highestRank = sessionStorage.getItem('highestRank');
    console.log('currentRole is ' + this.currentRole);
    console.log('highestRank is ' + this.highestRank);
  }

  getAllTypes(companyId: string): void {
    this.spinner.show();
    this.types = [];
    this.companyTypesService.getAllCompanyTypes(companyId).subscribe(
      (response: any[]) => {
        this.spinner.hide();
        this.types = response;
        console.log(response);
        this.types.forEach((type: { parentId?: string }) => {
          if (!type.parentId) {
            type.parentId = 'Top Level';
          }
        });
      },
      () => {
        this.spinner.hide();
      }
    );
  }

  openModal(template: TemplateRef<any>, id: string): void {
    this.index = id;
    this.modalRef = this.modalService.show(template, { class: 'modal-lg' });
  }

  closeFirstModal(): void {
    if (this.modalRef) {
      this.modalRef.hide();
    }
  }

  addCompanyType(): void {
    this.router.navigate(['/company/addCompanyType/'], {
      queryParams: { q: this.companyId },
    });
  }

  editCompanyType(company: any): void {
    this.router.navigate(['/company/editCompanyType/'], {
      queryParams: { q: this.companyId, a: company.typeId },
    });
  }

  gotoAttributesForType(companyType: any): void {
    this.router.navigate([
      '/company/attributes/' + companyType.typeId + '/' + this.companyId,
    ]);
  }

  confirm(): void {
    this.message = 'Confirmed!';
    this.spinner.show();
    this.userName = sessionStorage.getItem('userName');
    this.companyTypesService
      .removeCompanyType(this.index, this.userName)
      .subscribe(
        () => {
          this.spinner.hide();
          this.modalRef.hide();
          this.getAllTypes(this.companyId);

          const currentPage = this.p;
          const typesCount = this.types.length - 1;
          const maxPageAvailable = Math.ceil(
            typesCount / this.itemsForPagination
          );
          if (currentPage > maxPageAvailable) {
            this.p = maxPageAvailable;
          }
        },
        () => {
          this.spinner.hide();
        }
      );
  }

  decline(): void {
    this.message = 'Declined!';
    this.modalRef.hide();
  }

  setOrder(value: string): void {
    if (this.order === value) {
      this.reverse = this.reverse === '' ? '-' : '';
    }
    this.order = value;
  }

  print(): void {
    this.helpFlag = false;
    window.print();
  }

  help(): void {
    this.helpFlag = !this.helpFlag;
  }

  onChange(e: any): void {
    const currentPage = this.p;
    const typesCount = this.types.length;
    const maxPageAvailable = Math.ceil(typesCount / this.itemsForPagination);
    if (currentPage > maxPageAvailable) {
      this.p = maxPageAvailable;
    }
  }
}
