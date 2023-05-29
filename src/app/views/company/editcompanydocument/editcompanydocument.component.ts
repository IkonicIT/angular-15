import { Component, OnInit } from '@angular/core';
import { CompanyDocumentsService } from '../../../services/index';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-editcompanydocument',
  templateUrl: './editcompanydocument.component.html',
  styleUrls: ['./editcompanydocument.component.scss'],
})
export class EditcompanydocumentComponent implements OnInit {
  model: any = {};
  index: number = 0;
  date = Date.now();
  companyId: any;
  documentId: any;
  private sub: any;
  id: number;
  router: Router;
  helpFlag: any = false;
  userName: any;

  constructor(
    private companyDocumentsService: CompanyDocumentsService,
    router: Router,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService
  ) {
    this.companyId = route.snapshot.params['id'];
    console.log('compaanyid=' + this.companyId);
    this.router = router;
  }

  ngOnInit() {
    this.userName = sessionStorage.getItem('userName');
    this.sub = this.route.queryParams.subscribe((params) => {
      this.companyId = +params['q'] || 0;
      console.log('Query params ', this.companyId);
    });

    this.sub = this.route.queryParams.subscribe((params) => {
      this.documentId = +params['a'] || 0;
      console.log('Query params ', this.documentId);
    });
    this.spinner.show();
    this.companyDocumentsService.getCompanyDocuments(this.documentId).subscribe(
      (response) => {
        this.spinner.hide();
        this.model = response;
      },
      (error) => {
        this.spinner.hide();
      }
    );
  }

  updateCompanyDocument() {
    this.spinner.show();
    this.model.moduleType = 'companytype';
    this.model.companyID = this.companyId;
    this.model.attachmentUserLogDTO = {};
    this.model.updatedBy = this.userName;
    this.companyDocumentsService.updateCompanyDocument(this.model).subscribe(
      (response) => {
        this.spinner.hide();
        window.scroll(0, 0);
        this.index = 1;
        setTimeout(() => {
          this.index = 0;
        }, 7000);
        this.router.navigate(['/company/documents/' + this.companyId]);
      },
      (error) => {
        this.spinner.hide();
      }
    );
  }

  cancelCompanyDocument() {
    this.router.navigate(['/company/documents/' + this.companyId]);
  }
  print() {
    this.helpFlag = false;
    window.print();
  }
  help() {
    this.helpFlag = !this.helpFlag;
  }
}
