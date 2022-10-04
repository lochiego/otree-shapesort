# oTree Shape Sort

This is the SvelteKit project for the javascript portion of Shape Sort. It allows provides tie-ins to change the size, and sort scheme (color vs shape). This must be built in order to run from the oTree page.

To package the web app in the otree app, you'll need to first build it, copy the `build/_app` folder to the oTree app, and update the twig template's script tags accordingly based on what is output in `app.html`. The regex `/"\./(.*?)"/` will help with replacement string `"{{ static 'shapesort/$1' }}"`

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To package the app into the otree page, you'll need to do several steps:

### 1: Prepare the build folder

Delete the `shapesort-dummy/shapesort/static/shapesort` folder.

### 2: Build the web app

```bash
npm run build
```

This builds the app into the `shapesort-dummy/shapesort/static/shapesort` folder, which is where static otree files are to be placed.

### 3: Update imports

From `shapesort-dummy/shapesort/static/shapesort/index.html` you should copy the `<link>` tags and set them in the ShapeSort page template's `styles` block. Then copy the `<script>` tag and place it within a `scripts` block.

### 4: Correct link URLs

Lastly, you need to adjust the relative file URIs to include the otree static asset path. For simplicity, use regex search `"\./(.*?)"` with `"{{ static 'shapesort/$1' }}"`
