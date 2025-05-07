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
  private sub: any;
  id: number;
  bsConfig: Partial<BsDatepickerConfig>;
  dismissible = true;
  globalCompany: any;
  companyId: any;
  userName: any;
  loader = false;
  constructor(
    private locationNoteService: LocationNotesService,
    private companyManagementService: CompanyManagementService,
    private router: Router,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService
  ) {
    this.locationId = route.snapshot.params['id'];
    this.globalCompany = this.companyManagementService.getGlobalCompany();
    this.companyId = this.globalCompany.companyid;
    this.companyManagementService.globalCompanyChange.subscribe((value) => {
      this.globalCompany = value;
      this.companyId = value.companyid;
    });
  }

  ngOnInit() {
    this.userName = sessionStorage.getItem('userName');
    this.model.date = new Date();
    this.bsConfig = Object.assign({}, { containerClass: 'theme-red' });
    console.log('locationId=' + this.locationId);
    this.model.effectiveon = new Date();
  }

  saveLocationNote() {
    if (!this.model.entityname || !this.model.effectiveon) {
      this.index = -1;
      window.scroll(0, 0);
    } else {
      this.model = {
        companyid: this.companyId,
        effectiveon: this.model.effectiveon,
        enteredby: this.userName,
        enteredon: new Date(),
        entityid: this.locationId,
        entityname: this.model.entityname,
        entitytypeid: 0,
        entityxml: '',
        entry: this.model.entry ? this.model.entry : ' ',
        jobnumber: this.model.jobnumber,
        journalid: 0,
        journaltypeid: 0,
        locationid: this.locationId,
        locationname: '',
        ponumber: this.model.ponumber,
        shippingnumber: '',
        trackingnumber: '',
        moduleType: 'locationtype',
      };
      console.log(JSON.stringify(this.model));
      this.spinner.show();

      this.locationNoteService.saveLocationNotes(this.model).subscribe(
        (response) => {
          this.spinner.hide();

          window.scroll(0, 0);
          this.index = 1;
          setTimeout(() => {
            this.index = 0;
          }, 7000);
        },
        (error) => {
          this.spinner.hide();
        }
      );
    }
  }

  cancelLocationNote() {
    this.router.navigate(['/location/notes/' + this.locationId]);
  }
}
