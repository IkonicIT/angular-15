import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ItemNotesService } from '../../../services/Items/item-notes.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-edit-item-note',
  templateUrl: './edit-item-note.component.html',
  styleUrls: ['./edit-item-note.component.scss'],
})
export class EditItemNoteComponent implements OnInit {
  model: any = {};
  index: number = 0;
  date = Date.now();
  itemId: number = 0;
  journalId: number = 0;
  private sub: any;
  currentRole: any;
  highestRank: any;
  id: number;
  dismissible = true;
  loader = false;
  constructor(
    private itemNotesService: ItemNotesService,
    private router: Router,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService,
    public datepipe: DatePipe
  ) {
    this.journalId = route.snapshot.params['id'];
    this.itemId = route.snapshot.params['itemId'];
    this.router = router;
    this.spinner.show();

    this.itemNotesService.getItemNotes(this.journalId).subscribe((response) => {
      this.spinner.hide();

      this.model = response;
      if (this.model.effectiveOn) {
        this.model.effectiveOn = new Date(this.model.effectiveOn);
        this.model.effectiveOn = this.datepipe.transform(
          this.model.effectiveOn,
          'MM/dd/yyyy'
        );
      }
    });
  }

  ngOnInit() {
    this.currentRole = sessionStorage.getItem('currentRole');
    this.highestRank = sessionStorage.getItem('highestRank');
    console.log('currentRole is' + this.currentRole);
    console.log('highestRank is' + this.highestRank);
  }

  updateItemNotes() {
    if (!this.model.entityName || !this.model.effectiveOn) {
      this.index = -1;
      window.scroll(0, 0);
    } else {
      this.spinner.show();

      this.model.moduleType = 'itemType';
      this.model.effectiveOn = new Date(this.model.effectiveOn);
      this.itemNotesService.updateItemNotes(this.model).subscribe(
        (response) => {
          this.model.effectiveOn = this.datepipe.transform(
            this.model.effectiveOn,
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

  cancelItemNotes() {
    this.router.navigate(['/items/notes/' + this.itemId]);
  }
  backToItem() {
    this.router.navigate(['/items/viewItem/' + this.itemId]);
  }
}
