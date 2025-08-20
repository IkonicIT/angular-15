import { Component, OnInit } from '@angular/core';
import { CompanyDocumentsService } from '../../../services/company-documents.service';
import { CompanyManagementService } from '../../../services/company-management.service';
import { Router, ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-edit-vendor-note-attachment',
  templateUrl: './edit-vendor-note-attachment.component.html',
  styleUrls: ['./edit-vendor-note-attachment.component.scss'],
})
export class EditVendorNoteAttachmentComponent implements OnInit {
  model: any = {};
  index: number = 0;
  date = Date.now();
  companyId: number = 0;
  dismissible: boolean = true; // Add this line

  documentId: number = 0;
  private sub: any;
  id: number;
  router: Router;
  helpFlag: any = false;
  vendorNoteAttachmentId: any;
  vendorNoteId: any;
  constructor(
    private companyDocumentsService: CompanyDocumentsService,
    router: Router,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService
  ) {
    this.router = router;
    this.vendorNoteAttachmentId = route.snapshot.params['id'];
  }

  ngOnInit() {
    this.sub = this.route.queryParams.subscribe((params) => {
      this.vendorNoteId = +params['q'] || 0;
      console.log('Query params of VendorNoteId ', this.vendorNoteId);
    });

    this.sub = this.route.queryParams.subscribe((params) => {
      this.documentId = +params['a'] || 0;
      console.log('Query params ', this.documentId);
    });

    this.companyDocumentsService
      .getVendorDocument(this.vendorNoteAttachmentId)
      .subscribe(
        (response) => {
          this.model = response;
        },
        (error) => {
          this.spinner.hide();
        }
      );
  }

  updateVendorDocument() {
    this.companyDocumentsService.updateVendorDocument(this.model).subscribe(
      (response) => {
        window.scroll(0, 0);
        this.index = 1;
        this.router.navigate(['/vendor/note/documents/' + this.vendorNoteId]);
        this.spinner.hide();
      },
      (error) => {
        this.spinner.hide();
      }
    );
  }

  cancelVendorDocument() {
    this.router.navigate(['/vendor/note/documents/' + this.vendorNoteId]);
  }
  print() {
    this.helpFlag = false;
    window.print();
  }
  help() {
    this.helpFlag = !this.helpFlag;
  }
}
