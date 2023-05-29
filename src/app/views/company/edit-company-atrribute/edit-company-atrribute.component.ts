import { Component, OnInit } from '@angular/core';
import { CompanynotesService } from '../../../services/index';
import { ActivatedRoute, Router } from '@angular/router';
import { Company } from '../../../models';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { CompanyTypesService } from '../../../services/index';
import { CompanyAttributesServiceService } from '../../../services/index';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-edit-company-atrribute',
  templateUrl: './edit-company-atrribute.component.html',
  styleUrls: ['./edit-company-atrribute.component.scss']
})
export class EditCompanyAtrributeComponent implements OnInit {
  model: any = {};
  index: number = 0;
  atts: any[] = [];
  cmptypes: any[] = [];
  companyType: number;
  companyId: number = 0;
  private sub: any;
  id: number;
  router: Router;
  bsConfig: Partial<BsDatepickerConfig>;
  dismissible = true;
  typeId: number;
  attrId: number;
  userName: any;
  constructor(private companynotesService: CompanynotesService, private companyAttributesServiceService: CompanyAttributesServiceService, router: Router,
    private route: ActivatedRoute, private companyTypesService: CompanyTypesService, private spinner: NgxSpinnerService
  ) {
    this.router = router;
  }

  ngOnInit() {

    this.userName = sessionStorage.getItem('userName');
    this.model.date = new Date();
    this.bsConfig = Object.assign({}, { containerClass: 'theme-red' });

    this.sub = this.route.queryParams
      .subscribe(params => {
        this.companyId = +params['q'] || 0;
        console.log('Query params ', this.companyId)
      });



    this.sub = this.route.queryParams
      .subscribe(params => {
        this.typeId = +params['a'] || 0;
        console.log('Query params typeid= ', this.typeId)
      });

    this.sub = this.route.queryParams
      .subscribe(params => {
        this.attrId = +params['z'] || 0;
        console.log('Query params typeid= ', this.typeId)
      });

    this.companyType = this.typeId;
    this.model = this.companyAttributesServiceService.getCompanyAttributess(this.attrId, this.companyId, this.typeId)

    console.log('companyId=' + this.companyId);
  }

  updateAttributes() {
    if (this.model.name === undefined || this.model.Toa === undefined || this.companyType === undefined || this.companyType === 0) {
      this.index = -1;
    } else {
      this.model.by = this.userName;
      this.model.added = new Date();
      this.model.companyId = this.companyId;
      this.model.typeId = this.companyType;
      this.companyAttributesServiceService.saveCompanyAttributes(this.model).subscribe(response => {
        window.scroll(0, 0);
      },
        error => {
          this.spinner.hide();
        });
    }
  }

  cancelCompanyDocument() {
    this.router.navigate(['/company/attributes/' + this.companyId]);
  }

}
