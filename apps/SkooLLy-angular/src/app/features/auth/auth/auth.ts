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

  showSuccessModal: boolean = false;
  isNewAdminSchool: boolean = false;
  registeredUserEmail: string = '';

  constructor(
    private fb: FormBuilder,
    private snack: MatSnackBar,
    private router: Router,
    private auth: AuthService,
    private classService: ClassService
  ) {}

  ngOnInit(): void {
    this.initializeForms();
    this.setupRoleChangeListener();
  }

  private initializeForms(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });

    this.basicInfoForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      schoolName: ['', [Validators.required, Validators.minLength(3)]]
    });

    this.schoolInfoForm = this.fb.group({
      schoolEmail: ['', [Validators.required, Validators.email]],
      schoolPhone: ['', [Validators.required, Validators.pattern(/^\d{11}$/)]],
      address: ['', [Validators.required, Validators.minLength(10)]],
      schoolType: [[], [Validators.required, Validators.minLength(1)]],
      state: ['', Validators.required],
      logo: ['', Validators.required]
    });

    this.personalInfoForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(3)]],
      phone: ['', [Validators.required, Validators.pattern(/^\d{11}$/)]],
      gender: ['', Validators.required],
      bio: [''],
      role: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(7)]],
      confirmPassword: ['', Validators.required],
      classId: [''],
      dob: ['', Validators.required],
      profilePic: [''],
      address: ['', Validators.required]
    }, { validators: this.matchPasswords('password', 'confirmPassword') });
  }

  private matchPasswords(controlName: string, matchingControlName: string): ValidatorFn {
    return (group: AbstractControl) => {
      const control = group.get(controlName);
      const match = group.get(matchingControlName);
      return control?.value === match?.value ? null : { mismatch: true };
    };
  }

  private setupRoleChangeListener(): void {
    this.personalInfoForm.get('role')?.valueChanges.subscribe(role => {
      const classIdControl = this.personalInfoForm.get('classId');
      
      if (role === 'student') {
        classIdControl?.setValidators([Validators.required]);
        this.fetchClassesForTenant();
      } else {
        classIdControl?.clearValidators();
        classIdControl?.setValue('');
      }
      
      classIdControl?.updateValueAndValidity();
    });
  }

  goToNextStep(): void {
    if (this.basicInfoForm.invalid) return;

    const { email, schoolName } = this.basicInfoForm.value;

    this.auth.checkSchoolAndEmail(email, schoolName).subscribe({
      next: (res: any) => {
        this.emailExists = res.emailExists;
        this.schoolExists = res.schoolExists;

        if (this.emailExists) {
          this.snack.open('Email already exists. Please login instead.', '', {
            duration: 3000,
            panelClass: ['white-bg-snack']
          });
          return;
        }

        if (this.schoolExists && res.school) {
          this.tenantId = res.school.tenantId;
          console.log('✅ School exists. Tenant ID:', this.tenantId);
        }

        this.step++;
      },
      error: (err) => {
        this.snack.open(err.error?.message || 'Error checking email/school', '', {
          duration: 3000,
          panelClass: ['white-bg-snack']
        });
      }
    });
  }

  fetchClassesForTenant(): void {
    if (!this.tenantId || !this.schoolExists) {
      console.warn('Cannot fetch classes: missing tenantId or school does not exist');
      return;
    }

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
    if (this.loginForm.invalid) return;

    const { email, password } = this.loginForm.value;

    this.auth.login({ email, password }).subscribe({
      next: (res: any) => {
        localStorage.setItem('token', res.token);
        localStorage.setItem('user', JSON.stringify(res.user));

        this.snack.open('Login successful!', '', { 
          duration: 3000,
          panelClass: ['white-bg-snack']
        });

        const { role } = res.user;

        if(role ==='student') {
          window.location.href = `http://localhost:5173?token=${res.token}`;
          console.log('Navigating to student portal...');
        }
        
        this.router.navigate([`/${role}`]);
      },
      error: (err) => {
        this.snack.open(err.error?.message || 'Invalid credentials', '', {
          duration: 3000,
          panelClass: ['white-bg-snack']
        });
      }
    });
  }

  onRegister() {
    if (this.personalInfoForm.invalid) return;

    const { role, classId } = this.personalInfoForm.value;

    if (role === 'student' && !classId) {
      this.snack.open('Please select your class.', '', {
        duration: 3000,
        panelClass: ['white-bg-snack']
      });
      return;
    }

    const formData = this.buildRegistrationFormData();

    this.auth.register(formData).subscribe({
      next: () => {
        this.snack.open('Registered successfully!', '', {
          duration: 3000,
          panelClass: ['white-bg-snack']
        });

        this.registeredUserEmail = this.basicInfoForm.value.email;
        this.isNewAdminSchool = role === 'admin' && !this.schoolExists;
        this.showSuccessModal = true;

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

  closeSuccessModal(): void {
    this.showSuccessModal = false;
    this.isNewAdminSchool = false;

    if (this.registeredUserEmail) {
      this.loginForm.patchValue({
        email: this.registeredUserEmail
      });
    }
    
    this.registeredUserEmail = '';
  }

  private buildRegistrationFormData(): FormData {
    const formData = new FormData();

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
        formData.append('logo', this.selectedLogoFile);
      }
    }

    const personalInfo = this.personalInfoForm.value;
    formData.append('personalInfo', JSON.stringify({
      fullName: personalInfo.fullName,
      phone: personalInfo.phone,
      gender: personalInfo.gender,
      bio: personalInfo.bio,
      role: personalInfo.role,
      password: personalInfo.password,
      confirmPassword: personalInfo.confirmPassword,
      classId: personalInfo.classId,
      dob: personalInfo.dob,
      address: personalInfo.address
    }));

    if (this.selectedProfilePicFile) {
      formData.append('profilePic', this.selectedProfilePicFile);
    }

    return formData;
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
      this.selectedProfilePicFile = input.files[0];

      this.personalInfoForm.get('profilePic')?.setValue(this.selectedProfilePicFile)
    }
  }
}
