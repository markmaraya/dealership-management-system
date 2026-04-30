import { environment } from '../environments/environment';
import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
  HttpParams,
  HttpRequest,
} from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { Units } from './models/units';
import { Expenses } from './models/expenses';
import { Gallery } from './models/gallery';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};
// const apiUrl = 'http://localhost:4000/api';
const apiUrl = 'api';
const galleryUrl = `${environment.apiUrl}/gallery`;

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private http: HttpClient) {
    console.log('API Service');
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      return of(result as T);
    };
  }

  private handleGalleryError(error: HttpErrorResponse): any {
    if (error.error instanceof ErrorEvent) {
      console.error('An error occurred:', error.error.message);
    } else {
      console.error(
        `Backend returned code ${error.status}, ` + `body was: ${error.error}`,
      );
    }
    return throwError('Something bad happened; please try again later.');
  }

  // Units

  getUnits(): Observable<Units[]> {
    console.log('API Get Units');
    return this.http.get<Units[]>(`${apiUrl}/units`).pipe(
      tap((units) => console.log('Fetched Units')),
      catchError(this.handleError('getUnits', [])),
    );
  }

  getUnitsById(id: string, imgId?: string): Observable<Units> {
    let url = `${apiUrl}/units/${id}`;

    if (imgId) {
      url += `?imgId=${imgId}`;
    }

    return this.http.get<Units>(url).pipe(
      tap((_) => console.log(`Fetched Units id=${id}`)),
      catchError(this.handleError<Units>(`getUnitsById id=${id}`)),
    );
  }

  getUnitsByUnitCode(unitCode: string): Observable<Units> {
    const url = `${apiUrl}/unitCode/${unitCode}`;
    return this.http.get<Units>(url).pipe(
      tap((_) => console.log(`Fetched Unit unitCode=${unitCode}`)),
      catchError(
        this.handleError<Units>(`getUnitsByUnitCode unitCode=${unitCode}`),
      ),
    );
  }

  addUnits(units: Units): Observable<Units> {
    return this.http.post<Units>(apiUrl, units, httpOptions).pipe(
      tap((s: Units) => console.log(`Added Units w/ id=${s.id}`)),
      catchError(this.handleError<Units>('addUnits')),
    );
  }

  updateUnits(id: string, units: Units): Observable<any> {
    const url = `${apiUrl}/${id}`;
    return this.http.put(url, units, httpOptions).pipe(
      tap((_) => console.log(`Updated Units id=${id}`)),
      catchError(this.handleError<any>('updateUnits')),
    );
  }

  deleteUnits(id: string): Observable<Units> {
    const url = `${apiUrl}/${id}`;
    return this.http.delete<Units>(url, httpOptions).pipe(
      tap((_) => console.log(`Deleted Units id=${id}`)),
      catchError(this.handleError<Units>('deleteUnits')),
    );
  }

  // Expenses

  getExpensesByUnitCode(unitCode: string): Observable<Expenses[]> {
    const url = `${apiUrl}/expenses?unitCode=${unitCode}`;
    return this.http.get<Expenses[]>(url).pipe(
      tap((_) => console.log(`Fetched Expenses unitCode=${unitCode}`)),
      catchError(
        this.handleError<Expenses[]>(
          `getExpensesByUnitCode unitCode=${unitCode}`,
        ),
      ),
    );
  }

  getExpensesById(id: string): Observable<Expenses> {
    const url = `${apiUrl}/expenses/${id}`;
    return this.http.get<Expenses>(url).pipe(
      tap((_) => console.log(`Fetched Expenses id=${id}`)),
      catchError(this.handleError<Expenses>(`getExpensesById id=${id}`)),
    );
  }

  addExpenses(expenses: Expenses): Observable<Expenses> {
    const url = `${apiUrl}/expenses`;
    return this.http.post<Expenses>(url, expenses, httpOptions).pipe(
      tap((s: Expenses) => console.log(`Added Expenses w/ id=${s.id}`)),
      catchError(this.handleError<Expenses>('addExpenses')),
    );
  }

  updateExpenses(id: string, expenses: Expenses): Observable<any> {
    const url = `${apiUrl}/expenses/${id}`;
    return this.http.put(url, expenses, httpOptions).pipe(
      tap((_) => console.log(`Updated Expenses id=${id}`)),
      catchError(this.handleError<any>('updateExpenses')),
    );
  }

  deleteExpenses(id: string): Observable<Expenses> {
    const url = `${apiUrl}/expenses/${id}`;
    return this.http.delete<Expenses>(url, httpOptions).pipe(
      tap((_) => console.log(`Deleted Expenses id=${id}`)),
      catchError(this.handleError<Expenses>('deleteExpenses')),
    );
  }

  // Gallery

  getGalleryById(id: string): Observable<any> {
    const url = `${galleryUrl}/${id}`;
    return this.http
      .get<Gallery>(url)
      .pipe(catchError(this.handleGalleryError));
  }

  addGallery(gallery: Gallery, file: File, id: string): Observable<any> {
    const url = `${galleryUrl}`;
    const formData = new FormData();
    formData.append('file', file);
    formData.append('unitCode', id);
    const header = new HttpHeaders();
    const params = new HttpParams();

    const options = {
      params,
      reportProgress: true,
      headers: header,
    };
    const req = new HttpRequest('POST', url, formData, options);
    return this.http.request(req);
  }
}
