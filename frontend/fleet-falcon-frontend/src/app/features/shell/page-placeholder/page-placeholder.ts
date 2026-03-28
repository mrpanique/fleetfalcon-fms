import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-page-placeholder',
  imports: [],
  templateUrl: './page-placeholder.html',
  styleUrl: './page-placeholder.css'
})
export class PagePlaceholderComponent {
  private readonly route = inject(ActivatedRoute);

  protected readonly title = toSignal(
    this.route.data.pipe(map((data) => String(data['title'] ?? 'Page'))),
    { initialValue: 'Page' }
  );
}
