import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Notice } from '../models/notice.model';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class NoticeService {
  private baseUrl = 'http://localhost:5000/notices';

  private noticesSubject = new BehaviorSubject<Notice[]>([]);
  public notices$ = this.noticesSubject.asObservable();

  constructor(private http: HttpClient) {}

  getNotice() {
    return this.http.get<Notice[]>(this.baseUrl).subscribe((data) => {
        this.noticesSubject.next(data)
    });
  }

  createNotice(notice: Partial<Notice>): Observable<Notice> {
    return this.http.post<Notice>(this.baseUrl, notice);
  }

  deleteNotice(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }

  updateNotice(id: string, updated: Partial<Notice>): Observable<Notice> {
    return this.http.put<Notice>(`${this.baseUrl}/${id}`, updated);
  }
}
