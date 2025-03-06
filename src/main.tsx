import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import {AppWrapper} from './shared/containers/PageMeta.tsx';
import { Provider } from 'react-redux';
import { store } from './redux/store.ts';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <AppWrapper >
        <App />
      </AppWrapper>
    </Provider>
  </StrictMode>
);
