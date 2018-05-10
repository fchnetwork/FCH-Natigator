import { Component, OnInit } from '@angular/core';
import { environment } from '../environments/environment';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountIdleService } from '@app/core/account-idle-service/account-idle.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'app';

  constructor(
    private idle: AccountIdleService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    router.events.subscribe((val) => {
      console.log(val);
    });
  }

  ngOnInit() {
    //Start watching for user inactivity.
    this.idle.startWatching();

    // Start watching when user idle is starting.
    this.idle.onTimerStart().subscribe(count => console.log(count));

    // Start watch when time is up.
    this.idle.onTimeout().subscribe(() => console.log('Time is up!'));
  }
}
