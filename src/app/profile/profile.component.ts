import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../systems-services/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  public form: FormGroup;
  public error = '';
  public loading = false;

  constructor(
    private readonly fb: FormBuilder,
    private readonly authService: AuthService,
    private readonly router: Router
  ) {
    this.form = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      surname: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  public get firstNameControl() {
    return this.form.get('firstName');
  }

  public get surnameControl() {
    return this.form.get('surname');
  }

  public get emailControl() {
    return this.form.get('email');
  }

  public get passwordControl() {
    return this.form.get('password');
  }

  ngOnInit(): void {
    const user = this.authService.getUser();
    if (user) {
      this.form.patchValue(
        {
          firstName: user.firstName,
          surname: user.surname,
          email: user.email,
        },
        { emitEvent: false }
      );
    }
  }

  public onSubmit(): void {
    if (this.form.valid) {
      this.error = '';
      this.loading = true;

      this.authService.updateProfile(this.form.value).subscribe({
        next: () => {
          this.loading = false;
          this.router.navigate(['/perfil']);
        },
        error: (err) => {
          this.loading = false;
          this.error = err.error?.error || 'Erro ao atualizar perfil';
        }
      });
      return;
    }

    this.form.markAllAsTouched();
  }
}
