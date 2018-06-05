import { Location } from '@angular/common';

export abstract class PaymentGatewayWizardStep {

  active = false;
  nextStep: PaymentGatewayWizardStep;

  protected constructor(private location: Location) { }

  setNextStep(step: PaymentGatewayWizardStep){
    this.nextStep = step;
  }

  next() {
    this.deactivate();
    if(this.nextStep) {
      this.nextStep.activate();
    }
  }

  cancel() {
    this.location.back();
  }

  activate() {
    this.active = true;
  }

  deactivate() {
    this.active = false;
  }
}
