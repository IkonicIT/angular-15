import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { LocationNotesService } from '../../../services/location-notes.service';
import { CompanyManagementService } from '../../../services/company-management.service';
import { Router, ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-location-notes',
  templateUrl: './location-notes.component.html',
  styleUrls: ['./location-notes.component.scss'],
})
export class LocationNotesComponent implements OnInit {
  companyId: string = '';
  locationId: string = '';
  model: any;
  index: string = 'companydocument';
  notes: any[] = [];
  message: string = '';
  modalRef?: BsModalRef;
  companyName: string = '';
  order: string = 'date';
  reverse: string = '';
  locationNotesFilter: string = '';
  itemsForPagination: number = 5;
  globalCompany: any;
  currentRole: string | null = null;
  highestRank: number = 0;
  journalId: number = 0;
  id!: number;
  p: number = 1;
  loader = false;

  constructor(
    private modalService: BsModalService,
    private companyManagementService: CompanyManagementService,
    private locationNotesService: LocationNotesService,
    private router: Router,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService,
    public datepipe: DatePipe
  ) {
    this.locationId = this.route.snapshot.params['id'];
    this.globalCompany = this.companyManagementService.getGlobalCompany();
    if (this.globalCompany) {
      this.companyId = this.globalCompany.companyId;
      this.companyName = this.globalCompany.name;
    }
    if (this.locationId) {
      this.getAllNotes(this.locationId);
    }
    this.companyManagementService.globalCompanyChange.subscribe((value) => {
      this.globalCompany = value;
      this.companyName = value.name;
      this.companyId = value.companyId;
    });
  }

  ngOnInit() {
    this.currentRole = sessionStorage.getItem('currentRole');
    const highestRankStr = sessionStorage.getItem('highestRank');
    this.highestRank = highestRankStr ? Number(highestRankStr) : 0;
  }

  getAllNotes(locationId: string) {
    this.spinner.show();
    this.locationNotesService
      .getAllLocationNotes(this.companyId, locationId)
      .subscribe(
        (response: any) => {
          this.spinner.hide();
          this.notes = Array.isArray(response) ? response : [];
        },
        () => {
          this.spinner.hide();
        }
      );
  }

  locationNoteAttachments(notes: { journalId: string }) {
    this.router.navigate([
      '/location/noteAttchments/' + notes.journalId + '/' + notes.journalId,
    ]);
  }

  addNotes() {
    this.router.navigate(['/location/addLocationNote/' + this.locationId]);
  }

  openModal(template: TemplateRef<any>, id: string) {
    this.index = id;
    this.modalRef = this.modalService.show(template, { class: 'modal-lg' });
  }

  openModalView(template: TemplateRef<any>, id: number) {
    this.journalId = id;
    this.spinner.show();
    this.locationNotesService
      .getLocationNotes(this.journalId, this.locationId)
      .subscribe((response) => {
        this.spinner.hide();
        this.model = response;
        if (this.model.effectiveOn) {
          this.model.effectiveOn = this.datepipe.transform(
            new Date(this.model.effectiveOn),
            'MM/dd/yyyy'
          );
        }
        this.modalRef = this.modalService.show(template, { class: 'modal-lg' });
      });
  }

  confirm(): void {
    this.message = 'Confirmed!';
    this.spinner.show();
    const locName = 'data';
    this.locationNotesService
      .removeLocationNotes(this.index, this.locationId, locName)
      .subscribe(
        () => {
          this.spinner.hide();
          this.modalRef?.hide();
          this.getAllNotes(this.locationId);
        },
        () => {
          this.spinner.hide();
        }
      );
  }

  refresh() {
    this.getAllNotes(this.locationId);
  }

  editLocationNotes(notes: { journalId: string }) {
    this.router.navigate([
      '/location/editLocationNote/' + notes.journalId + '/' + this.locationId,
    ]);
  }

  decline(): void {
    this.message = 'Declined!';
    this.modalRef?.hide();
  }

  setOrder(value: string) {
    if (this.order === value) {
      this.reverse = this.reverse === '' ? '-' : '';
    }
    this.order = value;
  }

  cancelViewLocationNotes() {
    this.modalRef?.hide();
  }
}