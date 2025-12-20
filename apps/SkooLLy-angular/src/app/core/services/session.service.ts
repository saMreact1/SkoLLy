// import { Injectable } from '@angular/core';
// import { HttpClient, HttpHeaders } from '@angular/common/http';
// import { Observable } from 'rxjs';
// import { environment } from '../../../environments/environment';

// export interface CreateTermRequest {
//   name: string;
//   startDate: string;
//   endDate: string;
//   sessionId: string;
// }

// export interface CloseSessionRequest {
//   sessionId: string;
// }

// export interface SessionResponse {
//   message: string;
//   session: {
//     _id: string;
//     sessionName: string;
//     startYear: number;
//     endYear: number;
//     schoolName: string;
//     schoolId: string;
//     isActive: boolean;
//     terms: any[];
//   };
// }

// export interface TermResponse {
//   message: string;
//   term: {
//     _id: string;
//     name: string;
//     startDate: string;
//     endDate: string;
//     session: string;
//     isActive: boolean;
//   };
//   session: any;
// }

// export interface CurrentSessionResponse {
//   session: string;
//   startYear: number;
//   endYear: number;
// }

// export interface CurrentTermResponse {
//   term: string;
//   startDate: string;
//   endDate: string;
//   session: string;
// }

// @Injectable({
//   providedIn: 'root'
// })
// export class SessionService {
//   private apiUrl = `${environment.apiUrl}/admin`;

//   constructor(private http: HttpClient) {}

//   createSession(): Observable<SessionResponse> {
//     return this.http.post<SessionResponse>(
//       `${this.apiUrl}/create-session`,
//       {}
//     );
//   }

//   getCurrentSession(): Observable<CurrentSessionResponse> {
//     return this.http.get<CurrentSessionResponse>(
//       `${this.apiUrl}/current-session`
//     );
//   }

//   closeSession(sessionId: string): Observable<SessionResponse> {
//     return this.http.post<SessionResponse>(
//       `${this.apiUrl}/close-session`,
//       { sessionId }
//     );
//   }

//   createTerm(termData: CreateTermRequest): Observable<TermResponse> {
//     return this.http.post<TermResponse>(
//       `${this.apiUrl}/create-term`,
//       termData
//     );
//   }

//   getCurrentTerm(): Observable<CurrentTermResponse> {
//     return this.http.get<CurrentTermResponse>(
//       `${this.apiUrl}/current-term`
//     );
//   }

//   formatDateForBackend(date: Date | string): string {
//     if (!date) return '';
//     const d = new Date(date);
//     const year = d.getFullYear();
//     const month = String(d.getMonth() + 1).padStart(2, '0');
//     const day = String(d.getDate()).padStart(2, '0');
//     return `${year}-${month}-${day}`;
//   }

//   formatDateForDisplay(date: Date | string): string {
//     if (!date) return 'N/A';
//     return new Date(date).toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'long',
//       day: 'numeric'
//     });
//   }
// }

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';


export interface CreateTermRequest {
  name: string;
  startDate: string;
  endDate: string;
  sessionId: string;
}

export interface CloseSessionRequest {
  sessionId: string;
}

export interface Session {
  _id: string;
  sessionName: string;
  startYear: number;
  endYear: number;
  schoolName: string;
  schoolId: string;
  isActive: boolean;
  terms: Term[];
  createdAt?: string;
}

export interface Term {
  _id: string;
  name: string;
  startDate: string;
  endDate: string;
  session: string;
  isActive: boolean;
}

export interface SessionResponse {
  message: string;
  session: Session;
}

export interface TermResponse {
  message: string;
  term: Term;
  session: Session;
}

export interface CurrentSessionResponse {
  session: string;
  startYear: number;
  endYear: number;
}

export interface CurrentTermResponse {
  term: string;
  startDate: string;
  endDate: string;
  session: string;
}

export interface SessionsListResponse {
  sessions: Session[];
}

export interface TermsListResponse {
  terms: Term[];
}

@Injectable({
  providedIn: 'root'
})
export class SessionService {
  private sessionsUrl = `${environment.apiUrl}/sessions`;
  private termsUrl = `${environment.apiUrl}/terms`;

  constructor(private http: HttpClient) {}

  createSession(): Observable<SessionResponse> {
    return this.http.post<SessionResponse>(`${this.sessionsUrl}/create-session`, {});
  }

  getCurrentSession(): Observable<CurrentSessionResponse> {
    return this.http.get<CurrentSessionResponse>(
      `${this.sessionsUrl}/current-session`
    );
  }

  getAllSessions(): Observable<Session[]> {
    return this.http.get<Session[]>(this.sessionsUrl);
  }

  closeSession(sessionId: string): Observable<SessionResponse> {
    return this.http.patch<SessionResponse>(
      `${this.sessionsUrl}/close`,
      { sessionId }
    );
  }

  createTerm(termData: CreateTermRequest): Observable<TermResponse> {
    return this.http.post<TermResponse>(this.termsUrl, termData);
  }

  updateTerm(sessionId: string, termId: string, termData: { startDate: string; endDate: string }): Observable<TermResponse> {
    return this.http.put<TermResponse>(
      `${this.termsUrl}/${sessionId}`,
      { 
        termId,
        startDate: termData.startDate,
        endDate: termData.endDate
      }
    );
  }

  getCurrentTerm(): Observable<CurrentTermResponse> {
    return this.http.get<CurrentTermResponse>(
      `${this.termsUrl}/current`
    );
  }

  getTermsBySession(sessionId: string): Observable<TermsListResponse> {
    return this.http.get<TermsListResponse>(
      `${this.termsUrl}/${sessionId}`
    );
  }

  getCurrentSessionWithTerms(): Observable<Session> {
    return this.http.get<Session>(
      `${this.sessionsUrl}/current-session-with-terms`
    );
  }

  formatDateForBackend(date: Date | string): string {
    if (!date) return '';
    const d = new Date(date);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(
      d.getDate()
    ).padStart(2, '0')}`;
  }

  formatDateForDisplay(date: Date | string): string {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
}
