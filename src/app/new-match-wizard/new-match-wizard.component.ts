import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { MockImageService, CarService } from '../systems-services';
import { SharedModule } from '../shared/shared.module';
import { UserPreferences } from './user-preferences.interface';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

interface WizardStep {
  number: 1 | 2 | 3 | 4;
  title: string;
  description: string;
}

interface CategoryOption {
  name: 'Hatch' | 'Sedan' | 'SUV' | 'Picape' | 'Eletrico' | 'Premium';
  icon: string;
  description: string;
}

@Component({
  selector: 'app-new-match-wizard',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SharedModule],
  templateUrl: './new-match-wizard.component.html',
  styleUrls: ['./new-match-wizard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NewMatchWizardComponent implements OnInit {
  public readonly categoryOptions: ReadonlyArray<CategoryOption> = [
    { name: 'Hatch', icon: '', description: 'Compacto, prático e bom para uso urbano.' },
    { name: 'Sedan', icon: '', description: 'Mais porta-malas e conforto para rotina e estrada.' },
    { name: 'SUV', icon: '', description: 'Mais altura, espaço interno e presença.' },
    { name: 'Picape', icon: '', description: 'Versátil para carga, trabalho e uso misto.' },
    { name: 'Eletrico', icon: '', description: 'Mobilidade moderna e foco em eficiência energética.' },
    { name: 'Premium', icon: '', description: 'Mais refinamento, tecnologia e acabamento.' },
  ];

  public readonly wizardSteps: ReadonlyArray<WizardStep> = [
    { number: 1, title: 'Uso e Perfil', description: 'Quem vai usar o carro e em que rotina?' },
    { number: 2, title: 'Financeiro', description: 'Seu orçamento de compra' },
    { number: 3, title: 'Preferências', description: 'Categorias e faixa de lançamento do modelo' },
    { number: 4, title: 'Prioridades', description: 'Economia e potência' }
  ];

  public currentStep: 1 | 2 | 3 | 4 = 1;
  public isCalculating = false;
  public readonly form: FormGroup;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly router: Router,
    private readonly changeDetectorRef: ChangeDetectorRef,
    private readonly carService: CarService,
    private readonly http: HttpClient
  ) {
    this.form = this.formBuilder.group({
      demographics: this.formBuilder.group({
        familySize: ['2', Validators.required],
        primaryUse: ['work_commute', Validators.required],
        primaryEnvironment: ['city', Validators.required]
      }),
      financials: this.formBuilder.group({
        maxBudget: [null, [Validators.required, Validators.min(1000)]]
      }),
      technicalPreferences: this.formBuilder.group({
        categories: this.formBuilder.array([], [Validators.required, Validators.minLength(1)]),
        vehicleAge: ['up_to_3_years', Validators.required],
        transmission: ['automatic', Validators.required]
      }),
      priorities: this.formBuilder.group({
        economy: [3, [Validators.required, Validators.min(1), Validators.max(5)]],
        power: [3, [Validators.required, Validators.min(1), Validators.max(5)]]
      })
    });
  }

  public ngOnInit(): void {}

  public get categoriesArray(): FormArray {
    return this.form.get('technicalPreferences.categories') as FormArray;
  }

  public get progressPercent(): number {
    return ((this.currentStep - 1) / (this.wizardSteps.length - 1)) * 100;
  }

  public get primaryActionLabel(): string {
    return this.currentStep === 4 ? 'Gerar Meu Match!' : 'Continuar';
  }

  public goToStep(stepNumber: any): void {
    const step = stepNumber as 1 | 2 | 3 | 4;
    if (step < this.currentStep) {
      this.currentStep = step;
    } else if (this.canProceedTo(step)) {
      this.currentStep = step;
    }
  }

  public trackByAttribute(index: number, attr: any): any {
    return index;
  }

  public trackByCategory(index: number, cat: any): any {
    return index;
  }

  public trackByPriority(index: number, prio: any): any {
    return index;
  }

  private canProceedTo(step: number): boolean {
    if (step <= this.currentStep) return true;

    for (let i = 1; i < step; i++) {
      if (!this.isStepValid(i)) return false;
    }
    return true;
  }

  public isStepValid(step: number): boolean {
    switch (step) {
      case 1: return this.form.get('demographics')!.valid;
      case 2: return this.form.get('financials')!.valid;
      case 3: return this.form.get('technicalPreferences')!.valid;
      case 4: return this.form.get('priorities')!.valid;
      default: return false;
    }
  }

  public goNext(): void {
    if (this.isStepValid(this.currentStep)) {
      if (this.currentStep < 4) {
        this.currentStep = (this.currentStep + 1) as 1 | 2 | 3 | 4;
      } else {
        this.onSubmit();
      }
    } else {
      this.markStepAsTouched(this.currentStep);
    }
  }

  public goBack(): void {
    if (this.currentStep > 1) {
      this.currentStep = (this.currentStep - 1) as 1 | 2 | 3 | 4;
    }
  }

  public onCategoryChange(category: string, event: any): void {
    const isChecked = event.target.checked;
    if (isChecked) {
      this.categoriesArray.push(new FormControl(category));
    } else {
      const index = this.categoriesArray.controls.findIndex(x => x.value === category);
      this.categoriesArray.removeAt(index);
    }
  }

  public isCategorySelected(category: string): boolean {
    return this.categoriesArray.value.includes(category);
  }

  private markStepAsTouched(step: number): void {
    switch (step) {
      case 1: this.form.get('demographics')!.markAllAsTouched(); break;
      case 2: this.form.get('financials')!.markAllAsTouched(); break;
      case 3: this.form.get('technicalPreferences')!.markAllAsTouched(); break;
      case 4: this.form.get('priorities')!.markAllAsTouched(); break;
    }
  }

  public onSubmit(): void {
    if (this.form.valid) {
      const payload: UserPreferences = this.form.value;
      this.isCalculating = true;
      this.changeDetectorRef.markForCheck();

      console.log('Final Payload for AI Model:', JSON.stringify(payload, null, 2));

      // Chama o backend Node.js (orquestrador)
      this.http.post(`${environment.apiUrl}/matches/recommendations`, payload)
        .subscribe({
          next: (response: any) => {
            console.log('AI Match Results from Backend:', response);
            void this.router.navigate(['/meus-matches'], { state: { results: response.matches } });
          },
          error: (err) => {
            console.error('AI Service Error:', err);
            this.isCalculating = false;
            this.changeDetectorRef.markForCheck();
          }
        });
    } else {
      this.form.markAllAsTouched();
    }
  }

  public trackByStep(index: number, step: WizardStep): number {
    return step.number;
  }
}
