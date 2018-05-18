import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
 
import { iTransaction, iBlocks } from '@shared/app.interfaces'; 
import { setInterval } from 'timers';  
import { ModalService } from '@app/core/general/modal-service/modal.service';
import { ExplorerService } from '@app/core/explorer/explorer-service/explorer.service';
import { LoaderService } from '@app/core/general/loader-service/loader.service';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-blocks',
  templateUrl: './blocks.component.html'
})
export class BlocksComponent implements OnInit, OnDestroy {

  blocks: iBlocks[];
  maxBlocks: number = 50;

  lowBlock: number;
  highBlock: number;
  countblocks: number;

  order: number;
  column: string = 'number';
  descending: boolean = false;

  getBlockSource:Subscription;

  constructor(
    public exploreSrv: ExplorerService,
    private router: Router,
    private modal: ModalService,
    public loaderService: LoaderService) {}

  ngOnInit() {    
    
    this.loaderService.toggle(true);
    this.getLatestBlocks(); 
    
  }

  ngOnDestroy() {
    this.getBlockSource.unsubscribe();
  }

  sort(){
    this.descending = !this.descending;
    this.order = this.descending ? 1 : -1;
  }

  getLatestBlocks(){
    this.blocks = [];     
    this.getBlockSource = this.exploreSrv.getBlock().subscribe( async currentBlock => {
      for (var i = 0; i < this.maxBlocks; ++i) {
          this.exploreSrv.web3.eth.getBlock( currentBlock - i, (error, result) => {
            if(!error) {
              this.blocks.push(result );
              this.lowBlock    = this.blocks[0].number;
              this.highBlock   = this.blocks[this.blocks.length-1].number;
              this.countblocks = this.blocks.length;
            }
          })
      } 
    });
  }

  openBlock(block: iBlocks) {
    this.modal.openBlock(block.number,block).then( result => {
    }).catch( err => console.log('block component ' + err ) );
  } 
}
