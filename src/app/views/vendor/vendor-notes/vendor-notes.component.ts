import { Component, OnInit, TemplateRef } from '@angular/core';
import { CompanyDocumentsService } from '../../../services/company-documents.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { CompanyManagementService } from '../../../services/company-management.service';
import { CompanynotesService } from '../../../services/companynotes.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-vendor-notes',
  templateUrl: './vendor-notes.component.html',
  styleUrls: ['./vendor-notes.component.scss'],
})
export class VendorNotesComponent implements OnInit {
  companyId: string;
  model: any = {};
  p: any;
  index: string = 'companydocument';
  notes: any[] = [];
  router: Router;
  message: string;
  modalRef: BsModalRef;
  companyName: string = '';
  vendorName: string = '';
  order: string = 'date';
  reverse: string = '';
  vendorNotesFilter: any = '';
  itemsForPagination: any = 5;
  globalCompany: any;
  helpFlag: any = false;
  vendorId: string;
  index1: any;
  viewFlag: any = false;
  editFlag: any = false;
  newFlag: any = true;
  highestRank: any;
  vendorNoteId: number = 0;
  userName:any;
  public dismissible: boolean = true;
  constructor(
    private modalService: BsModalService,
    private companyDocumentsService: CompanyDocumentsService,
    private companyManagementService: CompanyManagementService,
    private companynotesService: CompanynotesService,
    public datePipe: DatePipe,

    router: Router,
    route: ActivatedRoute,
    private spinner: NgxSpinnerService
  ) {
    this.vendorId = route.snapshot.params['id'];
    this.router = router;
    this.getAllNotes(this.vendorId);
    if (this.companyId) {
      this.getAllNotes(this.vendorId);
    }
    this.companyManagementService.globalCompanyChange.subscribe((value) => {
      this.globalCompany = value;
      this.companyName = value.name;
      this.companyId = value.companyId;
      this.getAllNotes(this.vendorId);
    });
  }

  ngOnInit() {
    this.highestRank = sessionStorage.getItem('highestRank');
    this.userName = sessionStorage.getItem('userName');
  }

  getAllNotes(vendorId: string) {
    this.addNotes();
    this.spinner.show();
    this.companynotesService.getAllVendorNotes(vendorId).subscribe(
      (response: any) => {
        this.spinner.hide();
        this.notes = response;
      },
      (error) => {
        this.spinner.hide();
      }
    );
  }

  saveVendorNotes() {
    if (!this.model.name || !this.model.createdDate) {
      this.index1 = -1;
      window.scroll(0, 0);
    } else {
      this.model = {
        vendorNoteId: 0,
        createdBy: this.userName,
        createdDate: this.model.createdDate,
        name: this.model.name,
        jobNumber: this.model.jobNumber,
        poNumber: this.model.poNumber,
        details: this.model.details,
        isNew: true,
        vendorId: this.vendorId,
      };
      this.spinner.show();
      this.companynotesService.saveVendorNotes(this.model).subscribe(
        (response: any) => {
          this.spinner.hide();
          window.scroll(0, 0);
          this.index1 = 1;
          setTimeout(() => {
            this.index1 = 0;
          }, 3000);

          this.getAllNotes(this.vendorId);
        },
        (error) => {
          this.spinner.hide();
        }
      );
    }
  }

  openModal(template: TemplateRef<any>, id: any) {
    this.index = id;
    this.modalRef = this.modalService.show(template, { class: 'modal-lg' });
  }

  confirm(): void {
    this.message = 'Confirmed!';
    this.spinner.show();
    this.companynotesService.removeVendorNotes(this.index).subscribe(
      (response: any) => {
        this.spinner.hide();
        this.modalRef.hide();
        this.index1 = 4;
        setTimeout(() => {
          this.index1 = 0;
        }, 2000);
        this.getAllNotes(this.vendorId);
      },
      (error) => {
        this.spinner.hide();
      }
    );
  }

  viewVendorNote(noteId: any) {
    this.viewFlag = true;
    this.newFlag = false;
    this.editFlag = false;
    this.helpFlag = false;
    this.spinner.show();
    this.companynotesService
      .getVendorNotes(noteId)
      .subscribe((response: any) => {
        this.spinner.hide();
        this.model = response;
        if (this.model.createdDate) {
          this.model.createdDate = new Date(this.model.createdDate);
          this.model.createdDate = this.datePipe.transform(
            this.model.createdDate,
            'MM/dd/yyyy'
          );
        }
      });
    window.scroll(0, 0);
  }

  backToVendor() {
    this.router.navigate(['vendor/list/'], {
      queryParams: { q: this.vendorId },
    });
  }

  goToAttachments(vendorNoteId: string) {
    // Update this line
    console.log('attachement:', vendorNoteId);
    this.router.navigate(['vendor/note/documents/' + vendorNoteId], {
      queryParams: { q: this.vendorId },
    });
  }

  updateVendorNotes() {
    if (!this.model.name || !this.model.createdDate) {
      this.index1 = -1;
      window.scroll(0, 0);
    } else {
      this.model.updatedDate = this.datePipe.transform(new Date(), "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'");
      this.model.updatedBy = this.userName;
      const parsedDate = new Date(this.model.createdDate);
    
    // Format it into the desired format
      this.model.createdDate = this.datePipe.transform(parsedDate, "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'");
      this.companynotesService.updateVenodrNotes(this.model).subscribe(
        (response: any) => {
          this.model.effectiveOn = this.datePipe.transform(
            this.model.effectiveOn,
            'MM/dd/yyyy'
          );
          this.spinner.hide();
          window.scroll(0, 0);
          this.viewFlag = true;
          this.newFlag = false;
          this.editFlag = false;
          this.helpFlag = false;
          this.refreshCall();
          this.index1 = 2;
          setTimeout(() => {
            this.index1 = 0;
          }, 3000);
        },
        (error) => {
          this.spinner.hide();
        }
      );
    }
  }

  refreshCall() {
    this.getAllNotes(this.vendorId);
  }

  cancelVendorNotes() {
    this.newFlag = true;
    this.editFlag = false;
    this.viewFlag = false;
    this.helpFlag = false;
    this.model = [];
    this.model.effectiveOn = new Date();
  }

  addNotes() {
    this.newFlag = true;
    this.editFlag = false;
    this.viewFlag = false;
    this.helpFlag = false;
    this.model = [];
    this.model.effectiveOn = new Date();
  }

  editNote() {
    this.editFlag = true;
    this.viewFlag = false;
    this.newFlag = false;
    this.helpFlag = false;
  }
  decline(): void {
    this.message = 'Declined!';
    this.modalRef.hide();
  }
  setOrder(value: string) {
    if (this.order === value) {
      if (this.reverse == '') {
        this.reverse = '-';
      } else {
        this.reverse = '';
      }
    }
    this.order = value;
  }
  print() {
    this.helpFlag = false;
    window.print();
  }
  help() {
    this.helpFlag = !this.helpFlag;
  }
}
