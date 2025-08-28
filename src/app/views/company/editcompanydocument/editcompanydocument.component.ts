import { Component, OnInit, OnDestroy } from '@angular/core';
import { CompanyDocumentsService } from '../../../services/index';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-editcompanydocument',
  templateUrl: './editcompanydocument.component.html',
  styleUrls: ['./editcompanydocument.component.scss'],
})
export class EditcompanydocumentComponent implements OnInit, OnDestroy {
  model: any = {};
  index: number = 0;
  date: number = Date.now();
  companyId: number | null = null;
  documentId: number | null = null;
  private sub: Subscription[] = [];
  id!: number;
  helpFlag: boolean = false;
  userName: string | null = null;
  dismissible: boolean = true;
  loader: boolean = false;

  constructor(
    private companyDocumentsService: CompanyDocumentsService,
    private router: Router,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService
  ) {
    this.companyId = Number(this.route.snapshot.params['id']);
    console.log('companyId =', this.companyId);
  }

  ngOnInit(): void {
    this.userName = sessionStorage.getItem('userName');

    const sub1 = this.route.queryParams.subscribe((params) => {
      this.companyId = params['q'] ? Number(params['q']) : 0;
      console.log('Query params companyId =', this.companyId);
    });

    const sub2 = this.route.queryParams.subscribe((params) => {
      this.documentId = params['a'] ? Number(params['a']) : 0;
      console.log('Query params documentId =', this.documentId);
    });

    this.sub.push(sub1, sub2);

    this.spinner.show();

    if (this.documentId !== null) {
      this.companyDocumentsService.getCompanyDocuments(this.documentId).subscribe(
        (response: any) => {
          this.spinner.hide();
          this.model = response;
        },
        () => this.spinner.hide()
      );
    }
  }

  updateCompanyDocument(): void {
    if (!this.companyId) return;

    this.spinner.show();
    console.log(this.companyId);

    this.model.moduleType = 'companytype';
    this.model.companyId = this.companyId;
    this.model.attachmentUserLogDTO = {};
    this.model.updatedBy = this.userName;

    this.companyDocumentsService.updateCompanyDocument(this.model).subscribe(
      () => {
        this.spinner.hide();
        window.scroll(0, 0);
        this.index = 1;
        setTimeout(() => {
          this.index = 0;
        }, 7000);
        this.router.navigate(['/company/documents', this.companyId]);
      },
      () => this.spinner.hide()
    );
  }

  cancelCompanyDocument(): void {
    if (this.companyId !== null) {
      this.router.navigate(['/company/documents', this.companyId]);
    }
  }

  print(): void {
    this.helpFlag = false;
    window.print();
  }

  help(): void {
    this.helpFlag = !this.helpFlag;
  }

  ngOnDestroy(): void {
    this.sub.forEach((s) => s.unsubscribe());
  }
}
