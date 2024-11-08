/**
 * @description Bundles are groups of pages that will be dynamically loaded
 * if a user requests that page.
 * The object key refers to the bundle file name (without the .js extension)
 * The array value is a list of page ids that are in that bundle.
 */
const defs = {
  all : [
    'home', 'app-register', 'app-landing'
  ],
  admin: [
    'admin-home', 'admin-settings'
  ]
};

export default defs;
