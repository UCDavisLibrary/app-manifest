import applicationModel from '../lib/db-models/application.js';
import apiUtils from "../lib/utils/apiUtils.js";
import objectUtils from '../lib/utils/objectUtils.js';

export default (api) => {
  const basePath = '/application';

  api.post(basePath, async (req, res) => {
    const result = await applicationModel.create(req.body);
    if ( apiUtils.returnIfModelError(req, res, result, 'Unable to create application record') ) return;
    res.json(result);
  });

  api.get(basePath, async (req, res) => {
    const query = objectUtils.camelCaseKeys(req.query);
    const result = await applicationModel.query(query);
    if ( apiUtils.returnIfModelError(req, res, result, 'Unable to query application records') ) return;
    res.json(result);
  });

  api.get(`${basePath}/:id`, async (req, res) => {
    if ( apiUtils.returnIfMissingId(res, req.params.id, 'Application does not exist') ) return;
    const result = await applicationModel.query({applicationId: req.params.id});
    if ( apiUtils.returnIfModelError(req, res, result, 'Unable to get application record') ) return;
    if ( !result.data.length ) {
      return apiUtils.return404(res, 'Application does not exist');
    }
    res.json(result.data[0]);
  });


};
