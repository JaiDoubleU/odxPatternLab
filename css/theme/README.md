theme
=====

This project contains the default Oildex Theme. It also contains custom themes for customers.

This project is a custom build of Twitter Bootstrap. It should be used INSTEAD OF stock Twitter Bootstrap in your app.

Your customizations (in `variables.less` and `bootswatch.less`) are merged with Twitter Bootstrap to create a custom `bootstrap.css` file.

## Usage

To use the Oildex theme in another web project:

1. Type `bower install git@github.transzap.com:oildex/theme.git --save`
1. For CSS, use `bower_components/theme/oildex/bootstrap.css` (NOTE: Swap out `oildex` with `[custom theme directory]` for an alternate theme.)
1. For Bootstrap, use the common `bower_components/theme/assets/js/bootstrap.js` for ALL themes
1. For Bootswatch, use the common `bower_components/theme/assets/js/bootswatch.js` for ALL themes. (NOTE: Be sure to load `bootswatch.js` AFTER `bootstrap.js`. This file is required for the custom theme.)


## Local Development

Setup:

1. Ensure node >= 0.12.x is installed
1. Type `npm install` to install dependencies
1. Type `grunt` to build all themes (or `grunt build:oildex` to build an individual theme)

## Create a custom theme

Follow these steps to create a new, custom theme for the Gusher customer.

1. `cp -r oildex gusher`
1. Add `gusher{}` to the comma-delimited `swatch:{}` object in `Gruntfile.js`
1. Add simple changes to `variables.less` (colors, fonts, etc.)
1. Add structural changes to `bootswatch.less` (buttons, form elements, etc.)
1. Type `grunt` to build all themes (or `grunt build:gusher` to build this theme)
1. View `gusher/index.html` in a browser for a preview of your customizations
1. Ensure you add the theme to the Jenkins file so that it gets copied into the npm registry. Look for stage:build.
1. Add the new theme folder to package.json for npm pack.


## View Themes

View the themes in your browser:

| Theme  | Notes |
|:-------|:------|
| [Oildex](oildex/index.html) | This is the default theme for Oildex apps.
| [Enverus](enverus/index.html) | This is the new theme.


## Switching branches through bower

In every projects' ~/bower.json file there are some declarations which integrate
with github to allow you to test changes to different branches prior to merging into develop.

The pertinent lines in bower.json are:
    "theme": "git@github.transzap.com:oildex/theme.git#develop",
    "oildex-components": "git@github.transzap.com:oildex/components.git#develop"

The syntax is: FORK/PROJECT.git#BRANCH

To test staged changes locally prior to merging into develop:
    1. Commit the changes to your forked branch
    2. Open the project(s) bower.json and update to the dependencies to point to your changes instead of oildex/PROJECT.git#develop
    3. In terminal execute 'gulp reset && npm install'
        a) Gulp reset removes the node_modules and bower_components folders locally to clear any chached resources
    4. Build the project(s) as usual ('gulp clean build' then 'gulp run').
    5. When the project rebuilds locally bower will acquire fresh resources from the paths in bower.json.
        a) The new resources are placed in bower_components/PROJECT

**NOTE: If your resources are not updating accordingly, try 'bower cache clean'


