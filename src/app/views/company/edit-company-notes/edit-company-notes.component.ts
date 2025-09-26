import { Component, OnInit, OnDestroy } from '@angular/core';
import { CompanynotesService } from '../../../services/index';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { DatePipe } from '@angular/common';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-edit-company-notes',
  templateUrl: './edit-company-notes.component.html',
  styleUrls: ['./edit-company-notes.component.scss'],
})
export class EditCompanyNotesComponent implements OnInit, OnDestroy {
  model: any = {};
  index: number = 0;
  date: number = Date.now();
  companyId: number = 0;
  journalId: number = 0;
  private sub: Subscription | null = null;
  id!: number;
  dismissible = true;
  loader = false;

  constructor(
    private companynotesService: CompanynotesService,
    private router: Router,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService,
    public datepipe: DatePipe
  ) {
    this.companyId = Number(this.route.snapshot.params['id']) || 0;
    console.log('companyId=' + this.companyId);
  }

  ngOnInit(): void {
    this.sub = this.route.queryParams.subscribe((params) => {
      this.companyId = +params['q'] || this.companyId;
      this.journalId = +params['a'] || this.journalId;

      if (this.journalId && this.companyId) {
        this.loadCompanyNotes();
      }
    });
  }

  private loadCompanyNotes(): void {
    this.spinner.show();
    this.companynotesService.getCompanynotess(this.journalId, this.companyId).subscribe(
      (response) => {
        this.spinner.hide();
        this.model = response;

        if (this.model?.effectiveOn) {
          const parsedDate = new Date(this.model.effectiveOn);
          this.model.effectiveOn = this.datepipe.transform(parsedDate, 'MM/dd/yyyy');
        }
      },
      () => {
        this.spinner.hide();
      }
    );
  }

  consoleDate(): void {
  }

  updateNotes(): void {
    if (!this.model.entityName || !this.model.effectiveOn) {
      this.index = -1;
      window.scroll(0, 0);
      return;
    }

    this.spinner.show();
    this.model.moduleType = 'companyType';
    this.model.effectiveOn = new Date(this.model.effectiveOn);

    this.companynotesService.updateCompanynotes(this.model).subscribe(
      () => {
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
      () => {
        this.spinner.hide();
      }
    );
  }

  cancelCompanyNotes(): void {
    this.router.navigate(['/company/notes/' + this.companyId]);
  }

  ngOnDestroy(): void {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }
}
