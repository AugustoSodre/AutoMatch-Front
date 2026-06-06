import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../systems-services';

interface AccountMenuItem {
  label: string;
  route?: string;
  icon: string;
  active?: boolean;
}

@Component({
  selector: 'app-account-hub',
  templateUrl: './account-hub.component.html',
  styleUrls: ['./account-hub.component.scss']
})
export class AccountHubComponent implements OnInit {
  public form: FormGroup;
  public displayName = 'Usuário';
  public displayUsername = '@usuario';
  public error = '';
  public loading = false;
  public avatarPreview = '';
  public avatarLoading = false;

  public readonly menuItems: ReadonlyArray<AccountMenuItem> = [
    { label: 'Informações Pessoais', route: '/perfil', icon: '👤', active: true },
    { label: 'Sair', route: '/inicio', icon: '↪' }
  ];

  constructor(
    private readonly fb: FormBuilder,
    private readonly authService: AuthService
  ) {
    this.form = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      surname: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      username: ['', [Validators.required, Validators.minLength(3)]]
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

  public get usernameControl() {
    return this.form.get('username');
  }

  public ngOnInit(): void {
    const user = this.authService.getUser();
    if (!user) {
      return;
    }

    const usernameFromEmail = user.email.includes('@') ? user.email.split('@')[0] : user.email;
    this.avatarPreview = user.avatarUrl;

    this.form.patchValue(
      {
        firstName: user.firstName,
        surname: user.surname,
        email: user.email,
        username: usernameFromEmail
      },
      { emitEvent: false }
    );

    this.displayName = this.authService.getDisplayName(user);
    this.displayUsername = `@${usernameFromEmail}`;
  }

  public onSubmit(): void {
    if (this.form.valid) {
      this.error = '';
      this.loading = true;

      this.authService.updateProfile({
        firstName: String(this.firstNameControl?.value ?? ''),
        surname: String(this.surnameControl?.value ?? ''),
        email: String(this.emailControl?.value ?? '')
      }).subscribe({
        next: () => {
          this.loading = false;
          this.displayName = this.authService.getDisplayName();
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

  public onAvatarSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith('image/')) {
      this.error = 'Selecione uma imagem válida';
      input.value = '';
      return;
    }

    this.error = '';
    this.avatarLoading = true;

    const reader = new FileReader();
    reader.onload = () => {
      const avatarUrl = String(reader.result ?? '');
      this.authService.updateAvatar({ avatarUrl }).subscribe({
        next: (response) => {
          this.avatarLoading = false;
          this.avatarPreview = response.user.avatarUrl;
          this.displayName = this.authService.getDisplayName(response.user);
        },
        error: (err) => {
          this.avatarLoading = false;
          this.error = err.error?.error || 'Erro ao enviar imagem';
        }
      });
    };

    reader.onerror = () => {
      this.avatarLoading = false;
      this.error = 'Não foi possível ler a imagem';
    };

    reader.readAsDataURL(file);
    input.value = '';
  }
}
