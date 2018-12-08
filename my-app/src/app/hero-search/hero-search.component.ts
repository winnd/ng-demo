import {Component, OnInit} from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {HeroService} from '../hero.service';
import {debounceTime, distinctUntilChanged, switchMap} from 'rxjs/internal/operators';
import {Hero} from '../Hero';

@Component({
  selector: 'app-hero-search',
  templateUrl: './hero-search.component.html',
  styleUrls: ['./hero-search.component.css']
})

export class HeroSearchComponent implements OnInit {
  heroes$: Observable<Hero[]>;
  private searchTerms = new Subject<string>(); // Subject 既是可观察对象的数据源，本身也是 Observable。 你可以像订阅任何 Observable 一样订阅 Subject。

  constructor(private heroService: HeroService) {}

  search(term: string): void {
    this.searchTerms.next(term); // 你还可以通过调用它的 next(value) 方法往 Observable 中推送一些值，就像 search() 方法中一样。
  }

  ngOnInit(): void {
    this.heroes$ = this.searchTerms.pipe(
      debounceTime(300),                // wait 300ms after each keystroke before considering the term
      distinctUntilChanged(),                    // ignore new term if same as previous term
      switchMap((term: string) =>        // switch to new search observable each time the term changes
        this.heroService.searchHeroes(term)
      )
    );
  }

}
