import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { RootLayout } from '../pages/layout/RootLayout';
import { MainPage } from '../pages/main/MainPage';
import { CAdminPage } from '../pages/cadmin/CAdminPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      {
        path: '',
        element: <MainPage />,
      },

      {
        path: 'cadmin/:id',
        element: <CAdminPage />,
      },
    ],
  },
]);

export function RouteProvider() {
  return <RouterProvider router={router} />;
}
