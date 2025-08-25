import { Component, OnInit } from '@angular/core';
import { CompanynotesService } from '../../../services/companynotes.service';
import { ActivatedRoute, Router } from '@angular/router';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-add-vendor-note',
  templateUrl: './add-vendor-note.component.html',
  styleUrls: ['./add-vendor-note.component.scss'],
})
export class AddVendorNoteComponent implements OnInit {
  loader = false;
  model: any = {};
  index: number = 0;

  companyId: number = 0;
  private sub: any;
  id: number;
  router: Router;
  bsConfig: Partial<BsDatepickerConfig>;
  dismissible = true;
  helpFlag: any = false;
  constructor(
    private companynotesService: CompanynotesService,
    router: Router,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService
  ) {
    this.router = router;
  }

  ngOnInit() {
    this.model.date = new Date();
    this.bsConfig = Object.assign({}, { containerClass: 'theme-red' });

    this.sub = this.route.queryParams.subscribe((params) => {
      this.companyId = +params['q'] || 0;
      console.log('Query params ', this.companyId);
    });

    console.log('companyId=' + this.companyId);
    this.model.enteredon = new Date();
  }

  saveNotes() {
    if (!this.model.entityname || !this.model.enteredon) {
      this.index = -1;
      window.scroll(0, 0);
    } else {
      this.model = {
        companyId: this.companyId,
        effectiveon: new Date(),
        enteredby: 'Yogi Patel',
        enteredon: new Date(),
        entityId: this.companyId,
        entityname: this.model.entityname,
        entitytypeId: 0,
        entityxml: '',
        entry: this.model.entry ? this.model.entry : ' ',
        jobnumber: this.model.jobnumber,
        journalid: 0,
        journaltypeId: 0,
        locationid: 0,
        locationname: '',
        ponumber: this.model.ponumber,
        shippingnumber: '',
        trackingnumber: '',
        moduleType: 'vendorType',
      };
      this.spinner.show();

      this.companynotesService.saveCompanynotes(this.model).subscribe(
        (response) => {
          this.spinner.hide();

          window.scroll(0, 0);
          this.index = 1;
        },
        (error) => {
          this.spinner.hide();
        }
      );
    }
  }

  cancelVendorNotes() {
    this.router.navigate(['/vendor/notes/' + this.companyId]);
  }
  print() {
    this.helpFlag = false;
    window.print();
  }
  help() {
    this.helpFlag = !this.helpFlag;
  }
}
