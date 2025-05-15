import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';

import routers from './router';

import './styles/main.sass';
import { UserProvider } from './UserContext';
import { CartProvider } from '@Components/CartContext';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <UserProvider>
      <CartProvider>
      <RouterProvider router={routers} />
      </CartProvider>
  </UserProvider>
)
