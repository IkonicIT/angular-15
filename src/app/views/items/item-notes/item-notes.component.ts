import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { CompanyManagementService } from '../../../services/company-management.service';
import { ItemNotesService } from '../../../services/Items/item-notes.service';
import { Router, ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Location } from '@angular/common';
import { BroadcasterService } from '../../../services/broadcaster.service';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-item-notes',
  templateUrl: './item-notes.component.html',
  styleUrls: ['./item-notes.component.scss'],
})
export class ItemNotesComponent implements OnInit {
  itemRank: any;
  companyId: string;
  itemId: string;
  model: any;
  index: string = '';
  notes: any[] = [];
  message: string;
  modalRef: BsModalRef;
  companyName: string = '';
  order: string = 'date';
  reverse: string = '';
  itemNotesFilter: any = '';
  itemsForPagination: any = 5;
  globalCompany: any;
  currentRole: any;
  highestRank: any;
  journalId: number = 0;
  private sub: any;
  id: number;
  authToken: any;
  p: any;
  loader = false;
  constructor(
    private modalService: BsModalService,
    private companyManagementService: CompanyManagementService,
    private itemNotesService: ItemNotesService,
    private _location: Location,
    private router: Router,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private broadcasterService: BroadcasterService,
    public datepipe: DatePipe
  ) {
    this.itemId = route.snapshot.params['id'];
    this.authToken = sessionStorage.getItem('auth_token');
    this.globalCompany = this.companyManagementService.getGlobalCompany();
    if (this.globalCompany) {
      this.companyId = this.globalCompany.companyId;
    }
    if (this.companyId) {
      this.getAllNotes(this.companyId);
    }
    this.companyManagementService.globalCompanyChange.subscribe((value) => {
      this.globalCompany = value;
      this.companyName = value.name;
      this.companyId = value.companyId;
    });
  }

  ngOnInit() {
    this.itemRank = this.broadcasterService.itemRank;
    this.currentRole = sessionStorage.getItem('currentRole');
    this.highestRank = sessionStorage.getItem('highestRank');
  }

  getAllNotes(companyId: string) {
    this.spinner.show();

    this.itemNotesService.getAllItemNotes(companyId, this.itemId).subscribe(
      (response: any) => {
        this.spinner.hide();

        this.notes = response;
      },
      (error) => {
        this.spinner.hide();
      }
    );
  }

  addNotes() {
    this.router.navigate(['/items/addItemNotes/' + this.itemId]);
  }

  openModal(template: TemplateRef<any>, id: string) {
    this.index = id;
    this.modalRef = this.modalService.show(template, { class: 'modal-lg' });
  }

  openModalView(template: TemplateRef<any>, id: number) {
    this.journalId = id;
    this.spinner.show();

    this.itemNotesService.getItemNotes(this.journalId).subscribe((response) => {
      this.spinner.hide();

      this.model = response;
      if (this.model.effectiveOn) {
        this.model.effectiveOn = new Date(this.model.effectiveOn);
        this.model.effectiveOn = this.datepipe.transform(
          this.model.effectiveOn,
          'MM/dd/yyyy'
        );
      }
      this.modalRef = this.modalService.show(template, { class: 'modal-lg' });
    });
  }

  confirm(): void {
    this.message = 'Confirmed!';
    this.spinner.show();

    this.itemNotesService
      .removeItemNotes(this.index, this.itemId, '', '')
      .subscribe(
        (response) => {
          this.spinner.hide();

          this.modalRef.hide();
          this.getAllNotes(this.companyId);
        },
        (error) => {
          this.spinner.hide();
        }
      );
  }

  refresh() {
    this.notes = [];
    this.ngOnInit();
  }

  editItemNotes(notes: { journalId: string }) {
    this.router.navigate([
      '/items/editItemNotes/' + notes.journalId + '/' + this.itemId,
    ]);
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

  back() {
    this._location.back();
  }

  backToViewItem() {
    this.router.navigate(['/items/viewItem/' + this.itemId]);
  }

  cancelViewItemNotes() {
    this.modalRef.hide();
  }

  downloadFile(attachment: any) {
    var index = attachment.fileName.lastIndexOf('.');
    var extension = attachment.fileName.slice(index + 1);
    if (extension.toLowerCase() == 'pdf' || extension.toLowerCase() == 'txt') {
      var pdfStr = `<div style="text-align:center">
    <h4>Pdf viewer</h4>
    <iframe src="https://docs.google.com/viewer?url=https://gotracrat.com:8088/api/attachment/downloadaudiofile/${
      attachment.attachmentId + '?access_token=' + this.authToken
    }&embedded=true" frameborder="0" height="650px" width="100%"></iframe>
      </div>`;

      var wnd = window.open('about:blank');
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
        attachment.attachmentId + '?access_token=' + this.authToken
      }&embedded=true" >
        </div>`;

      var wnd = window.open('about:blank');
      if (wnd) wnd.document.write(pdfStr);
    } else {
      window.open(
        'https://gotracrat.com:8088/api/attachment/downloadaudiofile/' +
          attachment.attachmentId +
          '?access_token=' +
          this.authToken
      );
    }
  }
}
