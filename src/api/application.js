import applicationModel from '../lib/db-models/application.js';
import apiUtils from "../lib/utils/apiUtils.js";
import objectUtils from '../lib/utils/objectUtils.js';

export default (api) => {
  const basePath = '/application';

  api.post(basePath, async (req, res) => {
    const result = await applicationModel.create(req.body);
    if ( apiUtils.returnIfModelError(req, res, result, 'Unable to create application record') ) return;
    res.status(201).json(result);
  });

  api.get(basePath, async (req, res) => {
    const query = objectUtils.camelCaseKeys(req.query);
    const result = await applicationModel.query(query);
    if ( apiUtils.returnIfModelError(req, res, result, 'Unable to query application records') ) return;
    res.json(result);
  });

  api.get(`${basePath}/:id`, async (req, res) => {
    if ( apiUtils.return404IfMissingId(res, req.params.id, 'Application does not exist') ) return;
    const result = await applicationModel.query({applicationId: req.params.id, includeArchived: true});
    if ( apiUtils.returnIfModelError(req, res, result, 'Unable to get application record') ) return;
    if ( !result.data.length ) {
      return apiUtils.return404(res, 'Application does not exist');
    }
    res.json(result.data[0]);
  });

  api.put(`${basePath}/:id`, async (req, res) => {
    if ( apiUtils.return404IfMissingId(res, req.params.id, 'Application does not exist') ) return;
    req.body.applicationId = req.params.id;
    const result = await applicationModel.update(req.body);
    if ( apiUtils.returnIfModelError(req, res, result, 'Unable to update application record') ) return;
    res.json(result);
  });

  api.delete(`${basePath}/:id`, async (req, res) => {
    if ( apiUtils.return404IfMissingId(res, req.params.id, 'Application does not exist') ) return;
    const result = await applicationModel.delete(req.params.id);
    if ( apiUtils.returnIfModelError(req, res, result, 'Unable to delete application record') ) return;
    res.json(result);
  });


};
