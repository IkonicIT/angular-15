import { Injectable, Inject } from '@angular/core';
import { AppConfiguration } from '../../configuration';
import { HttpHeaders } from '@angular/common/http';
import { SESSION_STORAGE, StorageService } from 'ngx-webstorage-service';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { HttpParams } from '@angular/common/http';

@Injectable()
export class ItemAttachmentsService {
  public serviceURL = AppConfiguration.typeStatusRestURL + 'attachment';
  public serviceLocationURL = AppConfiguration.locationRestURL;
  public isProd = false;
  private authToken = sessionStorage.getItem('auth_token')
    ? sessionStorage.getItem('auth_token')
    : '';
  private httpOptions = {
    headers: new HttpHeaders({
      Authorization: 'Bearer  ' + this.authToken,
    }),
  };

  constructor(
    @Inject(SESSION_STORAGE) private storage: StorageService,
    private http: HttpClient
  ) {}

  saveItemDocument(document: any) {
    return this.http
      .post(this.serviceURL, document, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  updateItemDocument(company: { attachmentId: string }) {
    return this.http
      .put(
        this.serviceURL + '/' + company.attachmentId,
        company,
        this.httpOptions
      )
      .pipe(catchError(this.handleError));
  }

  updateItemDefaultImage(itemId: string, attachmentId: any) {
    return this.http
      .get(
        this.serviceLocationURL + 'item/' + itemId + '/' + attachmentId,
        this.httpOptions
      )
      .pipe(catchError(this.handleError));
  }

  getItemDocuments(attachmentId: number) {
    return this.http
      .get(this.serviceURL + '/' + attachmentId, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  getAllItemDocuments(itemId: string) {
    return this.http
      .get(
        this.serviceURL + '/getAllAttachments/itemtype/' + itemId,
        this.httpOptions
      )
      .pipe(catchError(this.handleError));
  }
  getAllItemPictures(itemId: string) {
    return this.http
      .get(
        this.serviceURL +
          '/getAllAttachments/itemtype/' +
          itemId +
          '/' +
          itemId,
        this.httpOptions
      )
      .pipe(catchError(this.handleError));
  }

  getAllItemNoteDocuments(noteId: string) {
    return this.http
      .get(
        this.serviceURL + '/getAllAttachments/itemnotetype/' + noteId,
        this.httpOptions
      )
      .pipe(catchError(this.handleError));
  }

  removeItemDocuments(
    attachmentId: string,
    companyId: string,
    userName: string,
    userLog: {
      itemTag: string | number | boolean;
      itemTypeName: string | number | boolean;
    }
  ) {
    let params = new HttpParams();
    params = params.append('itemTag', userLog.itemTag);
    params = params.append('itemTypeName', userLog.itemTypeName);
    var httpOptions = {
      headers: new HttpHeaders({
        Authorization: 'Bearer  ' + this.authToken,
      }),
      params: params,
    };

    return this.http
      .delete(
        this.serviceURL + '/' + attachmentId + '/' + companyId + '/' + userName,
        httpOptions
      )
      .pipe(catchError(this.handleError));
  }

  removeItemNoteDocuments(
    attachmentId: string,
    companyId: any,
    userName: string,
    userLog: {
      itemTag: string | number | boolean;
      itemTypeName: string | number | boolean;
      noteType: string | number | boolean;
      noteName: string | number | boolean;
    }
  ) {
    let params = new HttpParams();
    params = params.append('itemTag', userLog.itemTag);
    params = params.append('itemTypeName', userLog.itemTypeName);
    params = params.append('noteType', userLog.noteType);
    params = params.append('noteName', userLog.noteName);
    var httpOptions = {
      headers: new HttpHeaders({
        Authorization: 'Bearer  ' + this.authToken,
      }),
      params: params,
    };

    return this.http
      .delete(
        this.serviceURL + '/' + attachmentId + '/' + companyId + '/' + userName,
        httpOptions
      )
      .pipe(catchError(this.handleError));
  }

  removeItemRepairDocuments(
    attachmentId: string,
    companyId: number,
    userName: string,
    userLog: {
      itemTag: string | number | boolean;
      itemTypeName: string | number | boolean;
      poNumber: string | number | boolean;
      jobNumber: string | number | boolean;
    }
  ) {
    let params = new HttpParams();
    params = params.append('itemTag', userLog.itemTag);
    params = params.append('itemTypeName', userLog.itemTypeName);
    params = params.append('poNumber', userLog.poNumber);
    params = params.append('jobNumber', userLog.jobNumber);
    var httpOptions = {
      headers: new HttpHeaders({
        Authorization: 'Bearer  ' + this.authToken,
      }),
      params: params,
    };

    return this.http
      .delete(
        this.serviceURL + '/' + attachmentId + '/' + companyId + '/' + userName,
        httpOptions
      )
      .pipe(catchError(this.handleError));
  }

  saveItemMultipleDocuments(attachList: any) {
    return this.http
      .post(
        this.serviceURL + '/createMultipleAttachments',
        attachList,
        this.httpOptions
      )
      .pipe(catchError(this.handleError));
  }

  private handleError(error: any) {
    if (error.error instanceof ErrorEvent) {
      console.error('An error occurred:', error.error.message);
    } else {
      console.error(
        `Backend returned code ${error.status}, ` + `body was: ${error.error}`
      );
    }
    return throwError(() => 'Something bad happened; please try again later.');
  }

  b64toBlob(b64Data: string, contentType: string) {
    contentType = contentType || '';
    var sliceSize = 512;

    var byteCharacters = atob(b64Data);
    var byteArrays = [];

    for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      var slice = byteCharacters.slice(offset, offset + sliceSize);

      var byteNumbers = new Array(slice.length);
      for (var i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      var byteArray = new Uint8Array(byteNumbers);

      byteArrays.push(byteArray);
    }

    var blob = new Blob(byteArrays, { type: contentType });
    return blob;
  }

  getOrientation(file: string | any[], callback: (arg0: number) => any) {
    var reader: any, target: EventTarget;
    reader = new FileReader();
    reader.onload = (event: { target: { result: ArrayBufferLike } }) => {
      var view = new DataView(event.target.result);

      if (view.getUint16(0, false) != 0xffd8) return callback(-2);

      var length = view.byteLength,
        offset = 2;

      while (offset < length) {
        var marker = view.getUint16(offset, false);
        offset += 2;

        if (marker == 0xffe1) {
          if (view.getUint32((offset += 2), false) != 0x45786966) {
            return callback(-1);
          }
          var little = view.getUint16((offset += 6), false) == 0x4949;
          offset += view.getUint32(offset + 4, little);
          var tags = view.getUint16(offset, little);
          offset += 2;

          for (var i = 0; i < tags; i++)
            if (view.getUint16(offset + i * 12, little) == 0x0112)
              return callback(view.getUint16(offset + i * 12 + 8, little));
        } else if ((marker & 0xff00) != 0xff00) break;
        else offset += view.getUint16(offset, false);
      }
      return callback(-1);
    };

    reader.readAsArrayBuffer(file.slice(0, 64 * 1024));
  }

  resetOrientation(
    srcBase64: string,
    srcOrientation: number,
    callback: (arg0: string) => void
  ) {
    var img = new Image();
    img.src = srcBase64;
    img.onload = () => {
      var width = img.width,
        height = img.height,
        canvas = document.createElement('canvas'),
        ctx: any = canvas.getContext('2d');

      // set proper canvas dimensions before transform & export
      if (4 < srcOrientation && srcOrientation < 9) {
        canvas.width = height;
        canvas.height = width;
      } else {
        canvas.width = width;
        canvas.height = height;
      }

      // transform context before drawing image
      switch (srcOrientation) {
        case 2:
          ctx.transform(-1, 0, 0, 1, width, 0);
          break;
        case 3:
          ctx.transform(-1, 0, 0, -1, width, height);
          break;
        case 4:
          ctx.transform(1, 0, 0, -1, 0, height);
          break;
        case 5:
          ctx.transform(0, 1, 1, 0, 0, 0);
          break;
        case 6:
          ctx.transform(0, 1, -1, 0, height, 0);
          break;
        case 7:
          ctx.transform(0, -1, -1, 0, height, width);
          break;
        case 8:
          ctx.transform(0, -1, 1, 0, 0, width);
          break;
        default:
          break;
      }

      // draw image
      ctx.drawImage(img, 0, 0);

      // export base64
      callback(canvas.toDataURL());
    };
  }
}
