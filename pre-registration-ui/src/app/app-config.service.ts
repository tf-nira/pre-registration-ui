import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

/**
 * @description Service responsible for loading and providing application configuration.
 * This service is initialized before the app starts (via APP_INITIALIZER) to ensure
 * configuration is available throughout the application.
 * 
 * The configuration includes:
 * - BASE_URL: The base URL for all API endpoints
 * - PRE_REG_URL: The pre-registration API path
 * 
 * Configuration file location: src/assets/config.json
 */
@Injectable({
  providedIn: 'root'
})
export class AppConfigService {
  private appConfig: any;

  constructor(private http: HttpClient) {}

  /**
   * @description Loads the application configuration from config.json.
   * This method is called during app initialization before any component is loaded.
   * It ensures that BASE_URL and PRE_REG_URL are available for constructing API endpoints,
   * including the UI Schema endpoint.
   * 
   * @returns Promise that resolves when configuration is loaded
   */
  async loadAppConfig() {
    const data = await this.http.get('./assets/config.json').toPromise();
    this.appConfig = data;
  }

  /**
   * @description Returns the loaded application configuration.
   * Used by services like DataStorageService to construct API URLs.
   * 
   * @returns Configuration object with BASE_URL and PRE_REG_URL
   */
  getConfig() {
    return this.appConfig;
  }
}
