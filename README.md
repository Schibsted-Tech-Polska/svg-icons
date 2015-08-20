# SVG ICONS

This project is a _proof of concept_ illustrating how you can take multiple SVG images and use them as icons as a background image on `::before` pseudo-elements.
You can find more information about the project in a blog post on http://schibsted.pl/blog

## How to use

### Installation

Just clone the repo and run `npm install`. 
It should automatically build the example after NPM installs it dependencies.

### Grunt configuration

There are two files you should edit:
- `config.js` - contains all the colors you want to use and the proportions for icons

Icons in SVG should be placed in `src/images`. They should have round proportions, e.g. 1:1, 1.5:1, 2:1, etc.

If you change the number of colors and/or their names you need to modify the background-position rules located in `src/styles.scss`.

### Implementation

Run `grunt` which will generate the necessary SCSS spreadsheet. You can find it in `dist/`. 

Import the generated SCSS file (`@import 'path/to/svg-icons.scss'`) and then extend class names based on the icon name.

Sample implementation for elements with classes matching the selector `[class^="icon-"]` or `[class^="i-"]`

```
.icon-something {
  @extend .icon-arrow-up;
}
```

To change the color:

```
.icon-something {
  @extend .icon-arrow-up;
  @extend %white;
}
```

If the element's class doesn't match any of the mentioned selectors just extend the base %icon placeholder.

```
.category-label {
  @extend %icon;
  @extend .icon-arrow-right;
}
```

Icons width and height properties are in `em` so the easiest way to adjust the size is to change the `font-size`.

#### Media queries 
To change the icon in media queries instead of extending the %icon just use `@include icon();`.

## Fair warning

This **is** very rough.

## Todo
- Custom colors for specific icons