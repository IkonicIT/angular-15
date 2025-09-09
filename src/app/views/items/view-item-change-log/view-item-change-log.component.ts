import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { ItemNotesService } from '../../../services/Items/item-notes.service';

interface ItemNote {
  entityName?: string;
  jobNumber?: string;
  poNumber?: string;
  entry?: string;
  enteredOn?: string | Date;
}

@Component({
  selector: 'app-view-item-change-log',
  templateUrl: './view-item-change-log.component.html',
  styleUrls: ['./view-item-change-log.component.scss'],
})
export class ViewItemChangeLogComponent implements OnInit, OnDestroy {
  model: ItemNote = {};
  index = 0;
  date = Date.now();
  bsConfig: any;

  itemId: number = 0;
  journalId: number = 0;
  id: number = 0;

  dismissible = true;
  loader = false;

  private readonly destroy$ = new Subject<void>();

  constructor(
    private readonly itemNotesService: ItemNotesService,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly spinner: NgxSpinnerService
  ) {
    this.journalId = Number(this.route.snapshot.params['journalId'] ?? 0);
    this.itemId = Number(this.route.snapshot.params['itemId'] ?? 0);
  }

  ngOnInit(): void {
    if (!this.journalId) return;

    this.spinner.show();
    this.itemNotesService
      .getItemNotes(this.journalId)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (response: ItemNote) => {
          this.spinner.hide();
          this.model = response;

          if (this.model.enteredOn) {
            const parsed = new Date(this.model.enteredOn);
            if (!isNaN(parsed.getTime())) {
              this.model.enteredOn = parsed;
            }
          }
        },
        () => {
          this.spinner.hide();
        }
      );
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  cancelItemNotes(): void {
    this.router.navigate(['/items/changeLog', this.itemId]);
  }

  backToItem(): void {
    this.router.navigate(['/items/viewItem', this.itemId]);
  }
}
