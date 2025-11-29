import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SchoolService {
    private apiUrl = 'http://localhost:5000/schools';

    constructor(private http: HttpClient) {}

    getSchoolByName(name: string): Observable<any> {
        return this.http.get(`${this.apiUrl}/name/${name}`);
    }

    getProfile(): Observable<any> {
        return this.http.get(`${this.apiUrl}/profile`);
    }
}
