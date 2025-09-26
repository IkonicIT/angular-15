import { Component, OnInit, OnDestroy } from '@angular/core';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { ItemNotesService } from '../../../services/Items/item-notes.service';
import { CompanyManagementService } from '../../../services/company-management.service';
import { ItemManagementService } from '../../../services/Items/item-management.service';
import { Router, ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-add-item-note',
  templateUrl: './add-item-note.component.html',
  styleUrls: ['./add-item-note.component.scss'],
})
export class AddItemNoteComponent implements OnInit, OnDestroy {
  model: any = {};
  index = 0;
  item: any = {};
  itemId = 0;
  id!: number;

  bsConfig!: Partial<BsDatepickerConfig>;
  dismissible = true;
  globalCompany: any;
  companyId: any;
  userName: any;
  loader = false;

  private globalCompanySub?: Subscription;

  constructor(
    private itemNoteService: ItemNotesService,
    private companyManagementService: CompanyManagementService,
    private router: Router,
    private itemManagementService: ItemManagementService,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService
  ) {
    this.itemId = this.route.snapshot.params['id'];

    this.globalCompany = this.companyManagementService.getGlobalCompany();
    this.companyId = this.globalCompany?.companyId;

    this.globalCompanySub = this.companyManagementService.globalCompanyChange.subscribe((value) => {
      this.globalCompany = value;
      this.companyId = value?.companyId;
    });
  }

  ngOnInit(): void {
    this.userName = sessionStorage.getItem('userName');

    this.model.date = new Date();
    this.model.effectiveOn = new Date();
    this.bsConfig = { containerClass: 'theme-red' };

    this.getItemDetails();
  }

  ngOnDestroy(): void {
    this.globalCompanySub?.unsubscribe();
  }

  getItemDetails(): void {
    this.spinner.show();

    this.itemManagementService.getItemDetails(this.itemId).subscribe(
      (response) => {
        this.item = response;
        this.spinner.hide();
      },
      () => {
        this.spinner.hide();
      }
    );
  }

  saveItemNote(): void {
    if (!this.model.entityName || !this.model.effectiveOn) {
      this.index = -1;
      window.scroll(0, 0);
      return;
    }

    const payload = {
      companyId: this.companyId,
      effectiveOn: this.model.effectiveOn,
      enteredBy: this.userName,
      enteredOn: new Date(),
      entityId: this.itemId,
      entityName: this.model.entityName,
      entitytypeId: 0,
      entityXml: '',
      entry: this.model.entry ? this.model.entry : ' ',
      jobNumber: this.model.jobNumber,
      journalId: 0,
      journaltypeId: 0,
      locationId: 0,
      locationName: '',
      poNumber: this.model.poNumber,
      shippingNumber: '',
      trackingNumber: '',
      moduleType: 'itemType',
    };
    this.spinner.show();

    this.itemNoteService.saveItemNote(payload).subscribe(
      () => {
        this.spinner.hide();
        window.scroll(0, 0);
        this.index = 1;
        setTimeout(() => {
          this.index = 0;
        }, 7000);
      },
      () => {
        this.spinner.hide();
      }
    );
  }

  cancelItemNote(): void {
    this.router.navigate(['/items/notes/' + this.itemId]);
  }
}
