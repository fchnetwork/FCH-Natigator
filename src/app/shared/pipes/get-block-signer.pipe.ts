import { Pipe, PipeTransform } from '@angular/core';

const ethUtils = require('ethereumjs-util');
const ethBlock = require('ethereumjs-block/from-rpc')
@Pipe({
  name: 'getBlockSigner'
})
export class GetBlockSignerPipe implements PipeTransform {
  transform(block: any): string {
    let sealers = block.extraData;
    if (sealers.length <= 130) {
      return undefined;
    }
    let sig = ethUtils.fromRpcSig('0x' + sealers.substring(sealers.length - 130, sealers.length));
               block.extraData = block.extraData.substring(0, block.extraData.length - 130);
    let blk = ethBlock(block);
        blk.header.difficulty[0] = block.difficulty;
    let sigHash = ethUtils.sha3(blk.header.serialize());
    let pubkey = ethUtils.ecrecover(sigHash, sig.v, sig.r, sig.s);
    return "0x"+ethUtils.pubToAddress(pubkey).toString('hex');
  }
}
