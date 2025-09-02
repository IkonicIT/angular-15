import { Component, OnInit } from '@angular/core';
import { CompanynotesService } from '../../../services/index';
import { ActivatedRoute, Router } from '@angular/router';
import { Company } from '../../../models/company';
import { NgxSpinnerService } from 'ngx-spinner';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-view-company-notes',
  templateUrl: './view-company-notes.component.html',
  styleUrls: ['./view-company-notes.component.scss'],
})
export class ViewCompanyNotesComponent implements OnInit {
  model: any = {};
  p: any;
  bsConfig: any;
  index: number = 0;
  date = Date.now();
  companyId: number = 0;
  journalId: number = 0;
  private sub: any;
  id: number;
  router: Router;
  loader = false;
  constructor(
    private companynotesService: CompanynotesService,
    router: Router,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService,
    public datepipe: DatePipe
  ) {
    this.companyId = route.snapshot.params['id'];
    console.log('compaanyid=' + this.companyId);
    this.router = router;
  }

  ngOnInit() {
    this.sub = this.route.queryParams.subscribe((params) => {
      this.companyId = +params['q'] || 0;
      console.log('Query params ', this.companyId);
    });

    this.sub = this.route.queryParams.subscribe((params) => {
      this.journalId = +params['a'] || 0;
      console.log('Query params ', this.journalId);
    });
    this.spinner.show();

    this.companynotesService
      .getCompanynotess(this.journalId, this.companyId)
      .subscribe(
        (response) => {
          this.spinner.hide();

          this.model = response;

          if (this.model.effectiveOn) {
            this.model.effectiveOn = new Date(this.model.effectiveOn);
            this.model.effectiveOn = this.datepipe.transform(
              this.model.effectiveOn,
              'MM/dd/yyyy'
            );
          }
        },
        (error) => {
          this.spinner.hide();
        }
      );
  }

  cancelCompanyNotes() {
    this.router.navigate(['/company/notes/' + this.companyId]);
  }
}
