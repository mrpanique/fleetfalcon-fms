import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-admin-form-layout',
  standalone: true,
  templateUrl: './admin-form-layout.html',
  styleUrl: './admin-form-layout.css'
})
export class AdminFormLayoutComponent {
  @Input({ required: true }) headingId!: string;
  @Input({ required: true }) title!: string;
  @Input() cardAriaLabel = 'Editable form data';
}
