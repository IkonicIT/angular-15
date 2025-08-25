import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CompanyDocumentsService } from '../../../services/index';
import { TemplateRef, SecurityContext } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { CompanyManagementService } from '../../../services/index';
import { saveAs } from 'file-saver';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-companydocuments',
  templateUrl: './companydocuments.component.html',
  styleUrls: ['./companydocuments.component.scss'],
})
export class CompanydocumentsComponent implements OnInit {
  companyId: string;
  model: any;
  index: string = 'companydocument';
  documents: any[] = [];
  route: ActivatedRoute;
  router: Router;
  message: string;
  userName: any;
  modalRef: BsModalRef;
  companyName: string = '';
  order: string = 'description';
  reverse: string = '';
  documentFilter: any = '';
  itemsForPagination: any = 5;
  globalCompany: any;
  authToken: any;
  currentRole: any;
  highestRank: any;
  helpFlag: any = false;
  p: any;
  loader = false;
  constructor(
    private modalService: BsModalService,
    private companyDocumentsService: CompanyDocumentsService,
    private companyManagementService: CompanyManagementService,
    router: Router,
    route: ActivatedRoute,
    private spinner: NgxSpinnerService
  ) {
    this.companyId = route.snapshot.params['id'];
    this.authToken = sessionStorage.getItem('auth_token');
    this.router = router;
    this.route = route;
    console.log('companuyid=' + this.companyId);
    if (this.companyId) {
      this.getAllDocuments(this.companyId);
    } else {
      this.globalCompany = this.companyManagementService.getGlobalCompany();
      if (this.globalCompany) {
        this.companyName = this.globalCompany.name;
        this.companyId = this.globalCompany.companyId;
        this.getAllDocuments(this.globalCompany.companyId);
      }
    }
    this.companyManagementService.globalCompanyChange.subscribe((value) => {
      this.globalCompany = value;
      this.companyName = value.name;
      this.companyId = value.companyId;
    });
  }

  ngOnInit() {
    this.userName = sessionStorage.getItem('userName');
    this.currentRole = sessionStorage.getItem('currentRole');
    this.highestRank = sessionStorage.getItem('highestRank');
  }

  getAllDocuments(companyId: string) {
    this.spinner.show();

    this.companyDocumentsService.getAllCompanyDocuments(companyId).subscribe(
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
    this.router.navigate(['/company/addDocument/'], {
      queryParams: { q: this.companyId },
    });
  }

  editDocument(document: { attachmentId: any }) {
    this.router.navigate(['/company/editDocument/'], {
      queryParams: { q: this.companyId, a: document.attachmentId },
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
          const currentPage = this.p;
          const DocumentCount = this.documents.length - 1;
          const maxPageAvailable = Math.ceil(
            DocumentCount / this.itemsForPagination
          );
          if (currentPage > maxPageAvailable) {
            this.p = maxPageAvailable;
          }
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

  download(companyDocument: any) {
    if (companyDocument.isNew == false) {
      this.downloadFile(companyDocument);
    } else {
      this.downloadDocumentFromDB(companyDocument);
    }
  }

  downloadDocumentFromDB(document: { attachmentId: number }) {
    this.spinner.show();

    this.companyDocumentsService
      .getCompanyDocuments(document.attachmentId)
      .subscribe(
        (response) => {
          this.spinner.hide();

          this.downloadDocument(response);
        },
        (error) => {
          this.spinner.hide();
        }
      );
  }

  downloadDocument(companyDocument: any) {
    var blob = this.companyDocumentsService.b64toBlob(
      companyDocument.attachmentFile,
      companyDocument.contentType
    );
    var fileURL = URL.createObjectURL(blob);

    window.open(fileURL);
  }

  downloadFile(companyDocument: { fileName: any; attachmentId: string }) {
    var index = companyDocument.fileName.lastIndexOf('.');
    var extension = companyDocument.fileName.slice(index + 1);
    if (extension.toLowerCase() == 'pdf' || extension.toLowerCase() == 'txt') {
      var wnd = window.open('about:blank');
      var pdfStr = `<div style="text-align:center">
  <h4>Pdf viewer</h4>
  <iframe id="iFrame" src="https://docs.google.com/viewer?url=https://gotracrat.com:8088/api/attachment/downloadaudiofile/${
    companyDocument.attachmentId + '?access_token=' + this.authToken
  }&embedded=true" frameborder="0" height="650px" width="100%"></iframe>
    </div>
    <script>
        function reloadIFrame() {
          var iframe = document.getElementById("iFrame");
            console.log(iframe); //work control
            console.log(iframe.contentDocument); //work control
            if(iframe.contentDocument.URL == "about:blank"){
              console.log("loaded");
              iframe.src =  iframe.src;
            }
          }
          var timerId = setInterval("reloadIFrame();", 1300);
          setTimeout(() => {
            clearInterval(timerId);
            console.log("Finally Loaded");
            }, 25000);

          $( document ).ready(function() {
              $('#menuiFrame').on('load', function() {
                  clearInterval(timerId);
                  console.log("Finally Loaded"); //work control
              });
          });
        </script>
    `;
      if (wnd) wnd.document.write(pdfStr);
    } else if (
      extension.toLowerCase() == 'jpg' ||
      extension.toLowerCase() == 'png' ||
      extension.toLowerCase() == 'jpeg' ||
      extension.toLowerCase() == 'gif'
    ) {
      var pdfStr = `<div style="text-align:center">
    <h4>Image Viewer</h4>
    <img src="https://gotracrat.com:8088/api/attachment/downloadaudiofile/${
      companyDocument.attachmentId + '?access_token=' + this.authToken
    }&embedded=true" >
      </div>`;

      var wnd = window.open('about:blank');
      if (wnd) wnd.document.write(pdfStr);
    } else {
      window.open(
        'https://gotracrat.com:8088/api/attachment/downloadaudiofile/' +
          companyDocument.attachmentId +
          '?access_token=' +
          this.authToken
      );
    }
  }
  print() {
    this.helpFlag = false;
    window.print();
  }
  help() {
    this.helpFlag = !this.helpFlag;
  }

  onChange(e: any) {
    const currentPage = this.p;
    const DocumentCount = this.documents.length;
    const maxPageAvailable = Math.ceil(DocumentCount / this.itemsForPagination);
    if (currentPage > maxPageAvailable) {
      this.p = maxPageAvailable;
    }
  }
}
