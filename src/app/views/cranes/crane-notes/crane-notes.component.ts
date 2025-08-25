import { Component, OnInit, TemplateRef } from '@angular/core';
import { CompanyDocumentsService } from '../../../services/company-documents.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { CompanyManagementService } from '../../../services/company-management.service';
import { CompanynotesService } from '../../../services/companynotes.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { DatePipe, Location } from '@angular/common';
import { CranesService } from 'src/app/services/cranes.service';

@Component({
  selector: 'app-crane-notes',
  templateUrl: './crane-notes.component.html',
  styleUrls: ['./crane-notes.component.scss'],
})
export class CraneNotesComponent implements OnInit {
  companyId: string;
  model: any = {};
  p: any;
  index: any;
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
  craneId: string;
  index1: any;
  viewFlag: any = false;
  editFlag: any = false;
  newFlag: any = true;
  highestRank: any;
  dismissible = true;
  craneNoteId: number = 0;
  userName: any;
  constructor(
    private modalService: BsModalService,
    private companyDocumentsService: CompanyDocumentsService,
    private companyManagementService: CompanyManagementService,
    private location: Location,
    private companynotesService: CompanynotesService,
    public datepipe: DatePipe,
    private cranesService: CranesService,
    router: Router,
    route: ActivatedRoute,
    private spinner: NgxSpinnerService
  ) {
    this.craneId = route.snapshot.params['id'];
    this.router = router;

    this.getAllNotes(this.craneId);
    // if(this.companyId){
    //   this.getAllNotes(this.craneId);
    // }
    // this.companyManagementService.globalCompanyChange.subscribe((value) => {
    //   this.globalCompany = value;
    //   this.companyName = value.name;
    //   this.companyId = value.companyId;
    //   this.getAllNotes(this.vendorId);
    // });
  }

  ngOnInit() {
    this.highestRank = sessionStorage.getItem('highestRank');
    this.userName = sessionStorage.getItem('userName');
  }

  getAllNotes(craneId: any) {
    this.spinner.show();
    this.cranesService.getAllCraneNotes(craneId).subscribe(
      (response) => {
        this.spinner.hide();
        this.notes = response;
      },
      (error) => {
        this.spinner.hide();
      }
    );
  }

  saveCraneNotes() {
    if (!this.model.name || !this.model.createdDate) {
      this.index1 = -1;
      window.scroll(0, 0);
      setTimeout(() => {
        this.index1 = 0;
      }, 3000);
    } else {
      this.model = {
        craneNoteId: 0,
        createdBy: this.userName,
        createdDate: this.model.createdDate,
        name: this.model.name,
        // "jobnumber": this.model.jobnumber,
        // "ponumber": this.model.ponumber,
        details: this.model.details,
        isNew: true,
        BMKEY1: this.craneId,
      };
      this.spinner.show();
      this.cranesService.addCraneNote(this.model).subscribe(
        (response) => {
          this.spinner.hide();
          window.scroll(0, 0);
          this.index1 = 1;
          this.getAllNotes(this.craneId);
          setTimeout(() => {
            this.index1 = 0;
            this.addNotes();
          }, 3000);
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
    this.cranesService.deleteCraneNote(this.craneNoteId).subscribe(
      (response) => {
        this.model = [];
        this.spinner.hide();
        this.modalRef.hide();
        this.viewFlag = false;
        this.newFlag = true;
        this.editFlag = false;
        this.helpFlag = false;
        this.getAllNotes(this.craneId);
      },
      (error) => {
        this.spinner.hide();
      }
    );
  }

  viewCraneNote(noteId: any) {
    this.viewFlag = true;
    this.newFlag = false;
    this.editFlag = false;
    this.helpFlag = false;
    this.spinner.show();
    this.cranesService.getCraneNote(noteId).subscribe((response) => {
      this.craneNoteId = this.model.partNoteId;
      this.spinner.hide();
      this.model = response;
      sessionStorage.setItem('BMKEY1', this.model.BMKEY1);
      this.craneNoteId = this.model.craneNoteId;
      if (this.model.createdDate) {
        this.model.createdDate = this.datepipe.transform(
          this.model.createdDate,
          'MM/dd/yyyy'
        );
      }
    });
    window.scroll(0, 0);
  }

  backToCrane() {
    this.location.back();
  }

  goToAttachments(vendorNoteId: any) {
    this.router.navigateByUrl(`cranes/craneNoteAttachments/${vendorNoteId}`);
  }

  updateCraneNotes() {
    if (!this.model.name || !this.model.createdDate) {
      this.index1 = -1;
      window.scroll(0, 0);
      setTimeout(() => {
        this.index1 = 0;
      }, 3000);
    } else {
      const currentDate = new Date();
      const createdDate = this.model.createdDate;
      this.model.createdDate = this.datepipe.transform(
        createdDate,
        "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'"
      );
      this.model.updatedBy = this.userName;
      this.model.updatedDate = this.datepipe.transform(
        currentDate,
        "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'"
      );
      this.cranesService
        .updateCraneNote(this.craneNoteId, this.model)
        .subscribe(
          (response) => {
            this.model.createdDate = this.datepipe.transform(
              this.model.createdDate,
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
            }, 7000);
          },
          (error) => {
            this.spinner.hide();
          }
        );
    }
  }

  refreshCall() {
    this.getAllNotes(this.craneId);
  }

  addNotes() {
    this.newFlag = true;
    this.editFlag = false;
    this.viewFlag = false;
    this.helpFlag = false;
    this.model = [];
    this.model.effectiveon = new Date();
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
