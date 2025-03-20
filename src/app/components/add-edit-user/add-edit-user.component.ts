import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from '../../models/user.model';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-add-edit-user',
  standalone: false,
  templateUrl: './add-edit-user.component.html',
  styleUrls: ['./add-edit-user.component.scss']
})
export class AddEditUserComponent implements OnInit {
  @Input() user: User | null = null;
  @Output() userSaved = new EventEmitter<User>();

  userForm: FormGroup;
  isEditMode : boolean = false;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<AddEditUserComponent>,
    @Inject(MAT_DIALOG_DATA) public data: User | undefined
  ) {
    if(this.data) {
      this.isEditMode = true;
    }
    this.userForm = this.fb.group({
      id: [this.data?.id],
      name: [(this.data?.name ?? ''), [Validators.required, Validators.minLength(3)]],
      email: [(this.data?.email ?? ''), [Validators.required, Validators.email]],
      role: [(this.data?.role ?? ''), Validators.required],
      createOn: [{ value: new Date(), disabled: true }]
    });
  }

  ngOnInit(): void {
    if (this.user) {
      this.userForm.patchValue(this.user);
    }
  }

  submit(): void {
    if (this.userForm.valid) {
      this.userSaved.emit(this.userForm.getRawValue());
    }
  }

  onClose() {
    this.dialogRef.close();
  }
}
