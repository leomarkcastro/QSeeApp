import React from "react"
import { BarcodeScanner } from '@ionic-native/barcode-scanner'

import { 
    IonPage, 
    IonContent, 
    IonTitle, 
    IonToolbar,
    IonButtons,
    IonButton,
    IonBackButton,
    IonSpinner,
    IonHeader
} from '@ionic/react';

import style from "./QRScan.module.css"

import { Capacitor } from "@capacitor/core";

import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner'

import { data_array_update, data_array_updatev2, data_read, hookAccount } from "../../utility/Firebase/firebaseMain";

class QRScan extends React.Component {

    constructor(props){
        super(props)

        this.state = {
            display : "No Account Detected Yet",
            success: false ,
            account: null,
            currentPartner: null,
            currentPartEmail: null,
        }
        
        hookAccount((e)=> {this.setState({...this.state, account: e})})
    }

    async scanQR(){
        let result = await this.startScan()
        if (result.includes("qrMapCode")){
            let code = result.split('|+|')[1]
            let data = await data_read(code, 'profile')
            console.log(code)
            this.setState({
                ...this.state, 
                display:data.email, 
                success:true, 
                currentPartner:code,
                currentPartEmail:data.email
            })
        }else{
            this.setState({...this.state, display:"Invalid QR Map Code Scanned. Try Again"})
        }
    }

    sendRequest(){
        
        data_array_update(this.state.currentPartner, `${this.state.account.email}|+|${this.state.account.uid}`, "requests")
        data_array_updatev2(this.state.account.uid, "allowed", this.state.currentPartner, "connect")
        data_array_updatev2(this.state.account.uid, "request", `${this.state.currentPartEmail}|+|${this.state.currentPartner}`, "connect")
        console.log('done')
    }

    async startScan (){
        if (Capacitor.isNativePlatform()){
            try{
                let sc = await BarcodeScanner.scan({
                    showFlipCameraButton : true, // iOS and Android
                    prompt : "Place a barcode inside the scan area", // Android
                    formats : "QR_CODE", // default: all but PDF_417 and RSS_EXPANDED
                })
                return sc.text

            }catch(err){
                console.log('Error', err)
            }
        }else{
            //return "qrMapCode|+|NlafjztIbGfbKaV9mVrMrHBQr483"
            return prompt("Scanned Value")
        }
        
    }

    componentDidMount(){
        this.scanQR()
    }

    render(){
        return (
            
            <IonPage>
                <IonHeader>
                    <IonToolbar color="secondary">
                        <IonTitle>QR Code Scan</IonTitle>
                        <IonButtons slot="start">
                            <IonBackButton defaultHref="/home"/>
                        </IonButtons>
                    </IonToolbar>
                </IonHeader>
                
            
                <IonContent>

                    <div className={style.account}>
                        {this.state.success ? <p>Detected Account belonging to</p> : <></>}
                        <h1>{this.state.display}</h1>
                        {!this.state.success ? <p>An email address should appear here indicating the detected account based on the scanned QR Code</p> : <></>}
                    </div>
                    <div className={style.actions}>
                        {this.state.success ? <IonButton onClick={this.sendRequest.bind(this)}>Send Follow Request</IonButton> : <></> }
                        <IonButton onClick={this.scanQR.bind(this)}>Do Rescan Again</IonButton>
                    </div>

                </IonContent>
                
            </IonPage>
            
        )
    }
    
}

export default QRScan