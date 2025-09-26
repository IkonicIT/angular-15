import { Component, OnInit } from '@angular/core';
import { LocationNotesService } from '../../../services/location-notes.service';
import { Router, ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-edit-location-note',
  templateUrl: './edit-location-note.component.html',
  styleUrls: ['./edit-location-note.component.scss'],
})
export class EditLocationNoteComponent implements OnInit {
  model: any = {};
  index = 0;
  date = Date.now();
  locationId = 0;
  journalId = 0;
  dismissible = true;
  loader = false;

  constructor(
    private locationNotesService: LocationNotesService,
    private router: Router,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService,
    public datepipe: DatePipe
  ) {
    this.journalId = Number(this.route.snapshot.params['id']);
    this.locationId = Number(this.route.snapshot.params['locId']);

    this.spinner.show();
    this.locationNotesService
      .getLocationNotes(this.journalId, this.locationId)
      .subscribe(
        (response) => {
          this.spinner.hide();
          this.model = response;

          if (this.model?.effectiveOn) {
            const effectiveDate = new Date(this.model.effectiveOn);
            this.model.effectiveOn = this.datepipe.transform(
              effectiveDate,
              'MM/dd/yyyy'
            );
          }
        },
        () => this.spinner.hide()
      );
  }

  ngOnInit(): void {}

  updateLocationNotes(): void {
    if (!this.model?.entityName || !this.model?.effectiveOn) {
      this.index = -1;
      window.scroll(0, 0);
      return;
    }

    this.spinner.show();
    this.model.moduleType = 'locationtype';
    this.model.effectiveOn = new Date(this.model.effectiveOn);

    this.locationNotesService.updateLocationNotes(this.model).subscribe(
      () => {
        this.model.effectiveOn = this.datepipe.transform(
          this.model.effectiveOn,
          'MM/dd/yyyy'
        );
        this.spinner.hide();

        window.scroll(0, 0);
        this.index = 1;
        setTimeout(() => (this.index = 0), 7000);
      },
      () => this.spinner.hide()
    );
  }

  cancelLocationNotes(): void {
    this.router.navigate([`/location/notes/${this.locationId}`]);
  }
}
