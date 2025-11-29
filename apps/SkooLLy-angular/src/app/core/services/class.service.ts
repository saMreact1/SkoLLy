import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ClassModel {
  _id?: string;
  name: string;
  tenantId?: string;
  schoolName?: string;
  assignedTeacher?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ClassService {
  private apiUrl = 'http://localhost:5000/classes';

  constructor(private http: HttpClient) {}

  // 🔹 Get all classes for logged-in user (protected route)
  getClasses(): Observable<ClassModel[]> {
    return this.http.get<ClassModel[]>(this.apiUrl);
  }

  // 🔹 Create a new class
  createClass(newClass: ClassModel): Observable<ClassModel> {
    return this.http.post<ClassModel>(this.apiUrl, newClass);
  }

  deleteClass(classId: string) {
    return this.http.delete(`${this.apiUrl}/${classId}`);
  }

// 🔹 Get classes by school name (public route)
  getClassesByTenant(tenantId: string): Observable<any[]> {
    const token = localStorage.getItem('token');
    return this.http.get<any[]>(
      `${this.apiUrl}/school/${tenantId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
  }

  getStudents(classId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${classId}/students`);
  }

  assignTeacher(classId: string, teacherId: string): Observable<ClassModel> {
    return this.http.put<ClassModel>(`${this.apiUrl}/${classId}/assign-teacher`, { teacherId });
  }
}
