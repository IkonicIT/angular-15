import { Component, OnInit } from '@angular/core';
import { CompanynotesService } from '../../../services/index';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-edit-company-notes',
  templateUrl: './edit-company-notes.component.html',
  styleUrls: ['./edit-company-notes.component.scss'],
})
export class EditCompanyNotesComponent implements OnInit {
  model: any = {};
  index: number = 0;
  date = Date.now();
  companyId: number = 0;
  journalId: number = 0;
  private sub: any;
  id: number;
  dismissible = true;
  loader = false;
  constructor(
    private companynotesService: CompanynotesService,
    private router: Router,
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

  consoleDate() {
    console.log(this.model.effectiveOn);
  }

  updateNotes() {
    if (!this.model.entityName || !this.model.effectiveOn) {
      this.index = -1;
      window.scroll(0, 0);
    } else {
      this.spinner.show();

      this.model.moduleType = 'companyType';
      this.model.effectiveOn = new Date(this.model.effectiveOn);
      this.companynotesService.updateCompanynotes(this.model).subscribe(
        (response) => {
          this.model.effectiveOn = this.datepipe.transform(
            this.model.effectiveOn,
            'MM/dd/yyyy'
          );
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
  cancelCompanyNotes() {
    this.router.navigate(['/company/notes/' + this.companyId]);
  }
}
