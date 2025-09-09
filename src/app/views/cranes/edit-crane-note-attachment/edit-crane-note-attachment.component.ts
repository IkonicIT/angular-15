import { Component, OnInit, OnDestroy } from '@angular/core';
import { CompanyDocumentsService } from '../../../services/company-documents.service';
import { Router, ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Location } from '@angular/common';
import { CranesService } from 'src/app/services/cranes.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-edit-crane-note-attachment',
  templateUrl: './edit-crane-note-attachment.component.html',
  styleUrls: ['./edit-crane-note-attachment.component.scss'],
})
export class EditCraneNoteAttachmentComponent implements OnInit, OnDestroy {
  model: any = {};
  index: number = 0;
  date = Date.now();
  companyId: number = 0;
  documentId: any = 0;
  id!: number;
  dismissible = true;
  helpFlag: any = false;
  partId: any;

  private subscriptions: Subscription = new Subscription();

  constructor(
    private companyDocumentsService: CompanyDocumentsService,
    private router: Router,
    private cranesService: CranesService,
    private location: Location,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService
  ) {
    const sub = this.route.paramMap.subscribe((params) => {
      this.documentId = params.get('id');
    });
    this.subscriptions.add(sub);
  }

  ngOnInit(): void {
    this.spinner.show();
    const sub = this.cranesService.getCraneNoteAttachment(this.documentId).subscribe(
      (response) => {
        this.model = response;
        this.spinner.hide();
      },
      (error) => {
        this.spinner.hide();
      }
    );
    this.subscriptions.add(sub);
  }

  updateCraneDocument(): void {
    this.spinner.show();
    const sub = this.cranesService
      .updateCraneNoteAttachment(this.documentId, this.model)
      .subscribe(
        (response) => {
          window.scroll(0, 0);
          this.spinner.hide();
          this.index = 1;
        },
        (error) => {
          this.spinner.hide();
        }
      );
    this.subscriptions.add(sub);
  }

  cancelCraneDocument(): void {
    this.location.back();
  }

  print(): void {
    this.helpFlag = false;
    window.print();
  }

  help(): void {
    this.helpFlag = !this.helpFlag;
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
