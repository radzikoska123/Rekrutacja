import {Injectable} from '@angular/core';
import {BehaviorSubject} from "rxjs";
import {ArticleDataService} from "../../common/services/article-data.service";
import {Article} from "../../common/interfaces/article";

@Injectable({
  providedIn: 'root'
})
export class FavoriteArticlesService {
  private static FAVORITES_LOCAL_STORAGE_KEY = "favorites";

  public favoriteArticles: BehaviorSubject<Article[]>
  public favoriteArticlesIDs: BehaviorSubject<number[]>

  constructor(private articlesDataService: ArticleDataService) {
    this.favoriteArticles = new BehaviorSubject<Article[]>([]);
    this.favoriteArticlesIDs = new BehaviorSubject<number[]>(FavoriteArticlesService.getFavoritesFromLocalStorage());

    this.favoriteArticlesIDs.subscribe({
      next: (value: number[]) => FavoriteArticlesService.saveFavoritesToLocalStorage(value),
    });
  }

  public getFavoriteArticles(): void {
    this.articlesDataService.getFavoritesArticles(this.favoriteArticlesIDs.getValue()).subscribe(response => {
      this.favoriteArticles.next(response);
    })
  }

  public addArticleToFavorites(articleId: number): void {
    this.favoriteArticlesIDs.next([...this.favoriteArticlesIDs.getValue(), articleId]);
  }

  public removeArticleFromFavorites(articleId: number): void {
    this.favoriteArticlesIDs.next(this.favoriteArticlesIDs.getValue().filter(id => id != articleId));
  }

  public isFavoriteArticle(articleId: number): boolean {
    return this.favoriteArticlesIDs.getValue().includes(articleId);
  }

  public toggleFavorite(isFavorite: boolean, articleId: number) {
    isFavorite ? this.removeArticleFromFavorites(articleId) : this.addArticleToFavorites(articleId);
    return !isFavorite;
  }

  // localstorage manipulation=========================================
  private static saveFavoritesToLocalStorage(articlesIDs: number[]) {
    localStorage.setItem(FavoriteArticlesService.FAVORITES_LOCAL_STORAGE_KEY, JSON.stringify(articlesIDs))
  }

  private static getFavoritesFromLocalStorage() {
    let data = localStorage.getItem(FavoriteArticlesService.FAVORITES_LOCAL_STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  }
}