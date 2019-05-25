# Contributing to DnD List

The commands mentioned on this page are defined in the `package.json` file.

## Dev dependencies

```bash
npm install
```

## New example

You can try out a new example to the `experiments/Main.elm`, and run the `elm-live` dev server with the following command:

```bash
npm run watch:exp
```

## GitHub Pages Enhancements

The `examples` folder is the source of the `docs` folder:

- the `examples/index.html` and the `docs/index.html` are NOT the same, they are maintained separately
- the `examples/assets` will be copied to `docs/assets`

You can make modificaitons on the `examples` folder, and run the `elm-live` dev server:

```bash
npm run watch
```

Running `elm-analyse`:

```bash
npm run analyse
```

## Package Enhancements

In order to check your improvements made on the package source with possible API changes, you can create an adequate example in the `experiments/Main.elm`:

```bash
npm run watch:exp
```

If you have some tests:

```bash
npm test
```

You can check the package documentation:

```bash
npm run watch:doc
```

&nbsp;

:large_orange_diamond: :small_orange_diamond: :large_orange_diamond: :small_orange_diamond: :large_orange_diamond: :small_orange_diamond: :large_orange_diamond: :small_orange_diamond: :large_orange_diamond:

Thank you for your contribution!

:large_orange_diamond: :small_orange_diamond: :large_orange_diamond: :small_orange_diamond: :large_orange_diamond: :small_orange_diamond: :large_orange_diamond: :small_orange_diamond: :large_orange_diamond:
