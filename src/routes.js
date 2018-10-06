import nextRoutes from 'next-routes';

const routes = nextRoutes();

routes
  .add('faq')
  .add('contribuer')
  .add('city', '/villes/:city')
  .add('list', '/villes/:city/:listname')
  .add('index', '/')

export default routes;

export const { Link, Router } = routes;
