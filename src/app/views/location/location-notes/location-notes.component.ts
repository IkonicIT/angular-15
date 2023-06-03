import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { LocationManagementService } from '../../../services/location-management.service';
import { DomSanitizer } from '@angular/platform-browser';
import { LocationNotesService } from '../../../services/location-notes.service';
import { CompanyManagementService } from '../../../services/company-management.service';
import { Router, ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ItemNotesService } from '../../../services/Items/item-notes.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-location-notes',
  templateUrl: './location-notes.component.html',
  styleUrls: ['./location-notes.component.scss'],
})
export class LocationNotesComponent implements OnInit {
  companyId: string;
  locationId: string;
  model: any;
  index: string = 'companydocument';
  notes: any[] = [];
  message: string;
  modalRef: BsModalRef;
  companyName: string = '';
  order: string = 'date';
  reverse: string = '';
  locationNotesFilter: any = '';
  itemsForPagination: any = 5;
  globalCompany: any;
  currentRole: any;
  highestRank: any;
  journalid: number = 0;
  private sub: any;
  id: number;
  p: any;

  constructor(
    private modalService: BsModalService,
    private companyManagementService: CompanyManagementService,
    private locationNotesService: LocationNotesService,
    private router: Router,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService,
    public datepipe: DatePipe
  ) {
    this.locationId = route.snapshot.params['id'];
    this.globalCompany = this.companyManagementService.getGlobalCompany();
    if (this.globalCompany) {
      this.companyId = this.globalCompany.companyid;
    }
    console.log('locationId=' + this.locationId);
    if (this.locationId) {
      this.getAllNotes(this.locationId);
    }
    this.companyManagementService.globalCompanyChange.subscribe((value) => {
      this.globalCompany = value;
      this.companyName = value.name;
      this.companyId = value.companyid;
    });
  }

  ngOnInit() {
    this.currentRole = sessionStorage.getItem('currentRole');
    this.highestRank = sessionStorage.getItem('highestRank');
    console.log('currentRole is' + this.currentRole);
    console.log('highestRank is' + this.highestRank);
  }

  getAllNotes(locationId: string) {
    this.spinner.show();
    this.locationNotesService
      .getAllLocationNotes(this.companyId, locationId)
      .subscribe(
        (response: any) => {
          this.spinner.hide();
          console.log(response);
          this.notes = response;
        },
        (error) => {
          this.spinner.hide();
        }
      );
  }

  locationNoteAttachments(notes: { journalid: string }) {
    this.router.navigate([
      '/location/noteAttchments/' + notes.journalid + '/' + notes.journalid,
    ]);
  }

  addNotes() {
    console.log(this.locationId);
    this.router.navigate(['/location/addLocationNote/' + this.locationId]);
  }

  openModal(template: TemplateRef<any>, id: string) {
    this.index = id;
    this.modalRef = this.modalService.show(template, { class: 'modal-lg' });
  }

  openModalView(template: TemplateRef<any>, id: number) {
    this.journalid = id;
    this.spinner.show();
    this.locationNotesService
      .getLocationNotes(this.journalid, this.locationId)
      .subscribe((response) => {
        this.spinner.hide();
        this.model = response;
        if (this.model.effectiveon) {
          this.model.effectiveon = new Date(this.model.effectiveon);
          this.model.effectiveon = this.datepipe.transform(
            this.model.effectiveon,
            'MM/dd/yyyy'
          );
        }
        this.modalRef = this.modalService.show(template, { class: 'modal-lg' });
      });
  }

  confirm(): void {
    this.message = 'Confirmed!';
    console.log(
      'removeLocationnotess journalId=' +
        this.companyId +
        ',index==' +
        this.index
    );
    this.spinner.show();
    let locName = 'data';
    this.locationNotesService
      .removeLocationNotes(this.index, this.locationId, locName)
      .subscribe(
        (response) => {
          this.spinner.hide();
          this.modalRef.hide();
          this.getAllNotes(this.locationId);
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

  editLocationNotes(notes: { journalid: string }) {
    this.router.navigate([
      '/location/editLocationNote/' + notes.journalid + '/' + this.locationId,
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

  cancelViewLocationNotes() {
    this.modalRef.hide();
  }
}
