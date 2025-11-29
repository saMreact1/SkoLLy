import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private baseUrl = 'http://localhost:5000/admin';

  constructor(private http: HttpClient) {}

  getOverview(): Observable<any> {
    return this.http.get(`${this.baseUrl}/overview`);
  }

  getClassCount(): Observable<any> {
    return this.http.get(`${this.baseUrl}/class-count`);
  }

  getStudentsByClass(): Observable<any> {
    return this.http.get(`${this.baseUrl}/students-by-class`);
  }

  getGenderDistribution(): Observable<any> {
    return this.http.get(`${this.baseUrl}/gender-distribution`);
  }

  // getWeeklyAttendance() {
  //   return this.http.get<{ labels: string[], data: number[] }>('/stats/weekly-attendance');
  // }
}
