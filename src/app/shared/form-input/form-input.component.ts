import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-form-input',
  templateUrl: './form-input.component.html',
  styleUrls: ['./form-input.component.scss']
})
export class FormInputComponent {
  @Input() label = '';
  @Input() type: string = 'text';
  @Input() control!: FormControl;
  @Input() placeholder = '';
}
