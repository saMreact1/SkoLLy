import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class StudentService {
    private apiUrl = 'http://localhost:5000/students';

    constructor(private http: HttpClient) {}

    getStudents(): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}`);
    }

    addStudent(studentData: any): Observable<any> {
        return this.http.post(this.apiUrl, studentData);
    }
}
