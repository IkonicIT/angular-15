import { Component, OnInit, OnDestroy } from '@angular/core';
import { ItemNotesService } from '../../../services/Items/item-notes.service';
import { Router, ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-view-item-change-log',
  templateUrl: './view-item-change-log.component.html',
  styleUrls: ['./view-item-change-log.component.scss'],
})
export class ViewItemChangeLogComponent implements OnInit, OnDestroy {
  model: any = {};
  index = 0;
  date = Date.now();
  bsConfig: any;
  itemId = 0;
  journalId = 0;
  id = 0;
  dismissible = true;
  loader = false;

  // ✅ used to clean up subscriptions
  private readonly destroy$ = new Subject<void>();

  constructor(
    private readonly itemNotesService: ItemNotesService,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly spinner: NgxSpinnerService
  ) {
    // ✅ ActivatedRoute params are strings → convert safely
    this.journalId = Number(this.route.snapshot.params['journalId'] || 0);
    this.itemId = Number(this.route.snapshot.params['itemId'] || 0);

    this.spinner.show();

    this.itemNotesService
      .getItemNotes(this.journalId)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (response) => {
          this.spinner.hide();
          this.model = response;
          if (this.model.enteredOn) {
            this.model.enteredOn = new Date(this.model.enteredOn);
          }
        },
        () => {
          this.spinner.hide();
        }
      );
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  cancelItemNotes(): void {
    this.router.navigate(['/items/changeLog/' + this.itemId]);
  }

  backToItem(): void {
    this.router.navigate(['/items/viewItem/' + this.itemId]);
  }
}
