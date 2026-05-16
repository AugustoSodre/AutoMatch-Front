import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';

import { MockImageService } from '../mock-image.service';

interface WizardStep {
  number: 1 | 2 | 3;
  title: string;
  description: string;
}

interface AttributeCard {
  id: string;
  label: string;
  icon: string;
  description: string;
}

interface CategoryCard {
  id: 'aventura' | 'luxo' | 'familia';
  label: string;
  description: string;
  imageUrl: string;
}

interface WizardPayload {
  profile: {
    fullName: string;
    email: string;
    state: string;
  };
  budget: {
    min: number;
    max: number;
  };
  priorities: string[];
  categories: string[];
}

@Component({
  selector: 'app-new-match-wizard',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './new-match-wizard.component.html',
  styleUrls: ['./new-match-wizard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NewMatchWizardComponent implements OnInit {
  public readonly wizardSteps: ReadonlyArray<WizardStep> = [
    { number: 1, title: 'Perfil & Orçamento', description: 'Dados básicos e faixa de preço' },
    { number: 2, title: 'Prioridades', description: 'Ordene os atributos mais importantes' },
    { number: 3, title: 'Categorias', description: 'Escolha os estilos desejados' }
  ];

  public readonly attributeCards: ReadonlyArray<AttributeCard> = [
    { id: 'economia', label: 'Economia', icon: '⛽', description: 'Baixo consumo e custo por km' },
    { id: 'seguranca', label: 'Segurança', icon: '🛡', description: 'Mais proteção para sua família' },
    { id: 'potencia', label: 'Potência', icon: '⚡', description: 'Resposta e desempenho' },
    { id: 'conforto', label: 'Conforto', icon: '🛋', description: 'Viagem suave e agradável' },
    { id: 'tecnologia', label: 'Tecnologia', icon: '📡', description: 'Conectividade e assistências' },
    { id: 'espaco', label: 'Espaço', icon: '📦', description: 'Versatilidade para bagagem' }
  ];

  public readonly categoryCards: ReadonlyArray<CategoryCard>;
  public readonly budgetFloor = 30000;
  public readonly budgetCeiling = 300000;
  public readonly budgetStep = 5000;

  public currentStep: 1 | 2 | 3 = 1;
  public isCalculating = false;
  public draggedPriorityIndex: number | null = null;

  public readonly form: FormGroup;

  private readonly budgetRangeValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const minValue = Number(control.get('min')?.value);
    const maxValue = Number(control.get('max')?.value);

    if (!Number.isFinite(minValue) || !Number.isFinite(maxValue) || minValue <= maxValue) {
      return null;
    }

    return { budgetRange: true };
  };

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly mockImageService: MockImageService,
    private readonly router: Router
  ) {
    const categoryImages = this.mockImageService.getCategoryImages();

    this.categoryCards = [
      {
        id: 'aventura',
        label: 'Aventura',
        description: 'SUVs e modelos prontos para viajar',
        imageUrl: categoryImages.aventura
      },
      {
        id: 'luxo',
        label: 'Luxo',
        description: 'Acabamento premium e alto nível de conforto',
        imageUrl: categoryImages.luxo
      },
      {
        id: 'familia',
        label: 'Família',
        description: 'Espaço interno, segurança e praticidade',
        imageUrl: categoryImages.familia
      }
    ];

    this.form = this.formBuilder.group({
      profile: this.formBuilder.group({
        fullName: ['', [Validators.required, Validators.minLength(2)]],
        email: ['', [Validators.required, Validators.email]],
        state: ['', [Validators.required, Validators.minLength(2)]]
      }),
      budget: this.formBuilder.group(
        {
          min: [65000, [Validators.required]],
          max: [180000, [Validators.required]]
        },
        { validators: [this.budgetRangeValidator] }
      ),
      priorities: this.formBuilder.control<string[]>(['economia', 'seguranca', 'potencia'], [Validators.required, Validators.minLength(1)]),
      categories: this.formBuilder.control<string[]>([], [Validators.required, Validators.minLength(1)])
    });
  }

  public ngOnInit(): void {}

  public get profileGroup(): FormGroup {
    return this.form.get('profile') as FormGroup;
  }

  public get budgetGroup(): FormGroup {
    return this.form.get('budget') as FormGroup;
  }

  public get prioritiesControl(): FormControl<string[]> {
    return this.form.get('priorities') as FormControl<string[]>;
  }

  public get categoriesControl(): FormControl<string[]> {
    return this.form.get('categories') as FormControl<string[]>;
  }

  public get selectedPriorities(): string[] {
    return [...(this.prioritiesControl.value ?? [])];
  }

  public get selectedCategories(): string[] {
    return [...(this.categoriesControl.value ?? [])];
  }

  public get budgetMin(): number {
    return Number(this.budgetGroup.get('min')?.value ?? this.budgetFloor);
  }

  public get budgetMax(): number {
    return Number(this.budgetGroup.get('max')?.value ?? this.budgetCeiling);
  }

  public get budgetTrackBackground(): string {
    const minPercent = this.valueToPercent(this.budgetMin);
    const maxPercent = this.valueToPercent(this.budgetMax);

    return `linear-gradient(to right, rgba(31, 41, 55, 1) 0%, rgba(31, 41, 55, 1) ${minPercent}%, #f39c12 ${minPercent}%, #f39c12 ${maxPercent}%, rgba(31, 41, 55, 1) ${maxPercent}%, rgba(31, 41, 55, 1) 100%)`;
  }

  public get activeStepTitle(): string {
    return this.wizardSteps.find((step: WizardStep) => step.number === this.currentStep)?.title ?? '';
  }

  public get isStepOneComplete(): boolean {
    return this.profileGroup.valid && this.budgetGroup.valid;
  }

  public get isStepTwoComplete(): boolean {
    return this.prioritiesControl.valid && this.selectedPriorities.length > 0;
  }

  public get isStepThreeComplete(): boolean {
    return this.categoriesControl.valid && this.selectedCategories.length > 0;
  }

  public get canProceed(): boolean {
    switch (this.currentStep) {
      case 1:
        return this.isStepOneComplete;
      case 2:
        return this.isStepTwoComplete;
      case 3:
        return this.isStepThreeComplete;
      default:
        return false;
    }
  }

  public get primaryActionLabel(): string {
    return this.currentStep === 3 ? 'Gerar Meu Match Automotivo!' : 'Continuar';
  }

  public get primaryActionIcon(): string {
    return this.currentStep === 3 ? '🪄' : '→';
  }

  public get progressPercent(): number {
    return ((this.currentStep - 1) / (this.wizardSteps.length - 1)) * 100;
  }

  public goToStep(stepNumber: 1 | 2 | 3): void {
    if (stepNumber < this.currentStep) {
      this.currentStep = stepNumber;
      return;
    }

    if (stepNumber === this.currentStep + 1 && this.canProceed) {
      this.currentStep = stepNumber;
    }
  }

  public goNext(): void {
    if (!this.canProceed) {
      this.markCurrentStepTouched();
      return;
    }

    if (this.currentStep < 3) {
      this.currentStep = (this.currentStep + 1) as 1 | 2 | 3;
      return;
    }

    this.submitWizard();
  }

  public goBack(): void {
    if (this.currentStep > 1) {
      this.currentStep = (this.currentStep - 1) as 1 | 2 | 3;
    }
  }

  public handlePrimaryAction(): void {
    this.goNext();
  }

  public togglePriority(attributeId: string): void {
    const current = this.selectedPriorities;
    const next = current.includes(attributeId)
      ? current.filter((id: string) => id !== attributeId)
      : [...current, attributeId];

    this.prioritiesControl.setValue(next);
    this.prioritiesControl.markAsDirty();
  }

  public isPrioritySelected(attributeId: string): boolean {
    return this.selectedPriorities.includes(attributeId);
  }

  public onPriorityDragStart(index: number): void {
    this.draggedPriorityIndex = index;
  }

  public onPriorityDragOver(event: DragEvent, index: number): void {
    event.preventDefault();

    if (this.draggedPriorityIndex === null || this.draggedPriorityIndex === index) {
      return;
    }

    const reordered = [...this.selectedPriorities];
    const [moved] = reordered.splice(this.draggedPriorityIndex, 1);
    reordered.splice(index, 0, moved);
    this.prioritiesControl.setValue(reordered);
    this.draggedPriorityIndex = index;
  }

  public onPriorityDrop(): void {
    this.draggedPriorityIndex = null;
  }

  public onPriorityDragEnd(): void {
    this.draggedPriorityIndex = null;
  }

  public toggleCategory(categoryId: string): void {
    const current = this.selectedCategories;
    const next = current.includes(categoryId)
      ? current.filter((id: string) => id !== categoryId)
      : [...current, categoryId];

    this.categoriesControl.setValue(next);
    this.categoriesControl.markAsDirty();
  }

  public isCategorySelected(categoryId: string): boolean {
    return this.selectedCategories.includes(categoryId);
  }

  public getAttributeLabel(attributeId: string): string {
    return this.attributeCards.find((attribute: AttributeCard) => attribute.id === attributeId)?.label ?? attributeId;
  }

  public getPriorityHint(index: number): string {
    if (index === 0) {
      return 'Must have';
    }

    if (index === 1) {
      return 'Very important';
    }

    return 'Considerar';
  }

  public getProfileControl(name: 'fullName' | 'email' | 'state'): AbstractControl | null {
    return this.profileGroup.get(name);
  }

  public budgetControl(name: 'min' | 'max'): AbstractControl | null {
    return this.budgetGroup.get(name);
  }

  public formatBudget(value: number): string {
    return `R$ ${value.toLocaleString('pt-BR')}`;
  }

  public completeLabel(): string {
    return 'AutoMatch is calculating your ideal matches...';
  }

  private submitWizard(): void {
    if (!this.form.valid) {
      this.markCurrentStepTouched();
      return;
    }

    const payload: WizardPayload = {
      profile: {
        fullName: String(this.getProfileControl('fullName')?.value ?? ''),
        email: String(this.getProfileControl('email')?.value ?? ''),
        state: String(this.getProfileControl('state')?.value ?? '')
      },
      budget: {
        min: this.budgetMin,
        max: this.budgetMax
      },
      priorities: this.selectedPriorities,
      categories: this.selectedCategories
    };

    this.isCalculating = true;
    console.log('New match wizard payload', payload);

    window.setTimeout(() => {
      void this.router.navigate(['/meus-matches']);
    }, 1800);
  }

  private markCurrentStepTouched(): void {
    if (this.currentStep === 1) {
      this.profileGroup.markAllAsTouched();
      this.budgetGroup.markAllAsTouched();
    }

    if (this.currentStep === 2) {
      this.prioritiesControl.markAsTouched();
    }

    if (this.currentStep === 3) {
      this.categoriesControl.markAsTouched();
    }
  }

  private valueToPercent(value: number): number {
    const clamped = Math.min(Math.max(value, this.budgetFloor), this.budgetCeiling);
    return ((clamped - this.budgetFloor) / (this.budgetCeiling - this.budgetFloor)) * 100;
  }

  public onBudgetMinChange(rawValue: string): void {
    const nextMin = Number(rawValue);
    const safeMin = Math.min(Math.max(nextMin, this.budgetFloor), this.budgetMax);
    this.budgetGroup.get('min')?.setValue(safeMin);
  }

  public onBudgetMaxChange(rawValue: string): void {
    const nextMax = Number(rawValue);
    const safeMax = Math.max(Math.min(nextMax, this.budgetCeiling), this.budgetMin);
    this.budgetGroup.get('max')?.setValue(safeMax);
  }
}
