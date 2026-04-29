import { Injectable } from '@angular/core';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';

const EXCEL_TYPE =
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

@Injectable()
export class ExcelService {
  constructor() {}

  public exportAsExcelFile(json: any[], excelFileName: string): void {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
    const workbook: XLSX.WorkBook = {
      Sheets: { 'Service Report': worksheet },
      SheetNames: ['Service Report'],
    };
    const excelBuffer: any = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
      compression: true,
    });
    this.saveAsExcelFile(excelBuffer, excelFileName);
  }

  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], {
      type: EXCEL_TYPE,
    });
    FileSaver.saveAs(
      data,
      fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION
    );
  }

  private chunkArray<T>(array: T[], chunkSize: number): T[][] {
    const chunks: T[][] = [];
    for (let i = 0; i < array.length; i += chunkSize) {
      chunks.push(array.slice(i, i + chunkSize));
    }
    return chunks;
  }

  private safeSheetName(sheetName: string): string {
    const cleaned = sheetName.replace(/[:\\/\\?\\*\[\]]/g, '_');
    return cleaned.substr(0, 31);
  }

  public exportAsExcelFileWithMultipleSheets(
    json: any,
    excelFileName: string,
    maxRowsPerSheet: number = 10000
  ): void {
    const workbook: XLSX.WorkBook = XLSX.utils.book_new();

    Object.keys(json).forEach((sheetName) => {
      const sheetData = json[sheetName];
      if (!Array.isArray(sheetData)) {
        const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(sheetData);
        XLSX.utils.book_append_sheet(workbook, worksheet, this.safeSheetName(sheetName));
        return;
      }

      const chunks = this.chunkArray(sheetData, maxRowsPerSheet);
      chunks.forEach((chunk, index) => {
        const chunkSheetName = chunks.length > 1 ? `${sheetName}_${index + 1}` : sheetName;
        const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(chunk);
        XLSX.utils.book_append_sheet(workbook, worksheet, this.safeSheetName(chunkSheetName));
      });
    });

    const excelBuffer: any = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
      compression: true,
    });

    this.saveAsExcelFile(excelBuffer, excelFileName);
  }
}
