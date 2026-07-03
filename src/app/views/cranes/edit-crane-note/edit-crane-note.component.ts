import { Component, OnInit, OnDestroy } from '@angular/core';
import { CompanynotesService } from '../../../services/companynotes.service';
import { Router, ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-edit-crane-note',
  templateUrl: './edit-crane-note.component.html',
  styleUrls: ['./edit-crane-note.component.scss'],
})
export class EditCraneNoteComponent implements OnInit, OnDestroy {
  model: any = {};
  index: number = 0;
  date: number = Date.now();
  bsConfig: any;
  companyId: number = 0;
  journalId: number = 0;
  private sub: Subscription | undefined;
  id: number = 0;
  p: any;
  router: Router;
  helpFlag: any = false;
  noteId: any;
  dismissible: boolean = true;
  vendorId: any;

  constructor(
    private companynotesService: CompanynotesService,
    router: Router,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService
  ) {
    this.noteId = this.route.snapshot.params['id'];
    this.router = router;
  }

  ngOnInit(): void {
    this.sub = this.route.queryParams.subscribe((params) => {
      this.vendorId = +params['q'] || 0;
    });

    this.sub = this.route.queryParams.subscribe((params) => {
      this.noteId = +params['a'] || 0;
    });

    this.companynotesService.getVendorNotes(this.noteId).subscribe({
      next: (response) => {
        this.model = response;
      },
      error: () => {
        this.spinner.hide();
      },
    });
  }

  updateNotes(): void {
    if (!this.model.entityName || !this.model.enteredOn) {
      this.index = -1;
      window.scroll(0, 0);
    } else {
      this.companynotesService.updateCompanynotes(this.model).subscribe({
        next: () => {
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

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }
}
