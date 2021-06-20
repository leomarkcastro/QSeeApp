import React from "react"

import { 
    IonPage, 
    IonContent, 
    IonListHeader, 
    IonIcon, 
    IonInput, 
    IonLabel, 
    IonItem, 
    IonButton, 
    IonText, 
    IonList,
    IonFab,
    IonFabButton
} from '@ionic/react';
import { bookOutline, qrCode,add  } from 'ionicons/icons';

import style from "./Contacts.module.css"

import { data_hook, hookAccount } from "../../utility/Firebase/firebaseMain"


class Contacts extends React.Component {

    constructor(props){
        super(props)
        
        this.state = {
            following: [],
            request: [],
            account: null,
        }

        hookAccount(
            (e) => {
                this.setState({...this.state, account: e})
                if (e){
                    data_hook("connect", e.uid, (d) => {
                        let data = d.data()
                        console.log(d)
                        this.setState({
                            ...this.state,
                            following: data.following,
                            request: data.request
                        })
                    }, )
                }
            }
        )
        
    }

    render(){
        return (
            
            <IonPage>
            
                <IonContent>

                    <img src="https://www.marketplace.org/wp-content/uploads/2021/04/CM4.png?fit=740%2C535" alt=""  />

                    <IonList mode="ios">
                        <IonListHeader>
                            <IonLabel>Request</IonLabel>
                        </IonListHeader>

                        {
                            this.state.request?.map((e,i)=> {
                                return(
                                    <IonItem key={`req_${i}`} button>
                                        <IonLabel>{e.split('|+|')[0]}</IonLabel>
                                    </IonItem>
                                )
                            })
                        }

                        <IonListHeader>
                            <IonLabel>Following</IonLabel>
                        </IonListHeader>

                        {
                            this.state.following?.map((e,i)=> {
                                return(
                                    <IonItem key={`following_${i}`} button routerLink={`/locate/${this.state.account.uid}/${e.split('|+|')[1]}/${e.split('|+|')[0]}`}>
                                        <IonLabel>{e.split('|+|')[0]}</IonLabel>
                                    </IonItem>
                                )
                            })
                        }
                        
                        
                    </IonList>

                    <IonFab vertical="bottom" horizontal="end" slot="fixed">
                        <IonFabButton routerLink="/scan">
                            <IonIcon icon={add} />
                        </IonFabButton>
                    </IonFab>


                </IonContent>
                
            </IonPage>
            
        )
    }
    
}

export default Contacts