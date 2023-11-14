<p align="center">
  <a href="https://codecov.io/gh/librark/routark">
    <img src="https://codecov.io/gh/librark/routark/graph/badge.svg?token=lrTCF0g58T"/>
  </a>
</p>
<p align="center">
  <a href="https://codecov.io/gh/librark/routark">
    <img src="https://codecov.io/gh/librark/routark/graphs/sunburst.svg?token=lrTCF0g58T"/>
  </a>
</p>

# Routarkjs

Single Page Application Router

## Installation

Install Routark using [`npm`](https://www.npmjs.com/package/@librark/routark):

```bash
npm install @librark/routark
```

## Getting Started

Routark is a *client-side router* designed to be incorporated in *single page
applications (SPAs)*, especially those using [Web Component](
https://developer.mozilla.org/en-US/docs/Web/API/Web_components).

To use it in your application, you first need to create a *Routark* instance,
and then add the routes you are willing to react to when visited:

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

## Why Routark?

Routark is a simple and versatile client-side router with *zero dependencies*.
It is *framework agnostic* and limits itself to provide a friction-less
mechanism for invoking asynchronous *action* handlers when a certain route
is loaded on the browser. So, if you are manipulating the DOM directly through
*Vanilla Javascript* (e.g. using *custom elements*), you might find out that
Routark is all you need for your client-side navigation!

## License

  [MIT](LICENSE)
