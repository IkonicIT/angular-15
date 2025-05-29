import { Component, OnInit } from '@angular/core';
import { CompanyDocumentsService } from '../../../services/company-documents.service';
import { Router, ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Location } from '@angular/common';
import { CranesService } from 'src/app/services/cranes.service';

@Component({
  selector: 'app-edit-crane-note-attachment',
  templateUrl: './edit-crane-note-attachment.component.html',
  styleUrls: ['./edit-crane-note-attachment.component.scss'],
})
export class EditCraneNoteAttachmentComponent implements OnInit {
  model: any = {};
  index: number = 0;
  date = Date.now();
  companyId: number = 0;
  documentId: any = 0;
  private sub: any;
  id: number;
  router: Router;
  dismissible = true;
  helpFlag: any = false;
  partId: any;
  constructor(
    private companyDocumentsService: CompanyDocumentsService,
    router: Router,
    private cranesService: CranesService,
    private location: Location,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService
  ) {
    this.route.paramMap.subscribe((params) => {
      this.documentId = params.get('id'); // 'id' is the placeholder used in the route
      console.log('Part ID:', this.documentId); // Now you have access to the partId
    });
    console.log('compaanyid=' + this.companyId);
    this.router = router;
  }

  ngOnInit() {
    this.spinner.show();
    this.cranesService.getCraneNoteAttachment(this.documentId).subscribe(
      (response) => {
        this.model = response;
        this.spinner.hide();
      },
      (error) => {
        this.spinner.hide();
      }
    );
  }

  updateCraneDocument() {
    this.spinner.show();
    this.cranesService
      .updateCraneNoteAttachment(this.documentId, this.model)
      .subscribe(
        (response) => {
          window.scroll(0, 0);
          this.spinner.hide();
          this.index = 1;
          //  this.router.navigate(['/parts/manageAttachments/' + this.partId]);
        },
        (error) => {
          this.spinner.hide();
        }
      );
  }

  cancelCraneDocument() {
    this.location.back();
  }
  print() {
    this.helpFlag = false;
    window.print();
  }
  help() {
    this.helpFlag = !this.helpFlag;
  }
}
