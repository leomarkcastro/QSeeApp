import React from "react"

import QRCode from "react-qr-code";
 
import { 
    IonPage, 
    IonContent, 
    IonTitle, 
    IonToolbar,
    IonButtons,
    IonBackButton,
    IonSpinner
} from '@ionic/react';

import style from "./QRPage.module.css"

import { loginUser } from "../../utility/Firebase/firebaseMain"

import { hookAccount } from "../../utility/Firebase/firebaseMain";


class QRPage extends React.Component {

    constructor(props){
        super(props)

        this.state = {
            qrDOM : null,
            account : null
        }

        hookAccount((e) => {this.setState({...this.state, account:e})})
        
    }

    componentDidMount(){
    }

    render(){
        return (
            
            <IonPage>

                <IonToolbar color="secondary">
                    <IonTitle>QR Code Page</IonTitle>
                    <IonButtons slot="start">
                        <IonBackButton defaultHref="/home"/>
                    </IonButtons>
                </IonToolbar>
            
                <IonContent>
                    <div className={style.qr}>
                        {
                            this.state.account ?
                            <QRCode value={this.state.account ? `qrMapCode|+|${this.state.account.uid}` : "null"} size={Math.ceil(window.innerWidth*0.8)}/>
                            :
                            <IonSpinner/>
                        }
                        
                    </div>
                    <div className={style.text}>
                        <p>On other device, click Connect Tab, then click the Plus Button. It will open a QR Scanner that can scan this code and redirect your partner to send a follow request to your phone</p>
                    </div>
                    


                </IonContent>
                
            </IonPage>
            
        )
    }
    
}

export default QRPage