# oTree Shape Sort

This is the SvelteKit project for the javascript portion of Shape Sort. It allows provides tie-ins to change the size, and sort scheme (color vs shape). This must be built in order to run from the oTree page.

To package the web app in the otree app, you'll need to first build it, copy teh `build/_app` folder to the oTree app, and update the twig template's script tags accordingly based on what is output in `app.html`.

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

