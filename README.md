# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

# Libraries used to build the project.

1. Leaflet library - to show the Map.
2. GeoLocation API - fetch the lat and lng from the Map.

# Things learnt while building the Project.

1. React Router

- what we do while Routing is Match different routes to different components so that client-side rendering happens
- routing is used to build single-page applications(SPA's).
- SPA's are applications that execute entirely on the client i.e browser.
  and Routes are different URL's corrosponding to different views
- how it works.
  - user clicks on link
  - this changes the url
  - change in url causes change in DOM by react router.
  - Only the DOM or JS is updated, not the entire website. Hence the page is not reloaded. Thus, saves time.
  - When fetching data from an external server, the data in the component gets updated

2. CSS Modules

   - It is creating one external CSS file per component.
   - markup defined are only applied to that particular component for which it is defined.

3. Nested Routes

- used when you want to control a part of the UI by a part of the URL.
- Index route is the default route that gets displayed when none of the routes are not present.

4. Storing state in URL/Dynamic routing

- It is routing that takes place while your app is rendering.

- used to store UI State like closing/opeing of panel, applied sorting filter, currently selected list item.
- why?
  1. Easy way to store data globally which needs to be used by many components. If used the alternate approach, i.e calling useState() in the app component, then we have to use other methods such has prop drilling etc to share the common data used btw components.
  2. Can also easily pass data from one page to another.
  3. Easy to share or bookmark the page containing the exact data so that we can use it in a later time.

how to use URL to store state:

# fetching data from the path parameter.

1. define a route in App() and name a parameter for which you want to render a component.
2. Use a link in the component which has to render a particular component based on the route and update the parameter.[storing the state in URL]
3. Use useParam() hook provided by the react-router-dom to fetch the data updated by the previous link clicked and fetch the data from the parameter.

# fetching data from the query string.

1. define a route in App() and name a parameter for which you want to render a component.
2. Use a link in the component which has to render a particular component based on the route and update the query string using '?variableName' and use '&' to seperate different variables.[storing the state in URL].
3. Use useSearchParam() hook to fetch the data in query string and use a getter(variableName) to fetch the data in the url using queryString.

difference btw path parameters and query string.

1. Usage: path parameters are used to identify a specific resource or a page while query strings are used to sort and filter resourses in the page.

- Path parameters can NOT be ommited since they change the path URL and the required resource or the page wont load up, while queryStrings can be ommited since they are not a part of the URL.

2. Syntax: path parameters to the left of question mark and queryStrings to the right.

# Programatic Navigation

- user can move to a different URL without clicking any link.
- useCase: after submitting a form going to a new page.

we use useNavigate() hook provided by react-route-dom. This hook give a navigate function through which you just have to pass the route to where you have to travel as the argument.
This is the IMPERATIVE way.

The DECLARATIVE way is to use <Navigate /> component provided by react-router-dom.
It is not used so much recently but we use that in nested routes.

- if you provide '-1' are the argument to the navigate function then its gonna go one page back.

# Ways to Manage State.

- State can be divided into Local State and Global State based on which component is using the state. i.e, ACCESSIBILITY

  - Local State --> Used by a particular component and its children.
  - Global State --> Used by every component in the application.

- They can again be divided into Remote State and UI state based on the domain for which it is used for.
  - Remote State --> The state data that is loaded from the remote server or fetched from an API call.
  - They are core application Data.
  - UI state --> The state used to capture UI changes.
