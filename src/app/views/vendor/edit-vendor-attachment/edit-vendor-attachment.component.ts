import { Component, OnInit } from '@angular/core';
import { CompanyDocumentsService } from '../../../services/company-documents.service';
import { Router, ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-edit-vendor-attachment',
  templateUrl: './edit-vendor-attachment.component.html',
  styleUrls: ['./edit-vendor-attachment.component.scss'],
})
export class EditVendorAttachmentComponent implements OnInit {
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
  vendorId: any;
  constructor(
    private companyDocumentsService: CompanyDocumentsService,
    router: Router,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService
  ) {
    this.vendorId = route.snapshot.params['id'];
    console.log('compaanyid=' + this.companyId);
    this.router = router;
  }

  ngOnInit() {
    this.sub = this.route.queryParams.subscribe((params) => {
      this.vendorId = +params['q'] || 0;
      console.log('Query params ', this.companyId);
    });

    this.sub = this.route.queryParams.subscribe((params) => {
      this.documentId = +params['a'] || 0;
      console.log('Query params ', this.documentId);
    });

    this.companyDocumentsService
      .getVendorDocument(this.documentId.toString())
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
        this.router.navigate(['/vendor/documents/' + this.vendorId]);
      },
      (error) => {
        this.spinner.hide();
      }
    );
  }

  cancelVendorDocument() {
    this.router.navigate(['/vendor/documents/' + this.vendorId]);
  }
  print() {
    this.helpFlag = false;
    window.print();
  }
  help() {
    this.helpFlag = !this.helpFlag;
  }
}
