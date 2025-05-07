import { Component, OnInit } from '@angular/core';
import { CompanynotesService } from '../../../services/companynotes.service';
import { Router, ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-edit-vendor-note',
  templateUrl: './edit-vendor-note.component.html',
  styleUrls: ['./edit-vendor-note.component.scss'],
})
export class EditVendorNoteComponent implements OnInit {
  model: any = {};
  index: number = 0;
  date = Date.now();
  bsConfig: any;
  companyId: number = 0;
  journalid: number = 0;
  private sub: any;
  id: number;
  p: any;
  router: Router;
  helpFlag: any = false;
  dismissible = true;
  loader = false;
  constructor(
    private companynotesService: CompanynotesService,
    router: Router,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService
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
      this.journalid = +params['a'] || 0;
      console.log('Query params ', this.journalid);
    });

    this.companynotesService
      .getCompanynotess(this.journalid, this.companyId)
      .subscribe((response) => {
        this.model = response;
      });
  }

  updateNotes() {
    if (!this.model.entityname || !this.model.enteredon) {
      this.index = -1;
      window.scroll(0, 0);
    } else {
      this.companynotesService.updateCompanynotes(this.model).subscribe(
        (response) => {
          window.scroll(0, 0);
          this.index = 1;
        },
        (error) => {
          this.spinner.hide();
        }
      );
    }
  }
  cancelVendorNotes() {
    this.router.navigate(['/vendor/notes/' + this.companyId]);
  }
  print() {
    this.helpFlag = false;
    window.print();
  }
  help() {
    this.helpFlag = !this.helpFlag;
  }
}
