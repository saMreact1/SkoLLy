import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Teacher } from './teacher';
import { Dashboard } from './pages/dashboard/dashboard';

const routes: Routes = [
  {
      path: '',
      component: Teacher,
      // canActivate: [AdminGuard],
      children: [
        { path: '', component: Dashboard },
        // { path: 'teachers', component: Teachers },
        // { path: 'students', component: Students },
        // { path: 'notices', component: Notices },
        // { path: 'classes', component: Classes },
        // { path: 'timetable', component: Timetable },
        // { path: 'subjects', component: Subjects },
        // { path: 'results', component: Results },
        // { path: 'payments', component: Invoices },
        // { path: 'receipts', component: Transactions },
        // { path: 'profile', component: Profile },
      ]
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TeacherRoutingModule { }
