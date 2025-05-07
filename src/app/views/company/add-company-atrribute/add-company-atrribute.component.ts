import { Component, OnInit } from '@angular/core';
import { CompanynotesService } from '../../../services/index';
import { ActivatedRoute, Router } from '@angular/router';
import { Company } from '../../../models';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { BroadcasterService } from '../../../services/broadcaster.service';
import { CompanyTypesService } from '../../../services/index';
import { CompanyAttributesServiceService } from '../../../services/index';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-add-company-atrribute',
  templateUrl: './add-company-atrribute.component.html',
  styleUrls: ['./add-company-atrribute.component.scss'],
})
export class AddCompanyAtrributeComponent implements OnInit {
  model: any = {};
  index: number = 0;
  loader = false;
  cmptypes: any[] = [];
  currentRole: any;
  highestRank: any;
  username: any;
  companyType: string;
  companyId: number = 0;
  private sub: any;
  id: number;
  router: Router;
  bsConfig: Partial<BsDatepickerConfig>;
  dismissible = true;

  constructor(
    private companynotesService: CompanynotesService,
    private broadcasterService: BroadcasterService,
    private companyAttributesServiceService: CompanyAttributesServiceService,
    router: Router,
    private route: ActivatedRoute,
    private companyTypesService: CompanyTypesService,
    private spinner: NgxSpinnerService
  ) {
    this.router = router;
    this.username = this.broadcasterService.username;
  }

  ngOnInit() {
    this.model.date = new Date();
    this.bsConfig = Object.assign({}, { containerClass: 'theme-red' });

    this.sub = this.route.queryParams.subscribe((params) => {
      this.companyId = +params['q'] || 0;
      console.log('Query params ', this.companyId);
    });

    this.currentRole = sessionStorage.getItem('currentRole');
    this.highestRank = sessionStorage.getItem('highestRank');
    console.log('currentRole is' + this.currentRole);
    console.log('highestRank is' + this.highestRank);
    console.log('companyId=' + this.companyId);
  }

  saveAttributes() {
    if (this.companyType === undefined || this.companyType == '') {
      this.index = -2;
    } else if (this.model.name === undefined || this.model.Toa === undefined) {
      this.index = -1;
    } else {
      this.model.by = this.username;
      this.model.added = new Date();
      this.model.companyId = this.companyId;
      this.model.typeId = this.companyType;
      this.spinner.show();

      this.companyAttributesServiceService
        .saveCompanyAttributes(this.model)
        .subscribe(
          (response) => {
            this.spinner.hide();
            window.scroll(0, 0);
          },
          (error) => {
            this.spinner.hide();
          }
        );
    }
  }

  cancelCompanyDocument() {
    this.router.navigate(['/company/attributes/' + this.companyId]);
  }
}
