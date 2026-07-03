import { Component, OnInit } from '@angular/core';
import { LocationNotesService } from '../../../services/location-notes.service';
import { Router, ActivatedRoute } from '@angular/router';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { NgxSpinnerService } from 'ngx-spinner';
import { CompanyManagementService } from '../../../services/company-management.service';

@Component({
  selector: 'app-add-location-note',
  templateUrl: './add-location-note.component.html',
  styleUrls: ['./add-location-note.component.scss'],
})
export class AddLocationNoteComponent implements OnInit {
  model: any = {};
  index: number = 0;
  locationId: number = 0;
  id: number = 0;
  bsConfig: Partial<BsDatepickerConfig> = { containerClass: 'theme-red' };
  dismissible: boolean = true;
  globalCompany: any;
  companyId: number = 0;
  userName: string | null = null;
  loader: boolean = false;

  constructor(
    private locationNoteService: LocationNotesService,
    private companyManagementService: CompanyManagementService,
    private router: Router,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService
  ) {
    this.locationId = +this.route.snapshot.params['id'] || 0;

    this.globalCompany = this.companyManagementService.getGlobalCompany();
    if (this.globalCompany) {
      this.companyId = this.globalCompany.companyId ?? 0;
    }

    this.companyManagementService.globalCompanyChange.subscribe((value) => {
      this.globalCompany = value;
      this.companyId = value?.companyId ?? 0;
    });
  }

  ngOnInit(): void {
    this.userName = sessionStorage.getItem('userName');
    this.model.date = new Date();
    this.model.effectiveOn = new Date();
  }

  saveLocationNote(): void {
    if (!this.model.entityName || !this.model.effectiveOn) {
      this.index = -1;
      window.scroll(0, 0);
      return;
    }

    const payload = {
      companyId: this.companyId,
      effectiveOn: this.model.effectiveOn,
      enteredBy: this.userName ?? '',
      enteredOn: new Date(),
      entityId: this.locationId,
      entityName: this.model.entityName ?? '',
      entitytypeId: 0,
      entityXml: '',
      entry: this.model.entry ?? ' ',
      jobNumber: this.model.jobNumber ?? '',
      journalId: 0,
      journaltypeId: 0,
      locationId: this.locationId,
      locationName: '',
      poNumber: this.model.poNumber ?? '',
      shippingNumber: '',
      trackingNumber: '',
      moduleType: 'locationtype',
    };
    this.spinner.show();

    this.locationNoteService.saveLocationNotes(payload).subscribe(
      () => {
        this.spinner.hide();
        window.scroll(0, 0);
        this.index = 1;
        setTimeout(() => (this.index = 0), 7000);
      },
      () => {
        this.spinner.hide();
      }
    );
  }

  cancelLocationNote(): void {
    this.router.navigate([`/location/notes/${this.locationId}`]);
  }
}
