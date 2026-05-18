import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NgxSpinnerService } from 'ngx-spinner';
import { TreeviewItem } from 'ngx-treeview';
import { BroadcasterService } from 'src/app/services/broadcaster.service'; 
import { VendorExcelService } from 'src/app/services/vendor-excel.service'; 
import { Company } from '../../../models/company';
import { HttpClient , HttpParams} from '@angular/common/http';
import { AppConfiguration } from 'src/app/configuration';
import {
  CompanyDocumentsService,
  CompanyManagementService,
} from '../../../services/index';

@Component({
  selector: 'app-vendor-dashboard',
  templateUrl: './vendor-dashboard.component.html',
  styleUrls: ['./vendor-dashboard.component.scss'],
})
export class VendorDashBoardComponent implements OnInit {
  modalRef: BsModalRef;
  modalRef2: BsModalRef;
  itemMMS: boolean = false;
  message: string;
  vendors: any;
  index: number = 0;
  order: string = 'name';
  reverse: string = '';
  vendorFilter: any = '';
  itemsForPagination: any = 5;
  globalCompany: any;
  companyName: any;
  companyId: any;
  currentRole: any;
  highestRank: any;
  helpFlag: any = false;
  vendorRepairs: any;
  vendorId: any;
  vendorNumber : any;
  companies: any;
  companyList: any;
  authToken: any;
  locations: TreeviewItem[];
  allLocations: any;
  locationId: any;
  vendorItems: TreeviewItem[]; 
  constructor(
    private modalService: BsModalService,
    private companyManagementService: CompanyManagementService,
    private companyDocumentsService: CompanyDocumentsService,
    private broadcasterService: BroadcasterService,
    sanitizer: DomSanitizer,
    private spinner: NgxSpinnerService,
    private http: HttpClient,
    private excelService: VendorExcelService
  ) {
    this.globalCompany = this.companyManagementService.getGlobalCompany();
    this.companyName = this.globalCompany.name;
    this.companyId = this.globalCompany.companyId;
    const itemMMSValue = sessionStorage.getItem('itemMMS');
    this.itemMMS = itemMMSValue === 'true' || itemMMSValue === '1';
    this.companyManagementService.globalCompanyChange.subscribe((value) => {
      this.globalCompany = value;
      this.companyName = value.name;
      this.companyId = value.companyId;
    });
    this.authToken = sessionStorage.getItem('auth_token');
    this.getLocationsWithHierarchy();
  }

  ngOnInit() {
    this.currentRole = sessionStorage.getItem('currentRole');
    this.highestRank = sessionStorage.getItem('highestRank');
    
    if(this.itemMMS)
    {
      this.spinner.show();
    this.http.get(AppConfiguration.locationRestURL + `mms/getMmsVendors/${this.companyId}`).subscribe(
      (response) => {
        this.spinner.hide();
        this.vendors = response;
        this.vendorItems = this.convertVendorsToTreeviewItems(this.vendors);
      },
      (error) => {
        this.spinner.hide();
        console.error('Error loading vendors:', error);
      }
    );
    }
    else
    {
    this.loadVendors();
    }
  }

  loadVendors() {
    this.spinner.show();
    this.companyManagementService.getAllVendorDetails().subscribe(
      (response) => {
        this.spinner.hide();
        this.vendors = response;
        this.vendorItems = this.convertVendorsToTreeviewItems(this.vendors);
      },
      (error) => {
        this.spinner.hide();
        console.error('Error loading vendors:', error);
      }
    );
  }

  convertVendorsToTreeviewItems(vendors: any[]): TreeviewItem[] {
    return vendors.map((vendor) => {
      const vendorName = this.getTrimmedValue(vendor.name || vendor.vendorName);
      const vendorAbbr = this.getTrimmedValue(vendor.vendorAbbr);
      const vendorValue = vendor.vendorId || vendor.vendorNumber;

      return new TreeviewItem({
        text: vendorName || vendorAbbr || `Vendor ${vendorValue}`,
        value: vendorValue != null ? vendorValue.toString() : vendorValue,
        collapsed: true,
        children: [],
      });
    });
  }

  private getTrimmedValue(value: any): string {
    return value != null ? value.toString().trim() : '';
  }

  onVendorChange(value: any) {
    this.vendorId = value;
    this.vendorNumber = value;

  }

  getLocationsWithHierarchy() {
    this.allLocations = this.broadcasterService.locations;
    if (this.allLocations && this.allLocations.length > 0) {
      this.locations = [];
      this.locations = this.generateHierarchy(this.allLocations);
    }
  }

  setLocation(locid: any) {
    this.locationId = locid;
  }

  generateHierarchy(locList: any[]) {
    var items: any[] = [];
    locList.forEach((loc) => {
      var children: any[] = []; 
      if (
        loc.parentResourceList &&
        loc.parentResourceList.length > 0
      ) {
        children = this.generateHierarchy(loc.parentResourceList);
      }
      items.push(
        new TreeviewItem({
          text: loc.name,
          value: loc.locationId,
          collapsed: true,
          children: children,
        })
      );
    });
    return items;
  }

  getVendorData() {
    const selectedVendorId =
      this.vendorNumber != null ? this.vendorNumber : this.vendorId;

    var request = {
      companyId: this.companyId != null ? this.companyId : 0,
      locationId: this.locationId != null ? this.locationId : 0,
      vendorId: selectedVendorId != null ? selectedVendorId : null,
    };
    this.spinner.show();
    this.companyManagementService.getAllVendorRepairs(request).subscribe(
      (response) => {
        this.spinner.hide();
        this.vendorRepairs = response;
        this.companies = Object.keys(this.vendorRepairs);
        this.index = 1;
      },
      (error) => {
        this.spinner.hide();
      }
    );
  }

  downloadDocuments(companyDocument: any, flag: boolean) {
    if (companyDocument.isNew === 0 || companyDocument.isNew === false) {
      this.downloadFile(companyDocument, flag);
    } else {
      this.downloadDocumentFromDB(companyDocument, flag);
    }
  }

  downloadDocumentFromDB(document: any, flag: boolean) {
    var attachmentId;
    if (flag) {
      attachmentId = document.attachmentId;
    } else {
      attachmentId = document.attachmentId;
    }
    this.spinner.show();
    this.companyDocumentsService.getCompanyDocuments(attachmentId).subscribe(
      (response) => {
        this.spinner.hide();
        this.downloadDocument(response);
      },
      (error) => {
        this.spinner.hide();
      }
    );
  }

  downloadDocument(companyDocument: any) {
    var blob = this.companyDocumentsService.b64toBlob(
      companyDocument.attachmentFile,
      companyDocument.contentType
    );
    var fileURL = URL.createObjectURL(blob);
    window.open(fileURL);
  }

  downloadFile(attachment: any, flag: boolean) {
    let index;
    let extension;
    let attachmentId;
    if (flag) {
      index = attachment.fileName.lastIndexOf('.');
      extension = attachment.fileName.slice(index + 1);
      attachmentId = attachment.attachmentId;
    } else if (flag == false) {
      index = attachment.fileName.lastIndexOf('.');
      extension = attachment.fileName.slice(index + 1);
      attachmentId = attachment.attachmentId;
    }

    if (extension.toLowerCase() == 'pdf' || extension.toLowerCase() == 'txt') {
      var wnd = window.open('about:blank');
      if (wnd) {
        var pdfStr = `<div style="text-align:center">
        <h4>Document Viewer</h4>
        <iframe src="https://gotracrat.com:8088/api/attachment/downloadaudiofile/${
          attachmentId + '?access_token=' + this.authToken
        }&embedded=true" style="width:100%;height:100%;border:none;"></iframe>
        </div>`;
        wnd.document.write(pdfStr);
      } else {
        console.error('Failed to open a new window.');
      }
    } else if (
      extension.toLowerCase() == 'jpg' ||
      extension.toLowerCase() == 'png' ||
      extension.toLowerCase() == 'jpeg' ||
      extension.toLowerCase() == 'gif'
    ) {
      var pdfStr = `<div style="text-align:center">
    <h4>Image Viewer</h4>
    <img src="https://gotracrat.com:8088/api/attachment/downloadaudiofile/${
      attachmentId + '?access_token=' + this.authToken
    }&embedded=true" >
      </div>`;
      var wnd = window.open('about:blank');
      if (wnd) {
        wnd.document.write(pdfStr);
      } else {
        console.error('Failed to open a new window.');
      }
    } else {
      window.open(
        'https://gotracrat.com:8088/api/attachment/downloadaudiofile/' +
          attachmentId +
          '?access_token=' +
          this.authToken
      );
    }
  }

  exportAsExcelFileWithMultipleSheets(): void {
    this.excelService.exportToExcel(this.vendorRepairs, 'exported_data');
  }
}
