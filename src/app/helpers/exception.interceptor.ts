import { HttpErrorResponse, HttpEvent, HttpResponse, HTTP_INTERCEPTORS } from "@angular/common/http";
import { Injectable } from "@angular/core";
import {
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
} from "@angular/common/http";
import { catchError, map } from 'rxjs/operators';
import { Observable, throwError } from "rxjs";
import { MatSnackBar } from "@angular/material/snack-bar";
import { AuthenticationService } from "src/authentication.service";

@Injectable()
export class ExceptionInterceptor implements HttpInterceptor {
    constructor(private _snackBar: MatSnackBar, private authService: AuthenticationService) {

    }
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(req).pipe(
            map((event: HttpEvent<any>) => {
                // do something if you want to otherwise just return the event
                return event;
            }),
            catchError((error: HttpErrorResponse) => {
                // handle all custom exceptions here, this should be a tailored message
                switch(error.error.statusCode) {
                    // nestjs exceptions
                    case 409: {
                        this._snackBar.open(error.error.message, 'Cancel', {
                            duration: 2000,
                            verticalPosition: 'top'
                        });
                        break;
                    }

                    // errors sent from class validators
                    case 400: {
                        this._snackBar.open(error.error.message, 'Cancel', {
                            duration: 2000,
                            verticalPosition: 'top'
                        });
                        // in case of some unforseen circumstances or user trying to jail break;
                        if(error.error.message === "LOGOUT") {
                            this.authService.logout();
                        }
                        break;
                    }

                    default: {
                        this._snackBar.open(error.error.message, 'Cancel', {
                            duration: 2000,
                            verticalPosition: 'top'
                        });
                    }
                }
                return throwError(error);
            }));
    }
}


export const ExceptionInterceptorProvider = [
    {
        provide: HTTP_INTERCEPTORS,
        useClass: ExceptionInterceptor,
        multi: true
    }
]