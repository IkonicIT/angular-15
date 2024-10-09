// excel.service.ts

import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';

@Injectable()
export class VendorExcelService {
  constructor() {}

  exportToExcel(data: any, filename: string): void {
    const workbook: XLSX.WorkBook = { Sheets: {}, SheetNames: [] };

    // Iterate over each company's data and create a sheet for each
    for (const companyName in data) {
      if (data.hasOwnProperty(companyName)) {
        const companyData = data[companyName];

        // Flatten data and include attribute values
        const flattenedData = this.flattenData(companyData);
        workbook.SheetNames.push(companyName);
        workbook.Sheets[companyName] = XLSX.utils.json_to_sheet(flattenedData);
      }
    }

    const excelBuffer: any = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });
    this.saveAsExcelFile(excelBuffer, filename);
  }

  private flattenData(data: any[]): any[] {
    const flattenedData: any[] = []; // Explicitly define the type
    data.forEach((item) => {
      const flatItem = {
        jobNumber: item.jobNumber,
        tag: item.tag,
        dateReceived: item.dateReceived,
        rfqNumber: item.rfqNumber,
        poNumber: item.poNumber,
        estimatedShipDate: item.estimatedShipDate,
        completed: item.completed,
        attributeValues: this.concatenateAttributes(item.attributeValues), // Include attribute values
      };
      flattenedData.push(flatItem);
    });
    return flattenedData;
  }

  private concatenateAttributes(attributeValues: any[]): string {
    return attributeValues
      .map((attr) => `${attr.name}: ${attr.value}`)
      .join(', ');
  }

  private saveAsExcelFile(buffer: any, filename: string): void {
    const data: Blob = new Blob([buffer], { type: 'application/octet-stream' });
    const url: string = window.URL.createObjectURL(data);
    const a: HTMLAnchorElement = document.createElement('a');
    document.body.appendChild(a);
    a.href = url;
    a.download = filename + '.xlsx';
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }
}
