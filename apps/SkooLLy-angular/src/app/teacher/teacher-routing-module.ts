import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Teacher } from './teacher';
import { Dashboard } from './pages/dashboard/dashboard';
import { Profile } from './pages/profile/profile';
import { MyClasses } from './pages/my-classes/my-classes';
import { MySubjects } from './pages/my-subjects/my-subjects';
import { Resources } from './pages/resources/resources';
import { Attendance } from './pages/attendance/attendance';
import { Timetable } from './pages/timetable/timetable';
import { Results } from './pages/results/results';

const routes: Routes = [
  {
      path: '',
      component: Teacher,
      // canActivate: [AdminGuard],
      children: [
        { path: '', component: Dashboard },
        { path: 'resources', component: Resources },
        { path: 'attendance', component: Attendance },
        // { path: 'notices', component: Notices },
        { path: 'classes', component: MyClasses },
        { path: 'timetable', component: Timetable },
        { path: 'subjects', component: MySubjects },
        { path: 'results', component: Results },
        // { path: 'payments', component: Invoices },
        // { path: 'receipts', component: Transactions },
        { path: 'profile', component: Profile },
      ]
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TeacherRoutingModule { }
