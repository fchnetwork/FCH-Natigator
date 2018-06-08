import { Location } from '@angular/common';

export abstract class PaymentGatewayWizardStep {

  active = false;
  private prevStep: PaymentGatewayWizardStep;
  private nextStep: PaymentGatewayWizardStep;

  protected constructor(protected location: Location) { }

  setNextStep(step: PaymentGatewayWizardStep){
    this.nextStep = step;
    step.prevStep = this;
  }

  next() {
    this.deactivate();
    if(this.nextStep) {
      this.nextStep.activate();
    }
  }

  cancel() {
    if(this.prevStep) {
      this.deactivate();
      this.prevStep.activate();
    } else {
      this.location.back();
    }
  }

  activate() {
    this.active = true;
  }

  deactivate() {
    this.active = false;
  }
}
