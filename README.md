<h1 align="center">Routark</h1>
<p align="center">
  <i>Single Page Application Router</i>
</p>
<p align="center">
  <a href="https://www.npmjs.com/package/@librark/routark">
    <img src="https://badgen.net/npm/v/@librark/routark?color=green"/>
  </a>
  <a href="https://codecov.io/gh/librark/routark">
    <img src="https://codecov.io/gh/librark/routark/graph/badge.svg?token=lrTCF0g58T"/>
  </a>
</p>
<p align="center">
  <a href="https://codecov.io/gh/librark/routark">
    <img src="https://codecov.io/gh/librark/routark/graphs/sunburst.svg?token=lrTCF0g58T"/>
  </a>
</p>

## Installation

Install Routark using [`npm`](https://www.npmjs.com/package/@librark/routark):

```bash
npm install @librark/routark
```

## Getting Started

Routark is a *client-side router* designed to be incorporated in *single page
applications (SPAs)*, especially those using [Web Component](
https://developer.mozilla.org/en-US/docs/Web/API/Web_components).

To use it in your application, assuming you are also using a bundler like
[webpack](https://webpack.js.org/) or [vite](https://vitejs.dev/), you first
need to create a *Routark* instance and then add the routes you are willing to
react to:

```javascript
import { Routark } from '@librark/routark'

const router = new Routark()

const prefix = '/'
router.addRoutes(prefix, [
  {
    path: 'about',
    action: async () => {
        document.body.innerHTML = '</h1>About Page</h1>'
    }
  },
  {
    path: 'home',
    action: async () => {
        document.body.innerHTML = '</h1>Home Page</h1>'
    }
  }
])
```

With the previous configuration, Routark will automatically react to several
browser events (e.g. *popstate*), invoking the provided action callbacks when
their corresponding routes get loaded.

Routark can also be used directly in your HTML files as an imported [esm] using
[unpkg]. To try out this functionality, create for example an *index.html* file
inside any directory of your liking (e.g. *static*):

```bash
mkdir static
cd static
touch index.html
```

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <title>Routark</title>
    <script type="importmap">
      {
        "imports": {
          "@librark/routark": "https://unpkg.com/@librark/routark"
        }
      }
    </script>
  </head>
  <body>
    <div id="root">
      <h1>Root</h1>
    </div>
    <script type="module">
      import { Routark } from '@librark/routark'

      const router = new Routark()
      router.addRoutes('/', [
        {
          path: 'about',
          action: async () => {
            console.info('About:Action')
            window.root.innerHTML = `
              <h1>About Page</h1>
              <a href="/home">Go to home</a>
            `
          }
        },
        {
          path: 'home',
          action: async () => {
            console.info('Home:Action')
            window.root.innerHTML = `
              <h1>Home Page</h1>
              <a href="/about">Go to about</a>
            `
          }
        }
      ])
    </script>
  </body>
</html>
```

To serve your file, you might use any web server with support for *Single Page
Applications*. [Live Server](https://www.npmjs.com/package/live-server) is a
suitable option:

```bash
cd static
npx live-server . --entry-file=index.html
```

## Why Routark?

Routark is a simple and versatile client-side router with *zero dependencies*.
It is *framework agnostic* and limits itself to provide a friction-less
mechanism for invoking asynchronous *action* handlers when a certain route is
loaded on the browser. So, if you are manipulating the DOM directly through
*Vanilla Javascript* (e.g. using *custom elements*), you might figure that
Routark is all you need for your client-side navigation!

## License

  [MIT](LICENSE)

<!--Links-->
[esm]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules#importing_modules_using_import_maps
[unpkg]: https://www.unpkg.com/
