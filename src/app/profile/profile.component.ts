import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  public form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      state: ['', [Validators.required]]
    });
  }

  public get fullNameControl() {
    return this.form.get('fullName');
  }

  public get emailControl() {
    return this.form.get('email');
  }

  public get passwordControl() {
    return this.form.get('password');
  }

  public get stateControl() {
    return this.form.get('state');
  }

  ngOnInit(): void {}

  public onSubmit(): void {
    if (this.form.valid) {
      console.log('Profile update payload', this.form.value);
      return;
    }

    this.form.markAllAsTouched();
  }
}
