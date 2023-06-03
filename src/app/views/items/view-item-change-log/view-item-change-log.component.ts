import { Component, OnInit } from '@angular/core';
import { ItemNotesService } from '../../../services/Items/item-notes.service';
import { Router, ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-view-item-change-log',
  templateUrl: './view-item-change-log.component.html',
  styleUrls: ['./view-item-change-log.component.scss'],
})
export class ViewItemChangeLogComponent implements OnInit {
  model: any = {};
  index: number = 0;
  date = Date.now();
  bsConfig: any;
  itemId: number = 0;
  journalid: number = 0;
  private sub: any;
  id: number;
  dismissible = true;
  constructor(
    private itemNotesService: ItemNotesService,
    private router: Router,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService
  ) {
    this.journalid = route.snapshot.params['journalId'];
    this.itemId = route.snapshot.params['itemId'];
    this.router = router;
    this.spinner.show();
    this.itemNotesService.getItemNotes(this.journalid).subscribe((response) => {
      this.spinner.hide();
      this.model = response;
      if (this.model.enteredon) {
        this.model.enteredon = new Date(this.model.enteredon);
      }
    });
  }

  ngOnInit() {}

  cancelItemNotes() {
    this.router.navigate(['/items/changeLog/' + this.itemId]);
  }

  backToItem() {
    this.router.navigate(['/items/viewItem/' + this.itemId]);
  }
}
