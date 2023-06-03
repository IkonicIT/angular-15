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
  index: number = 0;
  date = Date.now();
  locationId: number = 0;
  journalid: number = 0;
  private sub: any;
  id: number;
  dismissible = true;

  constructor(
    private locationNotesService: LocationNotesService,
    private router: Router,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService,
    public datepipe: DatePipe
  ) {
    this.journalid = route.snapshot.params['id'];
    this.locationId = route.snapshot.params['locId'];
    this.router = router;
    this.spinner.show();
    this.locationNotesService
      .getLocationNotes(this.journalid, this.locationId)
      .subscribe((response) => {
        this.spinner.hide();
        this.model = response;
        if (this.model.effectiveon) {
          this.model.effectiveon = new Date(this.model.effectiveon);
          this.model.effectiveon = this.datepipe.transform(
            this.model.effectiveon,
            'MM/dd/yyyy'
          );
        }
      });
  }

  ngOnInit() {}

  updateLocationNotes() {
    if (!this.model.entityname || !this.model.effectiveon) {
      this.index = -1;
      window.scroll(0, 0);
    } else {
      this.spinner.show();
      this.model.moduleType = 'locationtype';
      this.model.effectiveon = new Date(this.model.effectiveon);
      this.locationNotesService.updateLocationNotes(this.model).subscribe(
        (response) => {
          this.model.effectiveon = this.datepipe.transform(
            this.model.effectiveon,
            'MM/dd/yyyy'
          );
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

  cancelLocationNotes() {
    this.router.navigate(['/location/notes/' + this.locationId]);
  }
}
