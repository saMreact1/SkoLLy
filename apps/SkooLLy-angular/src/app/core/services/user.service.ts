import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
    private apiUrl = 'http://localhost:5000/users';

    private userSubject = new BehaviorSubject<any>(this.getLocalUser());
    public user$ = this.userSubject.asObservable();
    
    constructor(private http: HttpClient) {}

    getLocalUser() {
        return JSON.parse(localStorage.getItem('user') || '{}');
    }

    setLocalUser(user: any) {
        localStorage.setItem('user', JSON.stringify(user));
        this.userSubject.next(user); // 🔥 emit update to all listeners
    }
    
    getUserProfile(): Observable<any> {
        return this.http.get(`${this.apiUrl}/user`).pipe(
            tap((user: any) => {
                localStorage.setItem('user', JSON.stringify(user));
            })
        );
    }

    editUser(id: string, formData: FormData): Observable<any> {
        return this.http.put<any>(`${this.apiUrl}/edit/${id}`, formData);
    }

    getUserById(userId: string): Observable<any> {
        return this.http.get(`${this.apiUrl}/user/${userId}`);
    }

    getUsersByRole(role: string, tenantId: string) {
        return this.http.get<any[]>(`${this.apiUrl}/users?role=${role}&tenantId=${tenantId}`);
    }

    getToken() {
        return localStorage.getItem('token');
    }

    updateProfile(data: any) {
        return this.http.patch(`${this.apiUrl}/update-profile`, data, {
            headers: {
                Authorization: `Bearer ${this.getToken()}`
            }
        }).pipe(
            tap((res: any) => {
                localStorage.setItem('user', JSON.stringify(res.user)); // update local user
            })
        );
    }

    updateProfileById(userId: string, data: FormData) {
        return this.http.patch(`${this.apiUrl}/${userId}`, data);
    }

    uploadProfilePic(formData: FormData) {
        return this.http.patch<{ message: string; user: any }>(
            `${this.apiUrl}/upload-profile-pic`,
            formData
        );
    }

    get userValue() {
        return this.userSubject.value;
    }
}