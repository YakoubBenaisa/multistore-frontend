import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import "swiper/swiper-bundle.css";
import "simplebar-react/dist/simplebar.min.css";
import { AppWrapper } from './Store/shared/components/containers/PageMeta.tsx';
import { Provider } from 'react-redux';
import { store } from './states/store.ts';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <AppWrapper>
        <App />
      </AppWrapper>
    </Provider>
  </StrictMode>
);
