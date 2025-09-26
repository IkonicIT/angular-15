import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { BroadcasterService } from '../../../services/broadcaster.service';
import {
  CompanyDocumentsService,
  ItemAttachmentsService,
  CompanyManagementService,
} from '../../../services/index';

@Component({
  selector: 'app-add-item-repair-attachments',
  templateUrl: './add-item-repair-attachments.component.html',
  styleUrls: ['./add-item-repair-attachments.component.scss'],
})
export class AddItemRepairAttachmentsComponent implements OnInit {
  model: any = {};
  index = 0;
  date = Date.now();

  companyId = 0;
  companyName = '';
  globalCompany: any;

  repairLogId!: number;
  userName!: string | null;
  itemRepair: any;

  fileContent = '';
  fileName: string | null = null;
  fileType = '';
  file!: File;

  addedfiles: Array<any> = [];
  helpFlag = false;
  dismissible = true;
  loader = false;

  constructor(
    private itemAttachmentsService: ItemAttachmentsService,
    private companyDocumentsService: CompanyDocumentsService,
    private companyManagementService: CompanyManagementService,
    private router: Router,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private broadcasterService: BroadcasterService
  ) {
    this.repairLogId = Number(this.route.snapshot.params['repairLogId']);

    this.globalCompany = this.companyManagementService.getGlobalCompany();
    if (this.globalCompany) {
      this.companyName = this.globalCompany.name;
      this.companyId = this.globalCompany.companyId;
    }
  }

  ngOnInit(): void {
    this.userName = sessionStorage.getItem('userName');
    this.itemRepair = this.broadcasterService.itemRepair;

    this.addedfiles.push({ file: '', description: '' });
  }

  saveItemRepairAttachment(): void {
    let noFileChosen = true;
    this.addedfiles.forEach((element: any) => {
      if (element.attachmentFile === undefined) {
        noFileChosen = false;
      }
    });

    if (!noFileChosen) {
      this.index = -1;
      window.scroll(0, 0);
      return;
    }

    const formdata: FormData = new FormData();
    if (this.file) {
      formdata.append('file', this.file);
    }
    formdata.append('addedBy', this.userName ?? '');
    formdata.append('companyId', JSON.stringify(this.companyId));
    formdata.append('description', this.model.description ?? '');
    formdata.append('entityId', JSON.stringify(this.repairLogId));
    formdata.append('moduleType', 'itemrepairtype');

    const jsonArr = [...this.addedfiles];
    for (let i = 0; i < jsonArr.length; i++) {
      delete jsonArr[i]['file'];
    }

    const req = {
      attachmentResourceList: jsonArr,
      attachmentUserLogDTO: {
        itemTag: this.itemRepair?.tag,
        itemTypeName: this.itemRepair?.itemType,
        poNumber: this.itemRepair?.poNumber,
        jobNumber: this.itemRepair?.jobNumber,
      },
    };

    this.spinner.show();

    this.itemAttachmentsService.saveItemMultipleDocuments(req).subscribe(
      () => {
        this.spinner.hide();
        window.scroll(0, 0);
        this.index = 1;
        setTimeout(() => {
          this.index = 0;
        }, 7000);

        this.router.navigate(['/items/itemRepairAttachments/' + this.repairLogId]);
      },
      () => {
        this.spinner.hide();
      }
    );
  }

  fileChangeListener(event: Event, fileIndex: number): void {
    const target = event.target as HTMLInputElement;
    this.readThis(target, fileIndex);
  }

  remove(i: number): void {
    this.addedfiles.splice(i, 1);
  }

  addNewAttachment(): void {
    this.index = 0;
    this.addedfiles.push({ file: '', description: '' });
  }

  readThis(inputValue: HTMLInputElement, fileIndex: number): void {
    if (inputValue.files && inputValue.files[0]) {
      this.file = inputValue.files[0];
      this.fileName = this.file.name;

      const myReader = new FileReader();
      myReader.readAsDataURL(this.file);
      myReader.onloadend = () => {
        const result = myReader.result as string;
        this.fileContent = result.split(',')[1] ?? '';
        this.fileType = result.split(',')[0]?.split(':')[1]?.split(';')[0] ?? '';

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
      };
    }
  }

  print(): void {
    this.helpFlag = false;
    window.print();
  }

  help(): void {
    this.helpFlag = !this.helpFlag;
  }
}
