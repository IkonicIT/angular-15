import { Component, OnInit, TemplateRef } from '@angular/core';
import { CompanyDocumentsService } from '../../../services/company-documents.service';
import { CompanyManagementService } from '../../../services/company-management.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { Router, ActivatedRoute } from '@angular/router';
import { saveAs } from 'file-saver';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-vendor-attachements',
  templateUrl: './vendor-attachements.component.html',
  styleUrls: ['./vendor-attachements.component.scss'],
})
export class VendorAttachementsComponent implements OnInit {
  companyId: string;
  model: any;
  p: any;
  userName: any;
  index: string = 'companydocument';
  documents: any[] = [];
  route: ActivatedRoute;
  router: Router;
  message: string;
  modalRef: BsModalRef;
  vendorName: string = '';
  order: string = 'description';
  reverse: string = '';
  vendorDocumentFilter: any = '';
  itemsForPagination: any = 5;
  globalCompany: any;
  helpFlag: any = false;
  constructor(
    private modalService: BsModalService,
    private companyDocumentsService: CompanyDocumentsService,
    private companyManagementService: CompanyManagementService,
    router: Router,
    route: ActivatedRoute,
    private spinner: NgxSpinnerService
  ) {
    this.companyId = route.snapshot.params['id'];
    this.router = router;
    this.route = route;
    console.log('companuyid=' + this.companyId);
    if (this.companyId) {
      this.getAllDocuments(this.companyId);
    }
  }

  ngOnInit() {
    this.userName = sessionStorage.getItem('userName');
  }

  getAllDocuments(comapnyId: string) {
    this.spinner.show();
    this.companyDocumentsService.getAllCompanyDocuments(comapnyId).subscribe(
      (response: any) => {
        this.spinner.hide();
        console.log(response);
        this.documents = response;
      },
      (error) => {
        this.spinner.hide();
      }
    );
  }

  refresh() {
    this.documents = [];
    this.getAllDocuments(this.companyId);
  }

  openModal(template: TemplateRef<any>, id: string) {
    this.index = id;
    this.modalRef = this.modalService.show(template, { class: 'modal-lg' });
  }

  addDocument() {
    console.log(this.companyId);
    this.router.navigate(['/vendor/addDocument/'], {
      queryParams: { q: this.companyId },
    });
  }

  editDocument(document: { attachmentid: any }) {
    this.router.navigate(['/vendor/editDocument/'], {
      queryParams: { q: this.companyId, a: document.attachmentid },
    });
  }

  confirm(): void {
    this.message = 'Confirmed!';
    this.spinner.show();
    this.companyDocumentsService
      .removeCompanyDocuments(this.index, this.companyId, this.userName)
      .subscribe(
        (response) => {
          this.spinner.hide();
          this.modalRef.hide();
          this.refresh();
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

  downloadDocument(companyDocument: {
    attachmentFile: string;
    contenttype: string;
    filename: string | undefined;
  }) {
    var blob = this.companyDocumentsService.b64toBlob(
      companyDocument.attachmentFile,
      companyDocument.contenttype
    ); //new Blob([companyDocument.attachmentFile], { type: 'text/plain' });
    saveAs(blob, companyDocument.filename);
  }

  print() {
    this.helpFlag = false;
    window.print();
  }

  help() {
    this.helpFlag = !this.helpFlag;
  }
}
