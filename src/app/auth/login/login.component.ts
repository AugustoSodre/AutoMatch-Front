import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  public form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  public get emailControl(): FormControl {
    return this.form.get('email') as FormControl;
  }

  public get passwordControl(): FormControl {
    return this.form.get('password') as FormControl;
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.form.valid) {
      console.log('Login payload', this.form.value);
    } else {
      this.form.markAllAsTouched();
    }
  }
}
