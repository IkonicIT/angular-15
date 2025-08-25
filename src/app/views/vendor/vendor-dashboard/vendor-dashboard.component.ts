import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal'; // Ensure this import is present
import { NgxSpinnerService } from 'ngx-spinner';
import { TreeviewItem } from 'ngx-treeview';
import { BroadcasterService } from 'src/app/services/broadcaster.service'; // Updated path
import { VendorExcelService } from 'src/app/services/vendor-excel.service'; // Verify this path
import { Company } from '../../../models/company';
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
  companies: any;
  companyList: any;
  authToken: any;
  locations: TreeviewItem[]; // Define type for locations
  allLocations: any;
  locationId: any;
  vendorItems: TreeviewItem[]; // Define type for vendorItems
  constructor(
    private modalService: BsModalService,
    private companyManagementService: CompanyManagementService,
    private companyDocumentsService: CompanyDocumentsService,
    private broadcasterService: BroadcasterService,
    sanitizer: DomSanitizer,
    private spinner: NgxSpinnerService,
    private excelService: VendorExcelService
  ) {
    this.globalCompany = this.companyManagementService.getGlobalCompany();
    this.companyName = this.globalCompany.name;
    this.companyId = this.globalCompany.companyId;
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
    console.log('currentRole is' + this.currentRole);
    console.log('highestRank is' + this.highestRank);
    this.loadVendors();
  }

  loadVendors() {
    this.spinner.show();
    this.companyManagementService.getAllVendorDetails().subscribe(
      // Pass companyId as an argument
      (response) => {
        this.spinner.hide();
        this.vendors = response;
        this.vendorItems = this.convertVendorsToTreeviewItems(this.vendors);
      },
      (error) => {
        this.spinner.hide(); // Hide spinner on error
        console.error('Error loading vendors:', error);
      }
    );
  }

  convertVendorsToTreeviewItems(vendors: any[]): TreeviewItem[] {
    return vendors.map(
      (vendor) =>
        new TreeviewItem({
          text: vendor.name,
          value: vendor.vendorId,
        })
    );
  }

  onVendorChange(value: any) {
    this.vendorId = value;
    // Add any additional logic you want to perform when the vendor selection changes
  }

  getLocationsWithHierarchy() {
    this.allLocations = this.broadcasterService.locations;
    if (this.allLocations && this.allLocations.length > 0) {
      this.locations = [];
      this.locations = this.generateHierarchy(this.allLocations);
    }
  }

  setLocation(locid: any) {
    // Specify the type of locid
    this.locationId = locid;
    console.log(locid);
  }

  generateHierarchy(locList: any[]) {
    // Explicitly define the type of items
    var items: any[] = [];
    locList.forEach((loc) => {
      var children: any[] = []; // Also define children type if needed
      if (
        loc.parentLocationResourceList &&
        loc.parentLocationResourceList.length > 0
      ) {
        children = this.generateHierarchy(loc.parentLocationResourceList);
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
    var request = {
      companyId: this.companyId != null ? this.companyId : 0,
      locationId: this.locationId != null ? this.locationId : 0,
      vendorId: this.vendorId != null ? this.vendorId : null,
    };
    this.spinner.show();
    this.companyManagementService.getAllVendorRepairs(request).subscribe(
      // Changed method name
      (response) => {
        this.spinner.hide();
        console.log(response);
        this.vendorRepairs = response;
        this.companies = Object.keys(this.vendorRepairs);
        this.index = 1;
        // this.companies = this.companyList.map(companyStr => {
        //   // Extracting the name from each string using regular expressions
        //   const match = companyStr.match(/name=(.*?)(?=\))/);
        //   // Check if a match is found and return the name without quotes
        //   return match ? match[1].replace(/['"]+/g, '') : '';
        // });
        console.log(this.companies);
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
        // Check if wnd is not null
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

  //   exportAsExcelFileWithMultipleSheets()
  //   {
  // this.companies.forEach(companyName =>
  //   {
  // let results=this.vendorRepairs[companyName];
  // this.exportAsExcelFileForAcompany(results,companyName);
  //   });
  //  }

  //   exportAsExcelFileForAcompany(results,companyName) {
  //     const clonedsearchResults = cloneDeep(results);
  //     Object.keys(clonedsearchResults).forEach(itemType => {
  //       const result = clonedsearchResults[itemType];
  //       result.forEach((obj: any) => {
  //         const robj = {};
  //         if(obj.attributeValues.length > 0){
  //         obj.attributeValues.forEach((atr: any) => {
  //           robj[atr.name] = atr.value;
  //         });
  //       }

  //         delete obj.attachmentList;

  //         obj = Object.assign(obj, robj);
  //       });

  //     });
  //     this.excelService.exportAsExcelFileWithMultipleSheets(clonedsearchResults, companyName +' '+'MasterSearchResults');
  //   }
}
