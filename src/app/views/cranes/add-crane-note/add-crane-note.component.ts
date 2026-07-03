import { Component, OnInit } from '@angular/core';
import { CompanynotesService } from '../../../services/companynotes.service';
import { ActivatedRoute, Router } from '@angular/router';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-add-crane-note',
  templateUrl: './add-crane-note.component.html',
  styleUrls: ['./add-crane-note.component.scss'],
})
export class AddCraneNoteComponent implements OnInit {
  model: any = {};
  index: number = 0;

  companyId: number = 0;
  vendorId: number = 0;
  private sub: Subscription | undefined;
  id: number = 0;
  router: Router;
  bsConfig: Partial<BsDatepickerConfig> = {};
  dismissible: boolean = true;
  helpFlag: any = false;

  constructor(
    private companynotesService: CompanynotesService,
    router: Router,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService
  ) {
    this.router = router;
  }

  ngOnInit(): void {
    this.model.date = new Date();
    this.bsConfig = { containerClass: 'theme-red' };

    this.sub = this.route.queryParams.subscribe((params) => {
      this.vendorId = +params['q'] || 0;
    });
    this.model.enteredOn = new Date();
  }

  saveNotes(): void {
    if (!this.model.name || !this.model.createdDate) {
      this.index = -1;
      window.scroll(0, 0);
    } else {
      this.model = {
        vendorNoteId: 0,
        createdBy: 'Yogi Patel',
        createdDate: this.model.createdDate,
        name: this.model.name,
        jobNumber: this.model.jobNumber,
        poNumber: this.model.poNumber,
        details: this.model.details,
        isNew: true,
        vendorId: this.vendorId,
      };
      this.spinner.show();
      this.companynotesService.saveVendorNotes(this.model).subscribe({
        next: () => {
          this.spinner.hide();
          window.scroll(0, 0);
          this.index = 1;
        },
        error: () => {
          this.spinner.hide();
        },
      });
    }
  }

  cancelVendorNotes(): void {
    this.router.navigate([`/vendor/notes/${this.vendorId}`]);
  }

  print(): void {
    this.helpFlag = false;
    window.print();
  }

  help(): void {
    this.helpFlag = !this.helpFlag;
  }
}
