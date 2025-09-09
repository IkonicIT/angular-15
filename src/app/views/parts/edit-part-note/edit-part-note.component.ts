import { Component, OnInit, OnDestroy } from '@angular/core';
import { CompanynotesService } from '../../../services/companynotes.service';
import { Router, ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';

@Component({
  selector: 'app-edit-part-note',
  templateUrl: './edit-part-note.component.html',
  styleUrls: ['./edit-part-note.component.scss'],
})
export class EditPartNoteComponent implements OnInit, OnDestroy {
  model: any = {};
  index: number = 0;
  date = Date.now();
  companyId: number = 0;
  journalId: number = 0;
  id!: number;
  p: any;
  helpFlag: boolean = false;
  noteId!: number;
  vendorId!: number;
  dismissible: boolean = true;

  bsConfig: Partial<BsDatepickerConfig>;

  private subscriptions: Subscription = new Subscription();

  constructor(
    private companynotesService: CompanynotesService,
    private router: Router,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService
  ) {
    this.noteId = Number(this.route.snapshot.params['id']);

    this.bsConfig = {
      containerClass: 'theme-default',
      dateInputFormat: 'YYYY-MM-DD',
    };
  }

  ngOnInit(): void {
    const querySub = this.route.queryParams.subscribe((params) => {
      this.vendorId = +params['q'] || 0;
      this.noteId = +params['a'] || this.noteId;
    });
    this.subscriptions.add(querySub);

    const noteSub = this.companynotesService
      .getVendorNotes(this.noteId)
      .subscribe({
        next: (response) => {
          this.model = response;
        },
      });
    this.subscriptions.add(noteSub);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  updateNotes(): void {
    if (!this.model.entityName || !this.model.enteredOn) {
      this.index = -1;
      window.scroll(0, 0);
    } else {
      const updateSub = this.companynotesService
        .updateCompanynotes(this.model)
        .subscribe({
          next: () => {
            window.scroll(0, 0);
            this.index = 1;
          },
          error: () => {
            this.spinner.hide();
          },
        });
      this.subscriptions.add(updateSub);
    }
  }

  cancelVendorNotes(): void {
    this.router.navigate(['/vendor/notes', this.vendorId]);
  }

  print(): void {
    this.helpFlag = false;
    window.print();
  }

  help(): void {
    this.helpFlag = !this.helpFlag;
  }
}
