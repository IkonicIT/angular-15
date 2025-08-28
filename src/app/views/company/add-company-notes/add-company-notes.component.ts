import { Component, OnInit, OnDestroy } from '@angular/core';
import { CompanynotesService } from '../../../services/index';
import { ActivatedRoute, Router } from '@angular/router';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-add-company-notes',
  templateUrl: './add-company-notes.component.html',
  styleUrls: ['./add-company-notes.component.scss'],
})
export class AddCompanyNotesComponent implements OnInit, OnDestroy {
  model: any = {};
  index: number = 0;
  companyId: number = 0;
  private sub!: Subscription;
  id!: number;
  bsConfig!: Partial<BsDatepickerConfig>;
  userName: string | null = null;
  loader = false;

  constructor(
    private companynotesService: CompanynotesService,
    private router: Router,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit(): void {
    this.userName = sessionStorage.getItem('userName');
    this.model.date = new Date();
    this.bsConfig = { containerClass: 'theme-red' };

    this.sub = this.route.queryParams.subscribe((params) => {
      this.companyId = +params['q'] || 0;
      console.log('Query params ', this.companyId);
    });

    console.log('companyId=' + this.companyId);
    this.model.effectiveOn = new Date();
  }

  saveNotes(): void {
    if (!this.model.entityName || !this.model.effectiveOn) {
      this.index = -1;
      window.scroll(0, 0);
    } else {
      this.model = {
        companyId: this.companyId,
        effectiveOn: this.model.effectiveOn,
        enteredBy: this.userName,
        enteredOn: new Date(),
        entityId: this.companyId,
        entityName: this.model.entityName,
        entityTypeId: 0,
        entityXml: '',
        entry: this.model.entry ? this.model.entry : ' ',
        jobNumber: this.model.jobNumber,
        journalId: 0,
        journalTypeId: 0,
        locationId: 0,
        locationName: '',
        poNumber: this.model.poNumber,
        shippingNumber: '',
        trackingNumber: '',
        moduleType: 'companytype',
      };
      console.log(JSON.stringify(this.model));
      this.spinner.show();

      this.companynotesService.saveCompanynotes(this.model).subscribe(
        (response) => {
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
