import { Component, OnInit } from '@angular/core';
import { CompanynotesService } from '../../../services/companynotes.service';
import { Router, ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-edit-crane-note',
  templateUrl: './edit-crane-note.component.html',
  styleUrls: ['./edit-crane-note.component.scss'],
})
export class EditCraneNoteComponent implements OnInit {
  model: any = {};
  index: number = 0;
  date = Date.now();
  bsConfig: any;
  companyId: number = 0;
  journalid: number = 0;
  private sub: any;
  id: number;
  p: any;
  router: Router;
  helpFlag: any = false;
  noteId: any;
  dismissible = true;
  vendorId: any;
  constructor(
    private companynotesService: CompanynotesService,
    router: Router,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService
  ) {
    this.noteId = route.snapshot.params['id'];
    console.log('NoteId=' + this.noteId);
    this.router = router;
  }

  ngOnInit() {
    this.sub = this.route.queryParams.subscribe((params) => {
      this.vendorId = +params['q'] || 0;
      console.log('Query params ', this.noteId);
    });

    this.sub = this.route.queryParams.subscribe((params) => {
      this.noteId = +params['a'] || 0;
      console.log('Query params ', this.journalid);
    });

    this.companynotesService
      .getVendorNotes(this.noteId)
      .subscribe((response) => {
        this.model = response;
      });
  }

  updateNotes() {
    if (!this.model.entityname || !this.model.enteredon) {
      this.index = -1;
      window.scroll(0, 0);
    } else {
      this.companynotesService.updateCompanynotes(this.model).subscribe(
        (response) => {
          window.scroll(0, 0);
          this.index = 1;
        },
        (error) => {
          this.spinner.hide();
        }
      );
    }
  }
  cancelVendorNotes() {
    this.router.navigate(['/vendor/notes/' + this.vendorId]);
  }
  print() {
    this.helpFlag = false;
    window.print();
  }
  help() {
    this.helpFlag = !this.helpFlag;
  }
}
