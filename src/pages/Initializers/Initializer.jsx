import React from "react"

import { IonPage, IonContent, IonHeader, IonIcon, IonSpinner } from '@ionic/react';
import { bookOutline, qrCode,  } from 'ionicons/icons';

import style from "./Initializer.module.css"

import { Capacitor } from "@capacitor/core";
import { Geolocation } from '@capacitor/geolocation';

import LocationService from "../../utility/LocationService/Location";

import { hookAccount } from "../../utility/Firebase/firebaseMain";

import Logo from "../../components/Logo/Logo";

class Initializer extends React.Component {

    constructor(props){
        super(props)
        
        this.state = {
            user : null,
        }

        hookAccount((e)=>{this.setState({...this.state, user:e})})
    }

    async printCurrentPosition(){
        let permission_active = true
        let permission_gps = true
        if (Capacitor.isNativePlatform()){
            if(!await LocationService.checkGPSPermission()){
                let permission_gps = await LocationService.requestGPSPermission()
            }
            permission_active = await LocationService.askToTurnOnGPS()
        }

         
        
    
        /*const coordinates = await Geolocation.getCurrentPosition();
        console.log('Current position:', coordinates);*/

        console.log(`GPS ON: ${permission_active} || CheckGPS Perm: ${permission_gps}`)

        if (permission_active && permission_gps){
            if (this.state.user) this.props.history.push("/home")
            else this.props.history.push("/login")
        }
        else{
            console.log('error')
        }
    }

    componentDidMount(){
        setTimeout(this.printCurrentPosition.bind(this), 1500)
        
    }   

    render(){
        return (
            
            <IonPage>
            
                <IonContent>

                    <div className={style.logo}>
                        <Logo />
                    </div>

                    <div className={style.notice}>
                        <p>Make sure your internet and gps tracking service is on before proceeding</p>
                        <p>Activating GPS Service</p>
                        <sub><IonSpinner name="dots" /></sub>
                    </div>
                    

                </IonContent>
                
            </IonPage>
            
        )
    }
    
}

export default Initializer