import React from "react"

import { IonPage, IonContent, IonHeader, IonIcon, IonSpinner, IonInput, IonLabel, IonItem, IonButton, IonText } from '@ionic/react';
import { bookOutline, qrCode,  } from 'ionicons/icons';

import style from "./Login.module.css"

import { loginUser, hookAccount } from "../../utility/Firebase/firebaseMain"

import Logo from "../../components/Logo/Logo";

class Login extends React.Component {

    constructor(props){
        super(props)
        
        this.state = {
            email: "",
            password: "",
            error: "",
        }

        hookAccount((e) => {
            console.log(e)
            if(e){
                this.props.history.push('/home')
            }
        })
    }

    changeValue(whatvar, e){
        const st = {...this.state}
        st[whatvar] = e.detail.value
        this.setState(st)
    }

    async login(){
        if(await loginUser(this.state.email, this.state.password, this.loginResult.bind(this))){
            this.props.history.push('/home')
        }
    }

    loginResult(e){
        console.log(e)
        this.setState({...this.state, error: e.message})
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

                        <h2>LOG-IN</h2>

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
                        <IonButton style={{width:"100%"}} onClick={this.login.bind(this)}>Log In</IonButton>
                        <IonButton color="tertiary" style={{width:"100%"}} routerLink="/register">Register</IonButton>

                    </div>
                    

                </IonContent>
                
            </IonPage>
            
        )
    }
    
}

export default Login