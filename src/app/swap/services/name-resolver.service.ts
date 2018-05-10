import { Injectable } from '@angular/core';

import { hash } from "eth-ens-namehash";
import { ContractExecutorService } from '@app/shared/services/contract-executor.service';

@Injectable()
export class NameResolverService {

  constructor(private contractExecutionService: ContractExecutorService) 
  { }

}
