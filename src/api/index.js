import express from 'express';
import config from '../lib/serverConfig.js';

import application from './application.js';
import auth from './auth.js';
import settings from './settings.js';

const router = express.Router();

if ( config.auth.requireAuth ) {
  auth(router);
}

application(router);
settings(router);

export default (app) => {
  app.use(config.apiRoot, router);
}
