import { Component, OnInit } from '@angular/core';
import { CompanynotesService } from '../../../services/index';
import { ActivatedRoute, Router } from '@angular/router';
import { Company } from '../../../models';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-add-company-notes',
  templateUrl: './add-company-notes.component.html',
  styleUrls: ['./add-company-notes.component.scss'],
})
export class AddCompanyNotesComponent implements OnInit {
  model: any = {};
  index: number = 0;
  companyId: number = 0;
  private sub: any;
  id: number;
  router: Router;
  bsConfig: Partial<BsDatepickerConfig>;
  userName: any;
  loader = false;
  constructor(
    private companynotesService: CompanynotesService,
    router: Router,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService
  ) {
    this.router = router;
  }

  ngOnInit() {
    this.userName = sessionStorage.getItem('userName');
    this.model.date = new Date();
    this.bsConfig = Object.assign({}, { containerClass: 'theme-red' });

    this.sub = this.route.queryParams.subscribe((params) => {
      this.companyId = +params['q'] || 0;
      console.log('Query params ', this.companyId);
    });

    console.log('companyId=' + this.companyId);
    this.model.effectiveon = new Date();
  }

  saveNotes() {
    if (!this.model.entityname || !this.model.effectiveon) {
      this.index = -1;
      window.scroll(0, 0);
    } else {
      this.model = {
        companyid: this.companyId,
        effectiveon: this.model.effectiveon,
        enteredby: this.userName,
        enteredon: new Date(),
        entityid: this.companyId,
        entityname: this.model.entityname,
        entitytypeid: 0,
        entityxml: '',
        entry: this.model.entry ? this.model.entry : ' ',
        jobnumber: this.model.jobnumber,
        journalid: 0,
        journaltypeid: 0,
        locationid: 0,
        locationname: '',
        ponumber: this.model.ponumber,
        shippingnumber: '',
        trackingnumber: '',
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
