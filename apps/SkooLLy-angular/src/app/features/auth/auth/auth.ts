import { ClassService } from './../../../core/services/class.service';
import { NgIf, NgFor, NgForOf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatStepperModule } from '@angular/material/stepper';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';

@Component({
  selector: 'app-auth',
  imports: [
    MatFormFieldModule,
    ReactiveFormsModule,
    FormsModule,
    MatInputModule,
    MatStepperModule,
    MatListModule,
    MatButtonModule,
    MatSelectModule,
    MatSnackBarModule,
    MatCardModule,
    NgIf,
    NgFor,
    MatIconModule,
    RouterModule,
    MatDatepickerModule
  ],
  templateUrl: './auth.html',
  styleUrl: './auth.scss'
})
export class Auth implements OnInit {
  isLogin: boolean = true;
  isLinear: boolean = true;
  step: number = 0;
  selectedLogoFile: File | null = null;
  selectedProfilePicFile: File | null = null;
  availableClasses: any[] = [];
  tenantId: string = '';

  basicInfoForm!: FormGroup;
  schoolInfoForm!: FormGroup;
  personalInfoForm!: FormGroup;
  loginForm!: FormGroup;

  schoolExists: boolean = false;
  emailExists: boolean = false;

  constructor(
    private fb: FormBuilder,
    private snack: MatSnackBar,
    private router: Router,
    private auth: AuthService,
    private classService: ClassService
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    })

    this.basicInfoForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      schoolName: ['', Validators.required]
    });

    this.schoolInfoForm = this.fb.group({
      schoolEmail: ['', [Validators.required, Validators.email]],
      schoolPhone: ['', [Validators.required, Validators.pattern('^\\d{11}$')]],
      address: ['', Validators.required],
      schoolType: [[], Validators.required],
      state: ['', Validators.required],
      logo: ['', Validators.required]
    });

    this.personalInfoForm = this.fb.group({
      fullName: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern('^\\d{11}$')]],
      gender: ['', Validators.required],
      bio: [''],
      role: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(7)]],
      confirmPassword: ['', Validators.required],
      classId: [''],
      dob: ['', Validators.required],
      profilePic: ['']
    }, { validators: this.matchPasswords('password', 'confirmPassword') });

    this.personalInfoForm.get('role')?.valueChanges.subscribe(role => {
      this.fetchClassesForTenant();
    });
  }

  matchPasswords(controlName: string, matchingControlName: string): ValidatorFn {
    return (group: AbstractControl) => {
      const control = group.get(controlName);
      const match = group.get(matchingControlName);
      return control?.value === match?.value ? null : { mismatch: true };
    };
  }


  goToNextStep(): void {
    const { email, schoolName } = this.basicInfoForm.value;
    console.log('🟡 Sending to backend:', { email, schoolName });

    this.auth.checkSchoolAndEmail(email, schoolName).subscribe({
      next: (res: any) => {
        this.emailExists = res.emailExists;
        this.schoolExists = res.schoolExists;

        if (this.schoolExists && res.school) {
          this.tenantId = res.school.tenantId;
          console.log('✅ Tenant ID received:', this.tenantId);

          // Only fetch classes after tenantId is guaranteed to be set
          if (this.personalInfoForm.get('role')?.value === 'student') {
            this.fetchClassesForTenant();
          }
        }

        if (this.emailExists) {
          this.snack.open('Email already exists', '', {
            duration: 3000,
            panelClass: ['white-bg-snack']
          });
        } else {
          this.step++;
        }
      },
      error: () => {
        this.snack.open('Error checking email/school', '', {
          duration: 3000,
          panelClass: ['white-bg-snack']
        });
      }
    });
  }

  fetchClassesForTenant(): void {
    if (!this.tenantId || !this.schoolExists) return;

    this.classService.getClassesByTenant(this.tenantId).subscribe({
      next: (classes) => {
        this.availableClasses = classes;
      },
      error: (err) => {
        console.error('Error fetching classes:', err);
        this.snack.open('Could not fetch classes for this school.', '', {
          duration: 3000,
          panelClass: ['white-bg-snack']
        });
      }
    });
  }

  onLogin() {
    const { email, password } = this.loginForm.value;

    this.auth.login({ email, password }).subscribe({
      next: (res: any) => {
        localStorage.setItem('token', res.token);
        localStorage.setItem('user', JSON.stringify(res.user));

        this.snack.open('Login successful!', '', { 
          duration: 3000,
          panelClass: ['white-bg-snack']
        });
        const role = res.user.role;

        this.router.navigate([`/${role}`]);
      },
      error: () => {
        this.snack.open('Invalid credentials', '', {
          duration: 3000,
          panelClass: ['white-bg-snack']
        });
      }
    });
  }

  onRegister() {
    if (this.personalInfoForm.invalid) return;

    const role = this.personalInfoForm.value.role;
    const classId = this.personalInfoForm.value.classId;

    if (role === 'student' && !classId) {
      this.snack.open('Please select your class.', '', {
        duration: 3000,
        panelClass: ['white-bg-snack']
      });
      return;
    }

    const formData = new FormData();

    // Flatten all your form data
    formData.append('email', this.basicInfoForm.value.email);
    formData.append('schoolName', this.basicInfoForm.value.schoolName);
    formData.append('schoolExists', JSON.stringify(this.schoolExists));

    if (!this.schoolExists) {
      const schoolInfo = this.schoolInfoForm.value;
      formData.append('schoolInfo', JSON.stringify({
        schoolEmail: schoolInfo.schoolEmail,
        schoolPhone: schoolInfo.schoolPhone,
        address: schoolInfo.address,
        schoolType: schoolInfo.schoolType,
        state: schoolInfo.state
      }));

      if (this.selectedLogoFile) {
        formData.append('logo', this.selectedLogoFile); // 👈 THE ACTUAL FILE
      }
    }

    formData.append('personalInfo', JSON.stringify({
      fullName: this.personalInfoForm.value.fullName,
      phone: this.personalInfoForm.value.phone,
      gender: this.personalInfoForm.value.gender,
      bio: this.personalInfoForm.value.bio,
      role: this.personalInfoForm.value.role,
      password: this.personalInfoForm.value.password,
      confirmPassword: this.personalInfoForm.value.confirmPassword,
      classId: this.personalInfoForm.value.classId,
      dob: this.personalInfoForm.value.dob,
      profilePic: this.personalInfoForm.value.profilePic
    }));

    this.auth.register(formData).subscribe({
      next: () => {
        this.snack.open('Registered successfully!', '', {
          duration: 3000,
          panelClass: ['white-bg-snack']
        });
        this.isLogin = true;
        this.resetForms();
      },
      error: err => {
        this.snack.open(err.error.message || 'Registration failed.', '', {
          duration: 3000,
          panelClass: ['white-bg-snack']
        });
      }
    });
  }

  resetForms() {
    this.loginForm.reset();
    this.basicInfoForm.reset();
    this.schoolInfoForm.reset();
    this.personalInfoForm.reset();
    this.selectedLogoFile = null;
    this.selectedProfilePicFile = null;
    this.tenantId = '';
    this.emailExists = false;
    this.schoolExists = false;
    this.availableClasses = [];
    this.step = 0;
  }

  onLogoSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedLogoFile = input.files[0];

      this.schoolInfoForm.get('logo')?.setValue(this.selectedLogoFile.name)
    }
  }

  onPicSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedLogoFile = input.files[0];

      this.personalInfoForm.get('profilePic')?.setValue(this.selectedProfilePicFile)
    }
  }
}
