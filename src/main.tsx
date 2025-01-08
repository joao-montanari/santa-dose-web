import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';

import routers from './router';

import './styles/main.sass';
import { UserProvider } from './UserContext';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <UserProvider>
      <RouterProvider router={routers} />
  </UserProvider>
)
