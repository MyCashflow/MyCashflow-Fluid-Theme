# Fluid – The MyCashflow Default Theme
This is the developer version of ecommerce platform MyCashflow's Fluid default theme.

Fluid is designed to be an easily customizable framework for web designers working with MyCashflow themes. It contains many developer features that make it simple to customize the default appearance and features of MyCashflow stores.

<span style="color:rgb(31, 107, 63)">**Using Fluid is completely free.**</span>

There is also a separate merchant version of Fluid, which the default, WYSIWYG-customizable MyCashflow system themes are based on. These themes are always available on the MyCashflow admin panel's ***Appearance > Themes*** page.

**Note:** the system themes available by default in MyCashflow stores cannot be downloaded for customization.

## Installing and editing the theme
1. Download the theme's ZIP file here or clone the repository.
2. [Install the theme](https://support.mycashflow.com/fi/kayttoopas/teeman-kayttoon-ottaminen) in your store (create a development version if necessary).
3. Make the necessary changes to the theme.
4. **Recommended:** Use  [`mycashflow-sync`](https://support.mycashflow.com/fi/teemaopas/teematiedostojen-synkronointi-mycashflow-sync-tyokalun-avulla) to synchronize the theme files with your store's file directory.

## Theme settings
The WYSIWYG-customizability of MyCashflow themes is achieved with custom theme settings.

Theme settings enable you, the designer, to provide the merchant with graphical tools to change various aspects of the theme in the MyCashflow theme editor. For example, you could create a setting that enables the merchant to change the title font.

You can see examples of this by fiddling with the default, Fluid-based system themes using the store's [theme editor](https://support.mycashflow.com/fi/kayttoopas/teemojen-asetukset).

The developer version of Fluid doesn't contain as many customizable theme settings as the merchant version. However, you can freely create your own settings and make them available in the store's theme editor.

You can find a few practical examples of theme settings in the theme's `theme.xml` file. Custom settings are defines in the `</ThemeSettings>` element.

## Styles
Fluid's styles are implemented using standard CSS. You can find the theme's stylesheets in the `styles/` folder.

Fluid makes extensive use of [CSS variables](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties) to unify various stylistic elements across the entire theme – fonts and colors, for example.

You can find many of Fluid's CSS variables in the theme's `common/variables.css` file, but others are spread across the rest of the stylesheets as well.

If you need to add your own CSS files to the theme, you can do so in the `helpers/styles.html` file.

## JS plugins
Fluid contains many JavaScript plugins that help you implement various AJAX features in the store, for example. You can find these in the theme's `scripts/plugins` folder.

The store's common plugins are initialized in the `scripts/custom.js` file. 

Plugins specific to the checkout and product page are initialized in the `scripts/checkout.js` and `scripts/product.js` files.

By default all of Fluid's plugins are enabled.

Many of the plugins have different settings that help you to fine-tune the features enabled by them (changing the banner carousel timing, for example). For more information on the plugins and their settings, see the plugin files (further documentation coming soon).

If you decide to develop your own plugins, we recommend you follow the coding conventions of the rest of Fluid's plugins and initialize them along with the others in `scripts/custom.js`.

## Support
For community support on using Fluid you can join the [MyCashflow Partners Slack channel](https://mcf-partners.slack.com).

You can also contact MyCashflow customer support if you have questions about using the theme.