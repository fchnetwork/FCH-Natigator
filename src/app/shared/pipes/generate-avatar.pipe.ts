
import { Pipe, PipeTransform } from '@angular/core';
import * as avatars from 'identity-img';
@Pipe({
  name: 'generateavatar'
})
export class GenerateAvatarPipe implements PipeTransform {

  transform(value: any): any {
    avatars.config({ size: 67 * 3, bgColor: '#fff' });

    const avatar = avatars.create( value.toString() );

    return avatar;
  }

}
