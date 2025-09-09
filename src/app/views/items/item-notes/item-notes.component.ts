import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { CompanyManagementService } from '../../../services/company-management.service';
import { ItemNotesService } from '../../../services/Items/item-notes.service';
import { Router, ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Location, DatePipe } from '@angular/common';
import { BroadcasterService } from '../../../services/broadcaster.service';

@Component({
  selector: 'app-item-notes',
  templateUrl: './item-notes.component.html',
  styleUrls: ['./item-notes.component.scss'],
})
export class ItemNotesComponent implements OnInit {
  itemRank: any;
  companyId: number = 0;
  itemId: string = '';
  model: any;
  index: string = '';
  notes: any[] = [];
  message: string = '';
  modalRef: BsModalRef | null = null;
  companyName: string = '';
  order: string = 'date';
  reverse: string = '';
  itemNotesFilter: string = '';
  itemsForPagination: number = 5;
  globalCompany: any;
  currentRole: string | null = null;
  highestRank?: string | null;
  // Add this property:
  get highestRankNum(): number {
    return Number(this.highestRank ?? 0);
  }
  journalId: number = 0;
  authToken: string | null = null;
  p: number = 1;
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
    this.itemId = this.route.snapshot.params['id'] ?? '';
    this.authToken = sessionStorage.getItem('auth_token');

    this.globalCompany = this.companyManagementService.getGlobalCompany();
    if (this.globalCompany) {
      this.companyId = this.globalCompany.companyId;
      this.companyName = this.globalCompany.name;
    }

    if (this.companyId) {
      this.getAllNotes(this.companyId);
    }

    this.companyManagementService.globalCompanyChange.subscribe((value) => {
      this.globalCompany = value;
      this.companyId = value.companyId;
      this.companyName = value.name;
    });
  }

  ngOnInit(): void {
    this.itemRank = this.broadcasterService.itemRank;
    this.currentRole = sessionStorage.getItem('currentRole');
    this.highestRank = sessionStorage.getItem('highestRank');
  }

  getAllNotes(companyId: number): void {
    this.spinner.show();
    this.itemNotesService.getAllItemNotes(String(companyId), this.itemId).subscribe(
      (response: any) => {
        this.spinner.hide();
        this.notes = response ?? [];
      },
      () => {
        this.spinner.hide();
      }
    );
  }

  addNotes(): void {
    this.router.navigate([`/items/addItemNotes/${this.itemId}`]);
  }

  openModal(template: TemplateRef<any>, id: string): void {
    this.index = id;
    this.modalRef = this.modalService.show(template, { class: 'modal-lg' });
  }

  openModalView(template: TemplateRef<any>, id: number): void {
    this.journalId = id;
    this.spinner.show();

    this.itemNotesService.getItemNotes(this.journalId).subscribe(
      (response) => {
        this.spinner.hide();
        this.model = response;

        if (this.model?.effectiveOn) {
          const effectiveOnDate = new Date(this.model.effectiveOn);
          this.model.effectiveOn = this.datepipe.transform(
            effectiveOnDate,
            'MM/dd/yyyy'
          );
        }

        this.modalRef = this.modalService.show(template, { class: 'modal-lg' });
      },
      () => {
        this.spinner.hide();
      }
    );
  }

  confirm(): void {
    this.message = 'Confirmed!';
    this.spinner.show();

    this.itemNotesService
      .removeItemNotes(this.index, this.itemId, '', '')
      .subscribe(
        () => {
          this.spinner.hide();
          this.modalRef?.hide();
          this.getAllNotes(this.companyId);
        },
        () => {
          this.spinner.hide();
        }
      );
  }

  refresh(): void {
    this.notes = [];
    if (this.companyId) {
      this.getAllNotes(this.companyId);
    }
  }

  editItemNotes(notes: { journalId: string }): void {
    this.router.navigate([
      `/items/editItemNotes/${notes.journalId}/${this.itemId}`,
    ]);
  }

  decline(): void {
    this.message = 'Declined!';
    this.modalRef?.hide();
  }

  setOrder(value: string): void {
    if (this.order === value) {
      this.reverse = this.reverse === '' ? '-' : '';
    }
    this.order = value;
  }

  back(): void {
    this._location.back();
  }

  backToViewItem(): void {
    this.router.navigate([`/items/viewItem/${this.itemId}`]);
  }

  cancelViewItemNotes(): void {
    this.modalRef?.hide();
  }

  downloadFile(attachment: { fileName: string; attachmentId: string }): void {
    const index = attachment.fileName.lastIndexOf('.');
    const extension = attachment.fileName.slice(index + 1).toLowerCase();

    if (['pdf', 'txt'].includes(extension)) {
      const pdfStr = `<div style="text-align:center">
        <h4>Pdf viewer</h4>
        <iframe src="https://docs.google.com/viewer?url=https://gotracrat.com:8088/api/attachment/downloadaudiofile/${
          attachment.attachmentId + '?access_token=' + this.authToken
        }&embedded=true" frameborder="0" height="650px" width="100%"></iframe>
      </div>`;

      const wnd = window.open('about:blank');
      if (wnd) wnd.document.write(pdfStr);
    } else if (['jpg', 'png', 'jpeg', 'gif'].includes(extension)) {
      const imgStr = `<div style="text-align:center">
        <h4>Image Viewer</h4>
        <img src="https://gotracrat.com:8088/api/attachment/downloadaudiofile/${
          attachment.attachmentId + '?access_token=' + this.authToken
        }&embedded=true" >
      </div>`;

      const wnd = window.open('about:blank');
      if (wnd) wnd.document.write(imgStr);
    } else {
      window.open(
        `https://gotracrat.com:8088/api/attachment/downloadaudiofile/${attachment.attachmentId}?access_token=${this.authToken}`
      );
    }
  }
}
