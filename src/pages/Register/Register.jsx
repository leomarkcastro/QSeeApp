import React from "react"

import { IonPage, IonContent, IonHeader, IonIcon, IonSpinner, IonInput, IonLabel, IonItem, IonButton, IonText } from '@ionic/react';
import { bookOutline, qrCode,  } from 'ionicons/icons';

import style from "./Register.module.css"

import { data_write, registerUser } from "../../utility/Firebase/firebaseMain"

import Logo from "../../components/Logo/Logo";

class Register extends React.Component {

    constructor(props){
        super(props)
        
        this.state = {
            email: "",
            password: "",
            error: "",
        }
    }

    changeValue(whatvar, e){
        const st = {...this.state}
        st[whatvar] = e.detail.value
        this.setState(st)
    }

    async register(){
        await registerUser(this.state.email, this.state.password, this.registerResult.bind(this))
    }

    registerResult(e){
        if (e.user){
            data_write(`${e.user.uid}`, {requests: []}, 'requests')
            data_write(`${e.user.uid}`, {email: this.state.email, desc: "", username:""}, 'profile')
            data_write(`${e.user.uid}`, {allowed: [], following: [], request:[]}, 'connect')
            this.props.history.push('/home')
        }
        else{
            console.log(e)
            this.setState({...this.state, error: e.message})
        }
    }

    componentDidMount(){
    }   

    render(){
        return (
            
            <IonPage>
            
                <IonContent>

                    <div className={style.logo}>
                        <Logo />
                    </div>

                    <div className={style.notice}>

                        <h2>Register</h2>

                        <IonItem className={style.input}>
                            <IonLabel position="floating">Email</IonLabel>
                            <IonInput type="email" value={this.state.email} placeholder="Enter Input" onIonChange={this.changeValue.bind(this,"email")}></IonInput>
                        </IonItem>
                        <IonItem className={style.input}>
                            <IonLabel position="floating">Password</IonLabel>
                            <IonInput type="password" value={this.state.password} placeholder="Enter Input" onIonChange={this.changeValue.bind(this,"password")}></IonInput>
                        </IonItem>
                        <IonText color="danger" className={style.warning}>
                            <sub>{this.state.error}</sub>
                        </IonText>
                        <IonButton style={{width:"100%"}} onClick={this.register.bind(this)}>Register</IonButton>
                        <IonButton fill="clear" color="tertiary" style={{width:"100%"}} routerLink="/home">Go back to Login</IonButton>

                    </div>
                    

                </IonContent>
                
            </IonPage>
            
        )
    }
    
}

export default Register