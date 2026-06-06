import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { MockImageService } from '../systems-services';
import { SharedModule } from '../shared/shared.module';

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
  id: 'populares' | 'aventura' | 'luxo' | 'familia';
  label: string;
  description: string;
  imageUrl: string;
}

interface WizardPayload {
  priorities: string[];
  categories: string[];
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
  public readonly wizardSteps: ReadonlyArray<WizardStep> = [
    { number: 1, title: 'Prioridades', description: 'Ordene os atributos mais importantes' },
    { number: 2, title: 'Categorias', description: 'Escolha os estilos desejados' },
    { number: 3, title: 'Resumo', description: 'Confirme e gere seu match' }
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
  // budget removed from wizard

  public currentStep: 1 | 2 | 3 = 1;
  public isCalculating = false;
  public draggedPriorityIndex: number | null = null;

  public readonly form: FormGroup;

  // budget validator removed

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly mockImageService: MockImageService,
    private readonly router: Router,
    private readonly changeDetectorRef: ChangeDetectorRef
  ) {
    const categoryImages = this.mockImageService.getCategoryImages();

    this.categoryCards = [
      {
        id: 'populares',
        label: 'Populares',
        description: 'Modelos mais procurados e testados pela comunidade',
        imageUrl: categoryImages.populares
      },
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
      priorities: this.formBuilder.control<string[]>(['economia', 'seguranca', 'potencia'], [Validators.required, Validators.minLength(1)]),
      categories: this.formBuilder.control<string[]>([], [Validators.required, Validators.minLength(1)])
    });
  }

  public ngOnInit(): void {}

  // profile and budget groups removed

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

  public get activeStepTitle(): string {
    return this.wizardSteps.find((step: WizardStep) => step.number === this.currentStep)?.title ?? '';
  }

  public get isStepOneComplete(): boolean {
    return this.prioritiesControl.valid && this.selectedPriorities.length > 0;
  }

  public get isStepTwoComplete(): boolean {
    return this.categoriesControl.valid && this.selectedCategories.length > 0;
  }

  public get isStepThreeComplete(): boolean {
    // final confirmation step - allow if previous steps are complete
    return this.isStepOneComplete && this.isStepTwoComplete;
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

  public completeLabel(): string {
    return 'AutoMatch está calculando seus matches ideais...';
  }

  private submitWizard(): void {
    if (!this.form.valid) {
      this.markCurrentStepTouched();
      return;
    }

    const payload: WizardPayload = {
      priorities: this.selectedPriorities,
      categories: this.selectedCategories
    };

    this.isCalculating = true;
    this.changeDetectorRef.markForCheck();
    console.log('New match wizard payload', payload);

    // Simulated API call with celebratory timing
    window.setTimeout(() => {
      void this.router.navigate(['/meus-matches']);
    }, 2400);
  }

  private markCurrentStepTouched(): void {
    if (this.currentStep === 1) {
      this.prioritiesControl.markAsTouched();
    }

    if (this.currentStep === 2) {
      this.prioritiesControl.markAsTouched();
    }

    if (this.currentStep === 3) {
      this.categoriesControl.markAsTouched();
    }
  }

  // budget helpers removed

  public trackByStep(index: number, step: WizardStep): number {
    return step.number;
  }

  public trackByAttribute(index: number, attribute: AttributeCard): string {
    return attribute.id;
  }

  public trackByCategory(index: number, category: CategoryCard): string {
    return category.id;
  }

  public trackByPriority(index: number, priorityId: string): string {
    return priorityId;
  }
}
