
import Home from './pages/landingPage/Home';
import { store } from './states/store';
import { Provider } from 'react-redux';
function App() {
  return (
    <Provider store={store}>
      <Home/>
    </Provider>
  )
}



export default App;