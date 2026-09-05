import { type RouteObject } from 'react-router-dom';

import App from '../App';

// Modules Imports
import AuthRoutes from '../modules/auth/routes';
import AdminRoutes from '../modules/admin/routes';
import LandingRoutes from '../modules/landing/routes';
import ProfileRoutes from '../modules/profile/routes';
import ErrorRoutes from '../modules/errors/routes';
import CommonRoutes from '../modules/common/routes';
import CustomerRoutes from '../modules/customer/routes';

/**
 * `CommonRoutes` sits beside the audience modules rather than inside them.
 * Landing is guest-only, so nesting the company pages there was what forced the
 * guard to special-case them; as a public sibling they need no exception.
 */
export const routes: RouteObject[] = [{
    path: '/',
    element:  <App />,
    children: [
        LandingRoutes,
        AuthRoutes,
        CommonRoutes,
        CustomerRoutes,
        ProfileRoutes,
        AdminRoutes,
        // Last: the catch-all lives here, and a reader who matches nothing else
        // gets a 404 page rather than a blank 200.
        ErrorRoutes,
    ],
}];
