import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { Subscription } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';

import { CompanynotesService } from '../../../services/index';
import { BroadcasterService } from '../../../services/broadcaster.service';
import { CompanyTypesService } from '../../../services/index';
import { CompanyAttributesServiceService } from '../../../services/index';

@Component({
  selector: 'app-add-company-atrribute',
  templateUrl: './add-company-atrribute.component.html',
  styleUrls: ['./add-company-atrribute.component.scss'],
})
export class AddCompanyAtrributeComponent implements OnInit, OnDestroy {
  model: any = {};
  index = 0;
  loader = false;
  cmptypes: any[] = [];
  currentRole: string | null = null;
  highestRank: any;
  userName: string | null = null;
  companyType: string = '';
  companyId = 0;
  private sub?: Subscription;
  id = 0;
  bsConfig?: Partial<BsDatepickerConfig>;
  dismissible = true;

  constructor(
    private companynotesService: CompanynotesService,
    private broadcasterService: BroadcasterService,
    private companyAttributesServiceService: CompanyAttributesServiceService,
    private router: Router,
    private route: ActivatedRoute,
    private companyTypesService: CompanyTypesService,
    private spinner: NgxSpinnerService
  ) {
    this.userName = this.broadcasterService.userName ?? null;
  }

  ngOnInit(): void {
    this.model.date = new Date();
    this.bsConfig = { containerClass: 'theme-red' };

    this.sub = this.route.queryParams.subscribe((params) => {
      this.companyId = Number(params['q']) || 0;
    });

    this.currentRole = sessionStorage.getItem('currentRole');
    const rank = sessionStorage.getItem('highestRank');
    this.highestRank = rank !== null ? Number(rank) : null;

    
  }

  saveAttributes(): void {
    if (!this.companyType) {
      this.index = -2;
    } else if (!this.model.name || !this.model.Toa) {
      this.index = -1;
    } else {
      this.model.by = this.userName;
      this.model.added = new Date();
      this.model.companyId = this.companyId;
      this.model.typeId = this.companyType;
      this.spinner.show();

      this.companyAttributesServiceService.saveCompanyAttributes(this.model).subscribe({
        next: () => {
          this.spinner.hide();
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
    this.sub?.unsubscribe();
  }
}
