import './index.css';
import App from './App';
import React from 'react';
import router from './routes';
import ReactDOM from 'react-dom/client';
import { store } from './redux/store'
import { Provider } from 'react-redux'
import { RouterProvider } from 'react-router-dom';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router}>
        <App />
      </RouterProvider>
    </Provider>
  </React.StrictMode>
);
