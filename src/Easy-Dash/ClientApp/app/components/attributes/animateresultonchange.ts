import { inject, customAttribute } from 'aurelia-framework';
import { CssAnimator } from 'aurelia-animator-css';

@customAttribute('animateresultonchange')
@inject(Element, CssAnimator)
export class AnimateResultOnChangeCustomAttribute {
    constructor(private readonly element: Element, private readonly animator: CssAnimator) {
    }

    initialValueSet = false;


    valueChanged(newValue: any) {
        if (this.initialValueSet) {
            if (newValue === 'Running') {
                this.animator.addClass(this.element, 'result-animation');
            }
            if (newValue === 'Success' || newValue === 'Fail') {
                this.animator.removeClass(this.element, 'result-animation');
            }

        }
        this.initialValueSet = true;
    }
}