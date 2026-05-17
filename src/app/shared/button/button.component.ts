import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-shared-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss']
})
export class ButtonComponent {
  @Input() variant: 'primary' | 'secondary' = 'primary';
  @Input() disabled = false;
  @Input() loading = false;
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  @Input() ariaLabel?: string;

  @Output() buttonClick = new EventEmitter<Event>();

  get classes() {
    return {
      'btn': true,
      'btn--primary': this.variant === 'primary',
      'btn--secondary': this.variant === 'secondary',
      'is-loading': this.loading
    };
  }

  handleClick(event: Event) {
    if (this.disabled || this.loading) {
      event.preventDefault();
      event.stopImmediatePropagation();
      return;
    }
    this.buttonClick.emit(event);
  }
}
