import { Redirect, Route } from 'react-router-dom';
import {
  IonApp,
  IonRouterOutlet,
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';

import Home from './pages/Home/Home';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import Initializer from './pages/Initializers/Initializer';
import QRPage from './pages/QRPage/QRPage';
import QRScan from './pages/QRScan/QRScan';
import LocatePartner from './pages/LocatePartner/LocatePartner';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';

const App = () => (
  <IonApp>
      <IonReactRouter>

        <IonRouterOutlet>

          <Home path="/home"/>

          <Route exact path="/init" component={Initializer} />
          <Route exact path="/login" component={Login} />
          <Route exact path="/register" component={Register} />
          <Route exact path="/qr" component={QRPage} />
          <Route exact path="/scan" component={QRScan} />
          <Route exact path="/locate/:you/:partner/:partneremail" component={LocatePartner} />

          <Redirect from="/" to="/init" exact/>

        </IonRouterOutlet>

      </IonReactRouter>
  </IonApp>
);

export default App;
