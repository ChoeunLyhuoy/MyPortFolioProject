import { isDevMode } from '@angular/core';

// This utility automatically toggles the API URL depending on development vs production mode.
export const API_BASE_URL = isDevMode()
  ? 'http://localhost:3000'
  : 'https://huoy-portfolio-backend-production.up.railway.app'; // Replace this with your actual Railway production URL once deployed!
