import { NG_VALIDATORS, Validator, AbstractControl } from "@angular/forms";
import { Directive, forwardRef, Attribute } from "@angular/core";

@Directive({
  selector: '[equalValidator][formControlName],[equalValidator][ngModel]',
  providers: [
    { provide: NG_VALIDATORS, useExisting: forwardRef(() => EqualValidator), multi: true }
  ]
})
export class EqualValidator implements Validator {
  constructor(@Attribute('validateEqual') public equalValidator: string,
    @Attribute('reverse') public reverse: string) {
  }

  private get isReverse() {
    if (!this.reverse) return false;
    return this.reverse === 'true' ? true : false;
  }

  validate(c: AbstractControl): { [key: string]: any } {
    // self value
    const v = c.value;

    // control vlaue
    const e = c.root.get(this.equalValidator);
    // value not equal
    if (e && v !== e.value && !this.isReverse) {
      return {
        misMatched: true
      };
    }

    // value equal and reverse
    if (e && v === e.value && this.isReverse) {
      delete e.errors['misMatched'];
      if (!Object.keys(e.errors).length) {
        e.setErrors(null);
      }
    }

    // value not equal and reverse
    if (e && v !== e.value && this.isReverse) {
      e.setErrors({
        misMatched: true
      });
    }
    return null;
  }
}