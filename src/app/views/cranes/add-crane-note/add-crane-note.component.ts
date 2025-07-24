import { Component, OnInit } from '@angular/core';
import { CompanynotesService } from '../../../services/companynotes.service';
import { ActivatedRoute, Router } from '@angular/router';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-add-crane-note',
  templateUrl: './add-crane-note.component.html',
  styleUrls: ['./add-crane-note.component.scss'],
})
export class AddCraneNoteComponent implements OnInit {
  model: any = {};
  index: number = 0;

  companyId: number = 0;
  vendorId: number = 0;
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
      this.vendorId = +params['q'] || 0;
      console.log('Query params ', this.vendorId);
    });

    console.log('companyId=' + this.companyId);
    this.model.enteredon = new Date();
  }

  saveNotes() {
    if (!this.model.name || !this.model.createdDate) {
      this.index = -1;
      window.scroll(0, 0);
    } else {
      this.model = {
        vendorNoteId: 0,
        createdBy: 'Yogi Patel',
        createdDate: this.model.createdDate,
        name: this.model.name,
        jobnumber: this.model.jobnumber,
        ponumber: this.model.ponumber,
        details: this.model.details,
        isNew: true,
        vendorId: this.vendorId,
      };
      this.spinner.show();
      this.companynotesService.saveVendorNotes(this.model).subscribe(
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
    this.router.navigate(['/vendor/notes/' + this.vendorId]);
  }
  print() {
    this.helpFlag = false;
    window.print();
  }
  help() {
    this.helpFlag = !this.helpFlag;
  }
}
