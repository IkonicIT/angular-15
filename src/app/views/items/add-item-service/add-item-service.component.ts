import { Component, OnInit, TemplateRef } from '@angular/core';
import { BroadcasterService } from '../../../services/broadcaster.service';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { ItemManagementService } from '../../../services/Items/item-management.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ItemServiceManagementService } from '../../../services/Items/item-service-management.service';

@Component({
  selector: 'app-add-item-service',
  templateUrl: './add-item-service.component.html',
  styleUrls: ['./add-item-service.component.scss'],
})
export class AddItemServiceComponent implements OnInit {
  model: any = {};
  itemTag: any;
  any: any;
  itemType: any;
  helpFlag: any = false;
  itemId: any;
  index: number = 0;
  itemsForPagination: any = 5;
  completedServicesForPagination: any = 5;
  page1: any = 1;
  page2: any = 1;
  order: string = 'serviceDate';
  reverse: string = '';
  completedOrder: string = 'serviceDate';
  completedReverse: string = '';
  userName: any;
  completedServices: any = [];
  incompletedServices: any = [];
  serviceCauses: any = [];
  modalRef: BsModalRef;
  deleteModalRef: BsModalRef;
  addFlag: any = false;
  editFlag: any = false;
  serviceId: any;
  highestRank: any;
  dismissible = true;
  inCompletedServicesFilter: any;
  completedServicesFilter: any;
  loader = false;
  constructor(
    private broadcasterService: BroadcasterService,
    private route: ActivatedRoute,
    private _location: Location,
    private itemManagementService: ItemManagementService,
    private spinner: NgxSpinnerService,
    private modalService: BsModalService,
    private itemServiceManagementService: ItemServiceManagementService
  ) {
    this.itemId = route.snapshot.params['itemId'];
    console.log('ItemId in Item Service' + this.itemId);
  }

  ngOnInit() {
    this.itemTag = this.broadcasterService.currentItemTag;
    this.itemType = this.broadcasterService.currentItemType;
    this.userName = sessionStorage.getItem('userName');
    this.highestRank = sessionStorage.getItem('highestRank');
    this.initData();
  }

  initData() {
    this.spinner.show();
    this.loader = true;
    this.itemServiceManagementService.getAllItemServices(this.itemId).subscribe(
      (response: any) => {
        this.completedServices = response.completedServices;
        this.incompletedServices = response.inCompletedServices;
        this.spinner.hide();
        this.loader = false;
      },
      (error) => {
        this.spinner.hide();
        this.loader = false;
      }
    );
    //staticly given as this will not be changed
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

  saveItemServiceData() {
    this.index = 0;
    if (this.model.serviceDate) {
      if (this.model.complete == true) {
        if (this.model.serviceCause && this.model.actualCompletion) {
          this.addOrUpdateItemService();
        } else {
          this.index = -2;
        }
      } else {
        this.addOrUpdateItemService();
      }
    } else {
      this.index = -1;
    }
  }

  addOrUpdateItemService() {
    this.model.complete == true
      ? (this.model.completedBy = this.userName)
      : (this.model.completedBy = '');

    if (this.addFlag == true) {
      var addRequest = {
        itemId: this.itemId,
        serviceDate: this.model.serviceDate,
        serviceCause:
          this.model.serviceCause != 0
            ? this.model.serviceCause
            : this.model.newServiceCause,
        actualCompletion:
          this.model.actualCompletion != null
            ? this.model.actualCompletion
            : null,
        complete: this.model.complete ? this.model.complete : false,
        completedBy: this.model.completedBy,
        createdDate: new Date(),
        createdBy: this.userName,
        updatedDate: new Date(),
        updatedBy: this.userName,
      };
      this.spinner.show();
      this.loader = true;
      this.itemServiceManagementService.saveItemService(addRequest).subscribe(
        (response) => {
          this.spinner.hide();
          this.loader = false;
          this.index = 1;
          this.initData();
          setTimeout(() => {
            this.index = 0;
            this.modalRef.hide();
          }, 2000);
        },
        (error) => {
          this.spinner.hide();
          this.loader = false;
        }
      );
    } else {
      var updateRequest = {
        itemId: this.itemId,
        serviceDate: this.model.serviceDate,
        serviceCause:
          this.model.serviceCause != 0
            ? this.model.serviceCause
            : this.model.newServiceCause,
        actualCompletion:
          this.model.actualCompletion != null
            ? this.model.actualCompletion
            : null,
        complete: this.model.complete ? this.model.complete : false,
        completedBy: this.model.completedBy,
        createdDate: this.model.createdDate,
        createdBy: this.model.createdBy,
        updatedDate: new Date(),
        updatedBy: this.userName,
      };
      this.spinner.show();
      this.loader = true;
      this.itemServiceManagementService
        .updateItemService(updateRequest, this.model.serviceId)
        .subscribe(
          (response) => {
            this.spinner.hide();
            this.loader = false;
            this.index = 1;
            this.initData();
            setTimeout(() => {
              this.index = 0;
              this.modalRef.hide();
            }, 2000);
          },
          (error) => {
            this.spinner.hide();
            this.loader = false;
          }
        );
    }
  }

  print() {
    this.helpFlag = false;
    window.print();
  }

  help() {
    this.helpFlag = !this.helpFlag;
  }

  back() {
    this._location.back();
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

  setCompletedOrder(value: string) {
    if (this.completedOrder === value) {
      if (this.completedReverse == '') {
        this.completedReverse = '-';
      } else {
        this.completedReverse = '';
      }
    }
    this.completedOrder = value;
  }

  openModal(template: TemplateRef<any>) {
    this.addFlag = true;
    this.editFlag = false;
    this.modalRef = this.modalService.show(template, { class: 'modal-lg' });
  }

  openModalForEdit(template: TemplateRef<any>, serviceId: string) {
    this.editFlag = true;
    this.addFlag = false;
    this.spinner.show();
    this.loader = true;
    this.itemServiceManagementService.getServiceById(serviceId).subscribe(
      (response) => {
        this.model = response;
        this.model.serviceDate = new Date(this.model.serviceDate);
        if (this.model.actualCompletion)
          this.model.actualCompletion = new Date(this.model.actualCompletion);
        if (this.model.serviceCause) {
          let count = 0;
          this.serviceCauses.forEach((cause: any) => {
            if (cause == this.model.serviceCause) {
              count = count + 1;
            }
          });
          if (count == 0) {
            this.model.newServiceCause = this.model.serviceCause;
            this.model.serviceCause = 0;
          }
        }
        this.spinner.hide();
        this.loader = false;
      },
      (error) => {
        this.spinner.hide();
        this.loader = false;
      }
    );
    this.modalRef = this.modalService.show(template, { class: 'modal-lg' });
  }

  closeModel() {
    this.model = {};
    this.addFlag = false;
    this.editFlag = false;
    this.modalRef.hide();
  }

  openDeleteModal(template: TemplateRef<any>, serviceId: any) {
    this.serviceId = serviceId;
    this.deleteModalRef = this.modalService.show(template, {
      class: 'modal-lg',
    });
  }

  confirm(): void {
    this.spinner.show();
    this.loader = true;
    this.itemServiceManagementService
      .deleteItemServiceById(this.serviceId)
      .subscribe(
        (response) => {
          this.deleteModalRef.hide();
          this.initData();
        },
        (error) => {
          this.spinner.hide();
          this.loader = false;
        }
      );
  }

  decline(): void {
    this.deleteModalRef.hide();
  }

  checkValue(event: any) {
    if (event == 'A') this.model.actualCompletion = new Date();
    else if (event == 'B') this.model.actualCompletion = null;
  }
}
