import applicationModel from '../lib/db-models/application.js';
import apiUtils from "../lib/utils/apiUtils.js";

export default (api) => {
  const basePath = '/application';

  api.post(basePath, async (req, res) => {
    const result = await applicationModel.create(req.body);
    if ( apiUtils.returnIfModelError(req, res, result, 'Unable to create application record') ) return;
    res.json(result);
  });


};
