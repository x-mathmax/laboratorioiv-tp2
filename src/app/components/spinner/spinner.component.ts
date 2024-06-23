import { CommonModule } from '@angular/common';
import { Component, Input, Renderer2, ElementRef  } from '@angular/core';

@Component({
  selector: 'app-spinner',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './spinner.component.html',
  styleUrl: './spinner.component.css'
})
export class SpinnerComponent {
  // @Input() isLoading: boolean = false;

  constructor(private renderer: Renderer2, private el: ElementRef) {}

  mostrar() {
    console.log('Spinner mostrado');
    this.renderer.removeClass(this.el.nativeElement, 'oculto');
    this.renderer.addClass(this.el.nativeElement, 'visible');
  }

  ocultar() {
    console.log('Spinner ocultado');
    this.renderer.removeClass(this.el.nativeElement, 'visible');
    this.renderer.addClass(this.el.nativeElement, 'oculto');
  }
}
