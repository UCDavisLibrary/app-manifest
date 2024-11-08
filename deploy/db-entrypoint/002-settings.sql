-- This file is used to register settings for the application.
INSERT INTO "settings" ("key", "value", "label", "description", "default_value", "use_default_value", "input_type", "categories")
VALUES ('global.banner.text', '', 'Site-wide banner text', 'If a value is entered, a banner will appear beneath the main nav.', NULL, '0', 'textarea', '{adminSettings, appGlobal}');

INSERT INTO "settings" ("key", "value", "label", "description", "default_value", "use_default_value", "input_type", "categories")
VALUES ('global.banner.color', '', 'Site-wide banner color', 'The brand color that will be the background color of the site-wide banner', 'double-decker', '1', 'text', '{adminSettings, appGlobal}');
