import { NgFor, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-resources',
  imports: [
    MatCardModule,
    MatFormFieldModule,
    MatIconModule,
    MatButtonModule,
    MatSelectModule,
    MatInputModule,
    MatDividerModule,
    ReactiveFormsModule,
    MatTableModule,
    NgFor
  ],
  templateUrl: './resources.html',
  styleUrl: './resources.scss',
})
export class Resources {
   resourceForm!: FormGroup;
  resources: any[] = [];

  classes = ['JS1', 'JS2', 'SS1'];
  subjects = ['Mathematics', 'English', 'Physics'];

  constructor(private fb: FormBuilder) {
    this.resourceForm = this.fb.group({
      title: [''],
      class: [''],
      subject: [''],
      file: [null],
      description: ['']
    });
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    this.resourceForm.patchValue({ file });
  }

  uploadResource() {
    const resource = this.resourceForm.value;
    this.resources.push({
      ...resource,
      uploadedAt: new Date().toLocaleString(),
      fileName: resource.file?.name
    });

    this.resourceForm.reset();
  }

  download(file: File) {
    const link = document.createElement('a');
    link.href = URL.createObjectURL(file);
    link.download = file.name;
    link.click();
  }
}
