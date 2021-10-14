import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";
import {faSortAmountDown, faSortAmountUp, faCaretLeft, faCaretRight, faUndo} from "@fortawesome/free-solid-svg-icons";
import {HttpParams} from "@angular/common/http";
import {ArticlesService} from "../services/articles.service";
import {FavoriteArticlesService} from "../services/favorite-articles.service";

@Component({
  selector: 'app-tools',
  templateUrl: './tools.component.html',
  styleUrls: ['./tools.component.css']
})
export class ToolsComponent implements OnInit {

  public faSortAmountDown = faSortAmountDown;
  public faSortAmountUp = faSortAmountUp;
  public faCaretLeft = faCaretLeft;
  public faCaretRight = faCaretRight;
  public faUndo = faUndo;

  public searchForm: FormGroup;

  constructor(private articlesService: ArticlesService, private favoriteArticlesService: FavoriteArticlesService) {
    this.searchForm = new FormGroup({
      numberOfResults: new FormControl(sessionStorage.getItem('numberOfResults') || 20),
      sortBy: new FormControl(sessionStorage.getItem('sortBy') || "publishedAt"),
      order: new FormControl(sessionStorage.getItem('order') || "DESC"),
      page: new FormControl(parseInt(<string>sessionStorage.getItem('page')) || 1)
    })
  }

  ngOnInit(): void {
  }

  updateFormStateAndSearch() {
    this.saveToStorage()
    this.createParametersList();
  }

  saveToStorage() {
    sessionStorage.setItem('numberOfResults', this.searchForm.value.numberOfResults);
    sessionStorage.setItem('sortBy', this.searchForm.value.sortBy);
    sessionStorage.setItem('order', this.searchForm.value.order);
    sessionStorage.setItem('page', this.searchForm.value.page);
  }

  createParametersList() {
    return new HttpParams()
      .set('_limit', this.searchForm.value.numberOfResults)
      .set('_sort', `${this.searchForm.value.sortBy}:${this.searchForm.value.order}`)
      .set('_start', this.searchForm.value.page);
  }

  incrementPage() {
    this.searchForm['controls']['page'].setValue(this.searchForm.value.page + 1);
  }

  decrementPage() {
    const page = this.searchForm.value.page;
    this.searchForm['controls']['page'].setValue(page <= 1 ? 1 : page - 1);
  }

  reset() {
    this.searchForm = new FormGroup({
      numberOfResults: new FormControl(20),
      sortBy: new FormControl("publishedAt"),
      order: new FormControl("DESC"),
      page: new FormControl(1)
    })
    this.updateFormStateAndSearch();
  }

}
