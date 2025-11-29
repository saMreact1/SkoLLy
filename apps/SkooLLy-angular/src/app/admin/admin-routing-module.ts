import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Admin } from './admin';
import { AdminGuard } from '../core/guards/admin.guard';
import { Dashboard } from './pages/dashboard/dashboard';
import { Teachers } from './pages/teachers/teachers';
import { Students } from './pages/students/students';
import { Notices } from './pages/notices/notices';
import { Classes } from './pages/classes/classes';
import { Timetable } from './pages/timetable/timetable';
import { Subjects } from './pages/subjects/subjects';
import { Results } from './pages/results/results';
import { Invoices } from './pages/invoices/invoices';
import { Transactions } from './pages/transactions/transactions';
import { Profile } from './pages/profile/profile';

const routes: Routes = [
  {
    path: '',
    component: Admin,
    canActivate: [AdminGuard],
    children: [
      { path: '', component: Dashboard },
      { path: 'teachers', component: Teachers },
      { path: 'students', component: Students },
      { path: 'notices', component: Notices },
      { path: 'classes', component: Classes },
      { path: 'timetable', component: Timetable },
      { path: 'subjects', component: Subjects },
      { path: 'results', component: Results },
      { path: 'payments', component: Invoices },
      { path: 'receipts', component: Transactions },
      { path: 'profile', component: Profile },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
