import { Component, OnInit, TemplateRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { CompanyManagementService } from '../../../services/company-management.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { LocationAttachmentsService } from '../../../services/location-attachments.service';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-location-attachment',
  templateUrl: './location-attachment.component.html',
  styleUrls: ['./location-attachment.component.scss'],
})
export class LocationAttachmentComponent implements OnInit {
  locationId: string;
  companyId: string;
  p: any;

  companyName: any;
  model: any;
  authToken: any;
  index: string = 'locationdocument';
  documents: any[] = [];
  route: ActivatedRoute;
  userName: any;
  router: Router;
  message: string;
  modalRef: BsModalRef;
  order: string = 'description';
  reverse: string = '';
  documentFilter: any = '';
  itemsForPagination: any = 5;
  globalCompany: any;

  constructor(
    private modalService: BsModalService,
    private locationAttachmentsService: LocationAttachmentsService,
    private companyManagementService: CompanyManagementService,
    router: Router,
    route: ActivatedRoute,
    private spinner: NgxSpinnerService
  ) {
    this.locationId = route.snapshot.params['id'];
    this.authToken = sessionStorage.getItem('auth_token');
    this.router = router;
    this.route = route;
    console.log('locationId=' + this.locationId);
    if (this.companyId) {
      this.getAllDocuments(this.companyId, this.locationId);
    } else {
      this.globalCompany = this.companyManagementService.getGlobalCompany();
      this.companyId = this.globalCompany.companyid;
      this.getAllDocuments(this.companyId, this.locationId);
    }
    this.companyManagementService.globalCompanyChange.subscribe((value) => {
      this.globalCompany = value;
      this.companyName = value.name;
      this.companyId = value.companyid;
    });
  }

  ngOnInit() {
    this.userName = sessionStorage.getItem('userName');
  }

  getAllDocuments(companyId: string, locationId: string) {
    this.spinner.show();
    this.locationAttachmentsService
      .getAllLocationDocuments(companyId, locationId)
      .subscribe(
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

  refresh() {}

  openModal(template: TemplateRef<any>, id: string) {
    this.index = id;
    this.modalRef = this.modalService.show(template, { class: 'modal-lg' });
  }

  addLocationDocument() {
    console.log(this.companyId);
    this.router.navigate(['/location/addAttachment/' + this.locationId]);
  }

  editLocationDocument(document: { attachmentid: string }) {
    this.router.navigate([
      '/location/editAttachment/' +
        document.attachmentid +
        '/' +
        this.locationId,
    ]);
  }

  confirm(): void {
    this.message = 'Confirmed!';
    this.spinner.show();
    this.locationAttachmentsService
      .removeLocationDocuments(this.index, this.companyId, this.userName)
      .subscribe(
        (response) => {
          this.spinner.hide();
          this.modalRef.hide();
          this.getAllDocuments(this.companyId, this.locationId);
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
    var blob = this.locationAttachmentsService.b64toBlob(
      companyDocument.attachmentFile,
      companyDocument.contenttype
    ); //new Blob([companyDocument.attachmentFile], { type: 'text/plain' });
    saveAs(blob, companyDocument.filename);
  }

  downloadFile(companyDocument: { filename: string; attachmentid: string }) {
    if (
      companyDocument.filename.split('.')[1].toLowerCase() == 'pdf' ||
      companyDocument.filename.split('.')[1].toLowerCase() == 'txt'
    ) {
      var pdfStr = `<div style="text-align:center">
    <h4>Pdf viewer</h4>
    <iframe src="https://docs.google.com/viewer?url=http://18.216.158.31:8088/api/attachment/downloadaudiofile/${
      companyDocument.attachmentid + '?access_token=' + this.authToken
    }&embedded=true" frameborder="0" height="500px" width="100%"></iframe>
      </div>`;

      var wnd = window.open('about:blank');
      if (wnd) wnd.document.write(pdfStr);
    } else if (
      companyDocument.filename.split('.')[1].toLowerCase() == 'jpg' ||
      companyDocument.filename.split('.')[1].toLowerCase() == 'png' ||
      companyDocument.filename.split('.')[1].toLowerCase() == 'jpeg' ||
      companyDocument.filename.split('.')[1].toLowerCase() == 'gif'
    ) {
      var pdfStr = `<div style="text-align:center">
      <h4>Image Viewer</h4>
      <img src="http://18.216.158.31:8088/api/attachment/downloadaudiofile/${
        companyDocument.attachmentid + '?access_token=' + this.authToken
      }&embedded=true" >
        </div>`;

      var wnd = window.open('about:blank');
      if (wnd) wnd.document.write(pdfStr);
    } else {
      window.open(
        'http://18.216.158.31:8088/api/attachment/downloadaudiofile/' +
          companyDocument.attachmentid +
          '?access_token=' +
          this.authToken
      );
    }
  }
}
