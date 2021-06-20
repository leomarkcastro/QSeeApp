import { Redirect, Route } from 'react-router-dom';
import { IonIcon, IonLabel, IonRouterOutlet, IonTabBar, IonTabButton, IonTabs } from '@ionic/react';
import { person, people } from 'ionicons/icons';

import Profile from '../Profile/Profile';
import Contacts from '../Contacts/Contacts';

import style from "./Home.module.css"

const Home = props => {

    return(
        <Route path={props.path}>

            <IonTabs>

                <IonRouterOutlet animated={false}>
                    <Route exact path="/home/home" component={Profile}/>
                    <Route exact path="/home/contacts" component={Contacts}/>
                    
                    < Redirect from="/home" to="/home/home" exact/>
                </IonRouterOutlet>

                <IonTabBar slot="bottom" defaultValue="home">


                    <IonTabButton tab="home" href="/home/home">
                        <IonIcon icon={person} />
                        <IonLabel>You</IonLabel>
                    </IonTabButton>

                    <IonTabButton tab="contact" href="/home/contacts">
                        <IonIcon icon={people} />
                        <IonLabel>Contacts</IonLabel>
                    </IonTabButton>

                </IonTabBar>

            </IonTabs>

        </Route>
    )
    
};

export default Home;
