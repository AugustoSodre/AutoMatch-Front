import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

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

  public readonly menuItems: ReadonlyArray<AccountMenuItem> = [
    { label: 'Informações Pessoais', route: '/profile', icon: '👤', active: true },
    { label: 'Preferências de Carro', route: '/comparar', icon: '🚗' },
    { label: 'Segurança da Conta', route: '/auth/login', icon: '🔒' },
    { label: 'Meus Matches Salvos', route: '/meus-matches', icon: '★' },
    { label: 'Configurações', route: '/about', icon: '⚙' },
    { label: 'Sair', route: '/home', icon: '↪' }
  ];

  constructor(private readonly fb: FormBuilder) {
    this.form = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      username: ['', [Validators.required, Validators.minLength(3)]],
      location: ['', [Validators.required, Validators.minLength(2)]]
    });
  }

  public get firstNameControl() {
    return this.form.get('firstName');
  }

  public get lastNameControl() {
    return this.form.get('lastName');
  }

  public get emailControl() {
    return this.form.get('email');
  }

  public get usernameControl() {
    return this.form.get('username');
  }

  public get locationControl() {
    return this.form.get('location');
  }

  ngOnInit(): void {}

  public onSubmit(): void {
    if (this.form.valid) {
      console.log('Account hub payload', this.form.value);
      return;
    }

    this.form.markAllAsTouched();
  }
}
