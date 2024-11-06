import { Component, OnInit } from '@angular/core';
import { CompanyDocumentsService } from '../../../services/company-documents.service';
import { Router, ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { PartsService } from 'src/app/services/parts.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-edit-part-attachment',
  templateUrl: './edit-part-attachment.component.html',
  styleUrls: ['./edit-part-attachment.component.scss'],
})
export class EditPartAttachmentComponent implements OnInit {
  model: any = {};
  index: number = 0;
  date = Date.now();
  companyId: number = 0;
  documentId: any = 0;
  private sub: any;
  id: number;
  router: Router;
  dismissible: boolean = true;
  helpFlag: any = false;
  partId: any;
  userName: any;
  constructor(
    private companyDocumentsService: CompanyDocumentsService,
    router: Router,
    private partService: PartsService,
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
    this.userName = sessionStorage.getItem('userName');
    this.spinner.show();
    this.partService.getPartAttachment(this.documentId).subscribe(
      (response) => {
        this.model = response;
        this.spinner.hide();
      },
      (error) => {
        this.spinner.hide();
      }
    );
  }

  updateVendorDocument() {
    this.spinner.show();
    this.model.updatedBy = this.userName;
    this.partService
      .updatePartAttachment(this.documentId, this.model)
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

  cancelVendorDocument() {
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
