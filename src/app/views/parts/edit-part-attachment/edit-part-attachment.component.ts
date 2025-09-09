import { Component, OnInit, OnDestroy } from '@angular/core';
import { CompanyDocumentsService } from '../../../services/company-documents.service';
import { Router, ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { PartsService } from 'src/app/services/parts.service';
import { Location } from '@angular/common';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-edit-part-attachment',
  templateUrl: './edit-part-attachment.component.html',
  styleUrls: ['./edit-part-attachment.component.scss'],
})
export class EditPartAttachmentComponent implements OnInit, OnDestroy {
  model: any = {};
  index = 0;
  date = Date.now();
  companyId = 0;
  documentId: any;
  id!: number;
  dismissible = true;
  helpFlag = false;
  partId: any;
  userName: string | null = '';

  private subscriptions = new Subscription();

  constructor(
    private companyDocumentsService: CompanyDocumentsService,
    private router: Router,
    private partService: PartsService,
    private location: Location,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService
  ) {
    const routeSub = this.route.paramMap.subscribe((params) => {
      this.documentId = params.get('id');
    });
    this.subscriptions.add(routeSub);

  }

  ngOnInit(): void {
    this.userName = sessionStorage.getItem('userName');
    this.spinner.show();

    if (this.documentId) {
      this.partService.getPartAttachment(this.documentId).subscribe({
        next: (response) => {
          this.model = response;
          this.spinner.hide();
        },
        error: () => {
          this.spinner.hide();
        },
      });
    } else {
      this.spinner.hide();
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  updateVendorDocument(): void {
    this.spinner.show();
    this.model.updatedBy = this.userName;

    this.partService.updatePartAttachment(this.documentId, this.model).subscribe({
      next: () => {
        window.scroll(0, 0);
        this.spinner.hide();
        this.index = 1;
      },
      error: () => {
        this.spinner.hide();
      },
    });
  }

  cancelVendorDocument(): void {
    this.location.back();
  }

  print(): void {
    this.helpFlag = false;
    window.print();
  }

  help(): void {
    this.helpFlag = !this.helpFlag;
  }
}
