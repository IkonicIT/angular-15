import { Component, OnInit } from '@angular/core';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { ItemNotesService } from '../../../services/Items/item-notes.service';
import { CompanyManagementService } from '../../../services/company-management.service';
import { ItemManagementService } from '../../../services/Items/item-management.service';
import { Router, ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-add-item-note',
  templateUrl: './add-item-note.component.html',
  styleUrls: ['./add-item-note.component.scss'],
})
export class AddItemNoteComponent implements OnInit {
  model: any = {};
  index: number = 0;
  item: any = {};
  itemId: number = 0;
  private sub: any;
  id: number;
  bsConfig: Partial<BsDatepickerConfig>;
  dismissible = true;
  globalCompany: any;
  companyId: any;
  userName: any;
  loader = false;
  constructor(
    private itemNoteService: ItemNotesService,
    private companyManagementService: CompanyManagementService,
    private router: Router,
    private itemManagementService: ItemManagementService,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService
  ) {
    this.itemId = route.snapshot.params['id'];
    this.globalCompany = this.companyManagementService.getGlobalCompany();
    this.companyId = this.globalCompany.companyId;
    this.companyManagementService.globalCompanyChange.subscribe((value) => {
      this.globalCompany = value;
      this.companyId = value.companyId;
    });
  }

  ngOnInit() {
    this.userName = sessionStorage.getItem('userName');

    this.model.date = new Date();
    this.bsConfig = Object.assign({}, { containerClass: 'theme-red' });

    console.log('itemId=' + this.itemId);
    this.model.effectiveon = new Date();
    this.getItemDetails();
  }

  getItemDetails() {
    this.spinner.show();

    this.itemManagementService.getItemDetails(this.itemId).subscribe(
      (response) => {
        this.item = response;
        this.spinner.hide();

        console.log('item =', this.item);
      },
      (error) => {
        this.spinner.hide();
      }
    );
  }

  saveItemNote() {
    if (!this.model.entityname || !this.model.effectiveon) {
      this.index = -1;
      window.scroll(0, 0);
    } else {
      this.model = {
        companyId: this.companyId,
        effectiveon: this.model.effectiveon,
        enteredby: this.userName,
        enteredon: new Date(),
        entityId: this.itemId,
        entityname: this.model.entityname,
        entitytypeId: 0,
        entityxml: '',
        entry: this.model.entry ? this.model.entry : ' ',
        jobnumber: this.model.jobnumber,
        journalid: 0,
        journaltypeId: 0,
        locationid: 0,
        locationname: '',
        ponumber: this.model.ponumber,
        shippingnumber: '',
        trackingnumber: '',
        moduleType: 'itemtype',
      };
      console.log(JSON.stringify(this.model));
      this.spinner.show();

      this.itemNoteService.saveItemNote(this.model).subscribe(
        (response) => {
          this.spinner.hide();

          window.scroll(0, 0);
          this.index = 1;
          setTimeout(() => {
            this.index = 0;
          }, 7000);
        },
        (error) => {
          this.spinner.hide();
        }
      );
    }
  }

  cancelItemNote() {
    this.router.navigate(['/items/notes/' + this.itemId]);
  }
}
