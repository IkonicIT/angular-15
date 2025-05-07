import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router, ActivatedRoute } from '@angular/router';
import { AlertModule } from 'ngx-bootstrap/alert';
import { BroadcasterService } from '../../services/broadcaster.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { CompanyDocumentsService } from '../../services/company-documents.service';
import { CompanyManagementService } from '../../services';

@Component({
  selector: 'app-help',
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.scss'],
})
export class HelpComponent implements OnInit {
  companyId: string;
  loader = false;
  model: any;
  index: string = 'companydocument';
  documents: any[] = [];
  route: ActivatedRoute;
  router: Router;
  message: string;
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
  p: any;
  private fileContent: string = '';
  private fileName: any;
  public fileType: any = '';
  file: File;
  index1: any;
  isOwnerAdmin: any;
  dismissible = true;

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

    if (this.companyId) {
      this.getAllDocuments(this.companyId);
    } else {
      this.globalCompany = this.companyManagementService.getGlobalCompany();
      if (this.globalCompany) {
        this.companyName = this.globalCompany.name;
        this.companyId = this.globalCompany.companyid;

        this.getAllDocuments(this.globalCompany.companyid);
      }
    }

    this.companyManagementService.globalCompanyChange.subscribe((value) => {
      this.globalCompany = value;
      this.companyName = value.name;
      this.companyId = value.companyid;
    });
  }

  ngOnInit() {
    this.isOwnerAdmin = sessionStorage.getItem('IsOwnerAdmin');
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

  saveManual() {
    if (this.file === undefined) {
      this.index1 = -1;
    } else {
      let req = {
        manualid: 1,
        manualFile: this.fileContent,
        contenttype: this.fileType,
        description: 'TracRat Manual',
        filename: this.fileName,
      };
      this.spinner.show();

      this.companyDocumentsService.updateManual(req).subscribe(
        (response) => {
          this.spinner.hide();

          this.index1 = 1;
        },
        (error) => {
          this.spinner.hide();
        }
      );
    }
  }

  getManual() {
    this.spinner.show();

    this.companyDocumentsService.getManual().subscribe(
      (response) => {
        this.spinner.hide();

        this.downloadManual(response);
      },
      (error) => {
        this.spinner.hide();
      }
    );
  }

  fileChangeListener($event: { target: any }): void {
    this.readThis($event.target);
  }

  readThis(inputValue: any): void {
    this.file = inputValue.files[0];
    this.fileName = this.file.name;
    var myReader: any = new FileReader();
    myReader.readAsDataURL(this.file);
    let self = this;
    myReader.onloadend = function (e: any) {
      console.log(myReader.result);
      self.fileContent = myReader.result.split(',')[1];
      self.fileType = myReader.result.split(',')[0].split(':')[1].split(';')[0];
    };
  }

  download(companyDocument: { isNew: boolean }) {
    if (companyDocument.isNew == false) {
      this.downloadCompanyFile(companyDocument);
    } else {
      this.downloadDocumentFromDB(companyDocument);
    }
  }

  downloadDocumentFromDB(document: { isNew?: boolean; attachmentid?: any }) {
    this.spinner.show();

    this.companyDocumentsService
      .getCompanyDocuments(document.attachmentid)
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

  downloadManual(manual: any) {
    var blob = this.companyDocumentsService.b64toBlob(
      manual.manualFile,
      manual.contenttype
    );
    var fileURL = URL.createObjectURL(blob);

    window.open(fileURL);
  }

  downloadDocument(companyDocument: any) {
    var blob = this.companyDocumentsService.b64toBlob(
      companyDocument.attachmentFile,
      companyDocument.contenttype
    );
    var fileURL = URL.createObjectURL(blob);
    window.open(fileURL);
  }

  downloadCompanyFile(document: {
    isNew?: boolean;
    filename?: any;
    attachmentid?: any;
  }) {
    if (
      document.filename.split('.')[1].toLowerCase() == 'pdf' ||
      document.filename.split('.')[1].toLowerCase() == 'txt'
    ) {
      var wnd = window.open('about:blank');
      var pdfStr = `<div style="text-align:center">
      <h4>Document viewer</h4>
      <iframe id="iFrame" src="https://docs.google.com/viewer?url=https://gotracrat.com:8088/api/attachment/downloadaudiofile/${
        document.attachmentid + '?access_token=' + this.authToken
      }&embedded=true" frameborder="0" height="500px" width="100%"></iframe>
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
      document.filename.split('.')[1].toLowerCase() == 'jpg' ||
      document.filename.split('.')[1].toLowerCase() == 'png' ||
      document.filename.split('.')[1].toLowerCase() == 'jpeg' ||
      document.filename.split('.')[1].toLowerCase() == 'gif'
    ) {
      var pdfStr = `<div style="text-align:center">
      <h4>Image Viewer</h4>
      <img src="https://gotracrat.com:8088/api/attachment/downloadaudiofile/${
        document.attachmentid + '?access_token=' + this.authToken
      }&embedded=true" >
        </div>`;

      var wnd = window.open('about:blank');
      if (wnd) wnd.document.write(pdfStr);
    } else {
      window.open(
        'https://gotracrat.com:8088/api/attachment/downloadaudiofile/' +
          document.attachmentid +
          '?access_token=' +
          this.authToken
      );
    }
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
}
