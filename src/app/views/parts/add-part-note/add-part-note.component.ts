import { Component, OnInit } from '@angular/core';
import { CompanynotesService } from '../../../services/companynotes.service';
import { ActivatedRoute, Router } from '@angular/router';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { NgxSpinnerService } from 'ngx-spinner';
import { PartsService } from 'src/app/services/parts.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-add-part-note',
  templateUrl: './add-part-note.component.html',
  styleUrls: ['./add-part-note.component.scss'],
})
export class AddPartNoteComponent implements OnInit {
  model: any = {};
  index: number = 0;

  companyId: number = 0;
  partId: number = 0;
  private sub: any;
  id: number;
  router: Router;
  bsConfig: Partial<BsDatepickerConfig>;
  dismissible = true;
  helpFlag: any = false;
  constructor(
    private partsService: PartsService,
    router: Router,
    private location: Location,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService
  ) {
    this.router = router;
  }

  ngOnInit() {
    this.model.date = new Date();
    this.bsConfig = Object.assign({}, { containerClass: 'theme-red' });

    this.sub = this.route.queryParams.subscribe((params) => {
      this.partId = +params['q'] || 0;
      console.log('Query params ', this.partId);
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
        partId: this.partId,
      };
      this.spinner.show();
      this.partsService.addPartNote(this.model).subscribe(
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

  cancelPartNotes() {
    this.location.back();
  }
  print() {
    this.helpFlag = false;
    window.print();
  }
  help() {
    this.helpFlag = !this.helpFlag;
  }
}
