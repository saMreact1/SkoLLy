import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TimetableClass } from '../models/timetable.model';

@Injectable({ providedIn: 'root' })
export class TimetableService {
  private baseUrl = 'http://localhost:5000/timetable';

  constructor(private http: HttpClient) {}

  getTimetable(classId: string) {
    return this.http.get<{ data: Record<string, any[]> }>(`${this.baseUrl}/${classId}`);
  }

  saveTimetable(classId: string, grid: Record<string, any[]>) {
    return this.http.post(`${this.baseUrl}`, { classId, grid });
  }

  addRow(classId: string, time: string) {
    return this.http.post<any>(`${this.baseUrl}/add-row`, { classId, time });
  }
}
