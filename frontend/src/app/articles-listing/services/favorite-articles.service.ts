import {Injectable} from '@angular/core';
import {BehaviorSubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class FavoriteArticlesService {
  private static FAVORITES_LOCAL_STORAGE_KEY = "favorites";

  public favoriteArticlesIDs: BehaviorSubject<number[]>

  constructor() {
    this.favoriteArticlesIDs = new BehaviorSubject<number[]>(FavoriteArticlesService.getFavoritesFromLocalStorage());

    this.favoriteArticlesIDs.subscribe({
      next: (value: number[]) => FavoriteArticlesService.saveFavoritesToLocalStorage(value),
    });
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

  public hasFavorites(){
    return this.favoriteArticlesIDs.getValue().length > 0;
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