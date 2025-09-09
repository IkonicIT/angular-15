import { Component, OnInit, TemplateRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { NgxSpinnerService } from 'ngx-spinner';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { BroadcasterService } from '../../../services/broadcaster.service';
import { ItemManagementService } from '../../../services/Items/item-management.service';
import { ItemServiceManagementService } from '../../../services/Items/item-service-management.service';

@Component({
  selector: 'app-add-item-service',
  templateUrl: './add-item-service.component.html',
  styleUrls: ['./add-item-service.component.scss'],
})
export class AddItemServiceComponent implements OnInit {
  model: any = {};
  itemTag!: string;
  itemType!: string;
  helpFlag = false;
  itemId!: number;

  index = 0;
  itemsForPagination = 5;
  completedServicesForPagination = 5;
  page1 = 1;
  page2 = 1;

  order = 'serviceDate';
  reverse = '';
  completedOrder = 'serviceDate';
  completedReverse = '';

  userName!: string | null;
  highestRank!: string | null;
  get highestRankNum(): number {
    return Number(this.highestRank ?? 0);
  }
  completedServices: any[] = [];
  incompletedServices: any[] = [];
  serviceCauses: string[] = [];

  modalRef!: BsModalRef;
  deleteModalRef!: BsModalRef;

  addFlag = false;
  editFlag = false;
  serviceId!: number;

  dismissible = true;
  inCompletedServicesFilter: any;
  completedServicesFilter: any;

  loader = false;
  index1 = 0;

  constructor(
    private broadcasterService: BroadcasterService,
    private route: ActivatedRoute,
    private location: Location,
    private itemManagementService: ItemManagementService,
    private spinner: NgxSpinnerService,
    private modalService: BsModalService,
    private itemServiceManagementService: ItemServiceManagementService
  ) {
    this.itemId = Number(this.route.snapshot.params['itemId']);
  }

  ngOnInit(): void {
    this.itemTag = this.broadcasterService.currentItemTag;
    this.itemType = this.broadcasterService.currentItemType;
    this.userName = sessionStorage.getItem('userName');
    this.highestRank = sessionStorage.getItem('highestRank');
    this.initData();
  }

  initData(): void {
    this.spinner.show();

    this.itemServiceManagementService.getAllItemServices(String(this.itemId)).subscribe(
      (response: any) => {
        this.completedServices = response.completedServices ?? [];
        this.incompletedServices = response.inCompletedServices ?? [];
        setTimeout(() => this.spinner.hide(), 2000);
      },
      () => this.spinner.hide()
    );

    this.serviceCauses = [
      'Relubricate/Grease Bearings',
      'Check Bearing Oil Level',
      'Change Bearing Oil',
      'Check/Change Air Filters',
      'Check Brush Length',
      'Schedule Blow/Wipe/Check',
      'Send Out For Recondition',
      'Schedule Vibration Check',
    ];
  }

  saveItemServiceData(): void {
    this.index = 0;

    if (!this.model.serviceDate) {
      this.index = -1;
      return;
    }

    if (this.model.complete === true) {
      if (this.model.serviceCause && this.model.actualCompletion) {
        this.addOrUpdateItemService();
      } else {
        this.index = -2;
      }
    } else {
      this.addOrUpdateItemService();
    }
  }

  addOrUpdateItemService(): void {
    this.model.completedBy = this.model.complete ? this.userName : '';

    if (this.addFlag) {
      const addRequest = {
        itemId: this.itemId,
        serviceDate: this.model.serviceDate,
        serviceCause:
          this.model.serviceCause !== 0
            ? this.model.serviceCause
            : this.model.newServiceCause,
        actualCompletion: this.model.actualCompletion ?? null,
        complete: this.model.complete ?? false,
        completedBy: this.model.completedBy,
        createdDate: new Date(),
        createdBy: this.userName,
        updatedDate: new Date(),
        updatedBy: this.userName,
      };

      this.spinner.show();
      this.itemServiceManagementService.saveItemService(addRequest).subscribe(
        () => {
          setTimeout(() => this.spinner.hide(), 2000);
          this.index = 1;
          this.initData();
          setTimeout(() => {
            this.index = 0;
            this.modalRef?.hide();
          }, 2000);
        },
        () => this.spinner.hide()
      );
    } else {
      const updateRequest = {
        itemId: this.itemId,
        serviceDate: this.model.serviceDate,
        serviceCause:
          this.model.serviceCause !== 0
            ? this.model.serviceCause
            : this.model.newServiceCause,
        actualCompletion: this.model.actualCompletion ?? null,
        complete: this.model.complete ?? false,
        completedBy: this.model.completedBy,
        createdDate: this.model.createdDate,
        createdBy: this.model.createdBy,
        updatedDate: new Date(),
        updatedBy: this.userName,
      };

      this.spinner.show();
      this.itemServiceManagementService
        .updateItemService(updateRequest, this.model.serviceId)
        .subscribe(
          () => {
            setTimeout(() => this.spinner.hide(), 2000);
            this.index = 1;
            this.initData();
            setTimeout(() => {
              this.index = 0;
              this.modalRef?.hide();
            }, 2000);
          },
          () => this.spinner.hide()
        );
    }
  }

  print(): void {
    this.helpFlag = false;
    window.print();
  }

  help(): void {
    this.helpFlag = !this.helpFlag;
  }

  back(): void {
    this.location.back();
  }

  setOrder(value: string): void {
    if (this.order === value) {
      this.reverse = this.reverse === '' ? '-' : '';
    }
    this.order = value;
  }

  setCompletedOrder(value: string): void {
    if (this.completedOrder === value) {
      this.completedReverse = this.completedReverse === '' ? '-' : '';
    }
    this.completedOrder = value;
  }

  openModal(template: TemplateRef<any>): void {
    this.addFlag = true;
    this.editFlag = false;
    this.modalRef = this.modalService.show(template, { class: 'modal-lg' });
  }

  openModalForEdit(template: TemplateRef<any>, serviceId: number): void {
    this.editFlag = true;
    this.addFlag = false;
    this.spinner.show();

    this.itemServiceManagementService.getServiceById(String(serviceId)).subscribe(
      (response) => {
        this.model = response;
        this.model.serviceDate = new Date(this.model.serviceDate);

        if (this.model.actualCompletion) {
          this.model.actualCompletion = new Date(this.model.actualCompletion);
        }

        if (this.model.serviceCause) {
          const exists = this.serviceCauses.includes(this.model.serviceCause);
          if (!exists) {
            this.model.newServiceCause = this.model.serviceCause;
            this.model.serviceCause = 0;
          }
        }

        setTimeout(() => this.spinner.hide(), 2000);
      },
      () => this.spinner.hide()
    );

    this.modalRef = this.modalService.show(template, { class: 'modal-lg' });
  }

  closeModel(): void {
    this.model = {};
    this.addFlag = false;
    this.editFlag = false;
    this.modalRef?.hide();
  }

  openDeleteModal(template: TemplateRef<any>, serviceId: number): void {
    this.serviceId = serviceId;
    this.deleteModalRef = this.modalService.show(template, {
      class: 'modal-lg',
    });
  }

  confirm(): void {
    this.spinner.show();
    this.itemServiceManagementService.deleteItemServiceById(String(this.serviceId)).subscribe(
      () => {
        this.deleteModalRef?.hide();
        this.index1 = 1;
        this.initData();
        setTimeout(() => {
          this.index1 = 0;
        }, 2000);
      },
      () => this.spinner.hide()
    );
  }

  decline(): void {
    this.deleteModalRef?.hide();
  }

  checkValue(event: string): void {
    if (event === 'A') {
      this.model.actualCompletion = new Date();
    } else if (event === 'B') {
      this.model.actualCompletion = null;
    }
  }
}
