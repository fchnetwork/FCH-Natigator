import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({name: 'safeHTML'})
export class SafeHTMLPipe implements PipeTransform {
  constructor(private sanitizer:DomSanitizer) {
    this.sanitizer = sanitizer;
  }
  transform(trusthtml) {
    return this.sanitizer.bypassSecurityTrustHtml(trusthtml);
  }
}
