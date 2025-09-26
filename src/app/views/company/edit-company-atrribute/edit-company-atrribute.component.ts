import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { Subscription } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';

import { CompanynotesService } from '../../../services/index';
import { CompanyTypesService } from '../../../services/index';
import { CompanyAttributesServiceService } from '../../../services/index';

@Component({
  selector: 'app-edit-company-attribute',
  templateUrl: './edit-company-atrribute.component.html',
  styleUrls: ['./edit-company-atrribute.component.scss'],
})
export class EditCompanyAtrributeComponent implements OnInit, OnDestroy {
  model: any = {};
  index = 0;
  atts: any[] = [];
  cmptypes: any[] = [];
  companyType = 0;
  companyId = 0;
  typeId = 0;
  attrId = 0;
  loader = false;
  userName: string | null = null;

  bsConfig?: Partial<BsDatepickerConfig>;
  dismissible = true;

  private subs: Subscription[] = [];

  constructor(
    private companynotesService: CompanynotesService,
    private companyAttributesServiceService: CompanyAttributesServiceService,
    private router: Router,
    private route: ActivatedRoute,
    private companyTypesService: CompanyTypesService,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit(): void {
    this.userName = sessionStorage.getItem('userName');
    this.model.date = new Date();
    this.bsConfig = { containerClass: 'theme-red' };

    // subscribe once and extract all query params
    const sub = this.route.queryParams.subscribe((params) => {
      this.companyId = Number(params['q']) || 0;
      this.typeId = Number(params['a']) || 0;
      this.attrId = Number(params['z']) || 0;

      this.companyType = this.typeId;

      this.model = this.companyAttributesServiceService.getCompanyAttributess(
        this.attrId,
        this.companyId,
        this.typeId
      );
    });

    this.subs.push(sub);
  }

  updateAttributes(): void {
    if (
      !this.model?.name ||
      !this.model?.Toa ||
      !this.companyType ||
      this.companyType === 0
    ) {
      this.index = -1;
    } else {
      this.model.by = this.userName;
      this.model.added = new Date();
      this.model.companyId = this.companyId;
      this.model.typeId = this.companyType;

      this.companyAttributesServiceService.saveCompanyAttributes(this.model).subscribe({
        next: () => {
          window.scroll(0, 0);
        },
        error: () => {
          this.spinner.hide();
        },
      });
    }
  }

  cancelCompanyDocument(): void {
    this.router.navigate([`/company/attributes/${this.companyId}`]);
  }

  ngOnDestroy(): void {
    this.subs.forEach((s) => s.unsubscribe());
  }
}
