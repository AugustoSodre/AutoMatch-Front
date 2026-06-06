import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../systems-services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  public form: FormGroup;
  public error = '';
  public loading = false;

  constructor(
    private readonly fb: FormBuilder,
    private readonly authService: AuthService,
    private readonly router: Router
  ) {
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
      this.error = '';
      this.loading = true;
      this.authService.login(this.form.value).subscribe({
        next: () => {
          this.loading = false;
          this.router.navigate(['/inicio']);
        },
        error: (err) => {
          this.loading = false;
          this.error = err.error?.error || 'Erro ao fazer login';
        }
      });
    } else {
      this.form.markAllAsTouched();
    }
  }
}
