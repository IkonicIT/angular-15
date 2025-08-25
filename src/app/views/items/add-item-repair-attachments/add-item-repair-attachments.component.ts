import { Component, OnInit } from '@angular/core';
import {
  CompanyDocumentsService,
  ItemAttachmentsService,
} from '../../../services/index';
import { ActivatedRoute, Router } from '@angular/router';
import { CompanyManagementService } from '../../../services/index';
import { Company } from '../../../models';
import { NgxSpinnerService } from 'ngx-spinner';
import { BroadcasterService } from '../../../services/broadcaster.service';

@Component({
  selector: 'app-add-item-repair-attachments',
  templateUrl: './add-item-repair-attachments.component.html',
  styleUrls: ['./add-item-repair-attachments.component.scss'],
})
export class AddItemRepairAttachmentsComponent implements OnInit {
  model: any = {};
  index: number = 0;
  date = Date.now();
  companyId: number = 0;
  repairLogId: any;
  companyName: string;
  private sub: any;
  id: number;
  itemRank: any;
  router: Router;
  private fileContent: string = '';
  private fileName: any;
  public fileType: any = '';
  public file: File;
  globalCompany: any;
  userName: any;
  addedfiles: any = [];
  helpFlag: any = false;
  itemRepair: any;
  dismissible = true;
  loader = false;
  constructor(
    private itemAttachmentsService: ItemAttachmentsService,
    private companyDocumentsService: CompanyDocumentsService,
    private companyManagementService: CompanyManagementService,
    router: Router,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private broadcasterService: BroadcasterService
  ) {
    this.repairLogId = route.snapshot.params['repairlogId'];
    console.log('companyId=' + this.repairLogId);
    this.router = router;
    this.globalCompany = this.companyManagementService.getGlobalCompany();
    if (this.globalCompany) {
      this.companyName = this.globalCompany.name;
      this.companyId = this.globalCompany.companyId;
    }
  }

  ngOnInit() {
    this.userName = sessionStorage.getItem('userName');
    this.itemRepair = this.broadcasterService.itemRepair;
    this.addedfiles.push({ file: '', description: '' });
  }

  saveItemRepairAttachment() {
    var noFileChosen = true;
    var addedFiles = this.addedfiles;
    addedFiles.forEach(function (element: { attachmentFile: undefined }) {
      if (element.attachmentFile === undefined) {
        noFileChosen = false;
      }
    });
    if (!noFileChosen) {
      this.index = -1;
      window.scroll(0, 0);
    } else {
      const formdata: FormData = new FormData();
      formdata.append('file', this.file);
      formdata.append('addedBy', this.userName);
      formdata.append('companyId', JSON.stringify(this.companyId));
      formdata.append(
        'description',
        this.model.description ? this.model.description : ''
      );
      formdata.append('entityId', JSON.stringify(this.repairLogId));
      formdata.append('moduleType', 'itemrepairtype');
      var jsonArr = this.addedfiles;
      for (var i = 0; i < jsonArr.length; i++) {
        delete jsonArr[i]['file'];
      }
      this.spinner.show();

      var req = {
        attachmentResourceList: jsonArr,
        attachmentUserLogDTO: {
          itemTag: this.itemRepair.tag,
          itemTypeName: this.itemRepair.itemtype,
          poNumber: this.itemRepair.ponumber,
          jobNumber: this.itemRepair.jobnumber,
        },
      };
      this.itemAttachmentsService.saveItemMultipleDocuments(req).subscribe(
        (response) => {
          this.spinner.hide();

          window.scroll(0, 0);
          this.index = 1;
          setTimeout(() => {
            this.index = 0;
          }, 7000);
          this.router.navigate([
            '/items/itemRepairAttachments/' + this.repairLogId,
          ]);
        },
        (error) => {
          this.spinner.hide();
        }
      );
    }
  }

  fileChangeListener($event: { target: any }, fileIndex: any): void {
    this.readThis($event.target, fileIndex);
  }

  remove(i: number) {
    this.addedfiles.splice(i, 1);
  }

  addNewAttachment() {
    this.index = 0;
    this.addedfiles.push({ file: '', description: '' });
  }

  readThis(inputValue: any, fileIndex: string | number): void {
    if (inputValue.files && inputValue.files[0]) {
      this.file = inputValue.files[0];
      this.fileName = this.file.name;

      var myReader: any = new FileReader();
      myReader.readAsDataURL(this.file);
      myReader.onloadend = (e: any) => {
        this.fileContent = myReader.result.split(',')[1];
        this.fileType = myReader.result
          .split(',')[0]
          .split(':')[1]
          .split(';')[0];
        const fileInfo = this.addedfiles[fileIndex];
        fileInfo['addedBy'] = this.userName;
        fileInfo['attachmentFile'] = this.fileContent;
        fileInfo['attachmentId'] = 0;
        fileInfo['contentType'] = this.fileType;
        fileInfo['dateAdded'] = new Date().toISOString();
        fileInfo['companyId'] = this.companyId;
        fileInfo['entityId'] = this.repairLogId;
        fileInfo['isNew'] = 1;
        fileInfo['moduleType'] = 'itemrepairtype';
        fileInfo['fileName'] = this.fileName;
        console.log(this.addedfiles);
      };
    }
  }

  print() {
    this.helpFlag = false;
    window.print();
  }

  help() {
    this.helpFlag = !this.helpFlag;
  }
}
