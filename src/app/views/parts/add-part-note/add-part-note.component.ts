import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { NgxSpinnerService } from 'ngx-spinner';
import { PartsService } from 'src/app/services/parts.service';
import { Location } from '@angular/common';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-add-part-note',
  templateUrl: './add-part-note.component.html',
  styleUrls: ['./add-part-note.component.scss'],
})
export class AddPartNoteComponent implements OnInit, OnDestroy {
  model: any = {};
  index: number = 0;

  companyId: number = 0;
  partId: number = 0;
  id!: number;
  bsConfig!: Partial<BsDatepickerConfig>;
  dismissible = true;
  helpFlag: boolean = false;

  private subscriptions: Subscription = new Subscription();

  constructor(
    private partsService: PartsService,
    private router: Router,
    private location: Location,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit(): void {
    this.model.date = new Date();
    this.bsConfig = { containerClass: 'theme-red' };

    const querySub = this.route.queryParams.subscribe((params) => {
      this.partId = +params['q'] || 0;
    });
    this.subscriptions.add(querySub);

    this.model.enteredOn = new Date();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
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
        partId: this.partId,
      };
      this.spinner.show();
      this.partsService.addPartNote(this.model).subscribe({
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

  cancelPartNotes(): void {
    this.location.back();
  }

  print(): void {
    this.helpFlag = false;
    window.print();
  }

  help(): void {
    this.helpFlag = !this.helpFlag;
  }
}
