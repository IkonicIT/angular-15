import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpHeaders,
} from '@angular/common/http';
import { Observable } from 'rxjs';
export class AuthInterceptor implements HttpInterceptor {
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    var authReq: any;
    if (req.url.indexOf('oauth/token') > -1) {
      authReq = req.clone({});
    } else if (
      req.url.endsWith('attachment') ||
      req.url.search('companyImage') != null
    ) {
      authReq = req.clone({
        headers: req.headers.set(
          'authorization',
          `Bearer ${sessionStorage.getItem('auth_token')}`
        ),
      });
    } else {
      authReq = req.clone({
        headers: req.headers
          .set(
            'authorization',
            `Bearer ${sessionStorage.getItem('auth_token')}`
          )
          .set('content-type', 'application/json'),
      });
    }
    return next.handle(authReq);
  }
}
