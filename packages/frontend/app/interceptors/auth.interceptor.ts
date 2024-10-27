import { inject } from "@angular/core";
import { HttpEvent, HttpHandler, HttpHandlerFn, HttpInterceptorFn, HttpRequest } from "@angular/common/http";
import { SessionService } from "../services/session.service";
import { Observable } from "rxjs";

export const authInterceptor: HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandlerFn): Observable<HttpEvent<any>> => {
  const sessionService = inject(SessionService);

  if (sessionService.isAuthenticated()) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${sessionService.getToken()}`,
      },
    });
  }

  return next(req);
};
