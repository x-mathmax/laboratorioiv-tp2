import { Directive, ElementRef, Input, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appChangeColor]',
  standalone: true
})
export class ChangeColorDirective {

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  @Input('appChangeColor') set changeColor(condition: boolean) {
    const colorClass = condition ? 'button-red' : 'button-default';

    this.renderer.removeClass(this.el.nativeElement, 'button-red');
    this.renderer.removeClass(this.el.nativeElement, 'button-default');
    this.renderer.addClass(this.el.nativeElement, colorClass);
  }

}
