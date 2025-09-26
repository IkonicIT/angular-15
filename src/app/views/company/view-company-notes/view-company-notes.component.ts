import { Component, OnInit, OnDestroy } from '@angular/core';
import { CompanynotesService } from '../../../services/index';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { DatePipe } from '@angular/common';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-view-company-notes',
  templateUrl: './view-company-notes.component.html',
  styleUrls: ['./view-company-notes.component.scss'],
})
export class ViewCompanyNotesComponent implements OnInit, OnDestroy {
  model: any = {};
  p: any;
  bsConfig: any;
  index: number = 0;
  date: number = Date.now();
  companyId: number = 0;
  journalId: number = 0;
  private sub: Subscription | null = null;
  id!: number;
  loader = false;

  constructor(
    private companynotesService: CompanynotesService,
    private router: Router,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService,
    public datepipe: DatePipe
  ) {
    this.companyId = Number(this.route.snapshot.params['id']) || 0;
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

  cancelCompanyNotes(): void {
    this.router.navigate(['/company/notes/' + this.companyId]);
  }

  ngOnDestroy(): void {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }
}
