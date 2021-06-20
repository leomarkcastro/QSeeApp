import React from "react"

import { 
    IonPage, 
    IonContent, 
    IonHeader, 
    IonItem, 
    IonAvatar, 
    IonLabel, 
    IonButton,
    IonIcon, 
    IonList, 
    IonSpinner, 
    IonAlert,
    IonGrid,
    IonRow,
    IonCol
} from '@ionic/react';

import style from "./Profile.module.css"

import Map from "../../components/Map/Map";

import { hookAccount, logoutUser, location_write, data_hook, data_read, data_array_updatev2, data_array_delete } from "../../utility/Firebase/firebaseMain"
import { qrCode } from "ionicons/icons";

class Profile extends React.Component {

    constructor(props){
        super(props)
        
        this.state = {
            located : false,
            account: "",
            beep: "",

            e_account: null,

            requests: [],
            followers: [],

            popover: false,
            popoverName: "",
            popoverUID: "",
        }

        this.firstLocate = true

        this.delaySwitch = true
        
        hookAccount(this.updateEmail.bind(this))
    }

    popoverSwitch(sw){
        this.setState({...this.state, popover: sw})

        
        console.log(this.state)
    }

    async popoverCall(uid, email){

        console.log(uid, email)
        console.log({...this.state, popoverName: email, popoverUID:uid })

        this.setState({...this.state, popoverName: email, popoverUID:uid, popover: true })

        
    }
    
    time(){
        let currentdate = new Date(); 

        let hour = currentdate.getHours() > 12 ? currentdate.getHours() - 12 : currentdate.getHours() 
        hour = hour == 0 ? 12 : hour

        let meridiem = currentdate.getHours() > 12 ? "PM" : "AM"
        let datetime = "Last Beep: " + currentdate.getDate() + "/"
                + (currentdate.getMonth()+1)  + "/" 
                + currentdate.getFullYear() + " @ "  
                + hour + ":"  
                + currentdate.getMinutes() + ":" 
                + currentdate.getSeconds() + " "
                + meridiem
        
        return datetime
    }

    updateEmail(e){
        if (e){
            this.setState({...this.state, account:e.email, e_account:e})

            data_hook("requests", e.uid, (d)=>{
                this.setState({...this.state, requests: d.data().requests})
            })
            data_hook("location", e.uid, (d)=>{
                this.setState({...this.state, followers: d.data().viewer_tag})
            })
            
        }
        else{
            this.props.history.push('/login')
        }
    }

    getPosition(options) {
        return new Promise((resolve, reject) => 
            navigator.geolocation.getCurrentPosition(resolve, reject, options)
        );
    }

    async locateDone(e){
        if (this.delaySwitch){
            let curTime = this.time()

            if (this.firstLocate) {this.setState({...this.state, located: true, beep:curTime})}
            else {this.setState({...this.state, beep:curTime})}
            this.firstLocate = false

            

            console.log(e)
            let data = {
                loc: {...e.latlng},
                owner: this.state.e_account.uid,
                viewer: [this.state.e_account.uid],
                viewer_tag: [`${this.state.e_account.email}|+|${this.state.e_account.uid}`],
                time: this.time()
            }
            console.log(data)
            location_write(this.state.e_account.uid, data)

            this.delaySwitch = false

            setTimeout(()=>{
                this.delaySwitch=true
            }, 5000)
        }
            
    }

    componentDidMount(){
    }   

    async addRequest(){
        console.log(this.state)
        // remove from request
        await data_array_delete(this.state.e_account.uid, 'requests', `${this.state.popoverName}|+|${this.state.popoverUID}`, "requests")

        // add to viewer
        await data_array_updatev2(this.state.e_account.uid, 'viewer', this.state.popoverUID, "location")
        await data_array_updatev2(this.state.e_account.uid, 'viewer_tag', `${this.state.popoverName}|+|${this.state.popoverUID}`, "location")

        // connect : move request uid to following
        await data_array_delete(this.state.popoverUID, 'request', `${this.state.e_account.email}|+|${this.state.e_account.uid}`, "connect")
        await data_array_updatev2(this.state.popoverUID, 'following', `${this.state.e_account.email}|+|${this.state.e_account.uid}`, "connect")
    }

    render(){
        return (
            
            <IonPage>

                <IonContent>
                    <div className={style.map_bg}>
                        <Map locate={true} onLocate={this.locateDone.bind(this)}/>
                    </div>
                    
                    {false ? 
                    <div className={style.beacon_bg}>
                        <span className={style.beacon}></span>
                    </div> : <></>}

                    <div className={style.stat_card}>
                        
                        <div className="">
                            <IonGrid>
                                <IonRow>
                                    <IonCol>
                                        {this.state.located ? 
                                            <p className={style.status}>ACTIVE</p>
                                            :
                                            <IonSpinner  className={style.status} />
                                        }
                                    </IonCol>
                                </IonRow>   
                                <IonRow>
                                    <IonCol>
                                        <h4>{this.state.account}</h4>
                                    </IonCol>
                                    <IonCol>
                                        <p className={style.beepstat}>{this.state.beep}</p>
                                    </IonCol>
                                </IonRow>
                                <IonRow>
                                    <IonCol>
                                        <IonButton className={style.button} routerLink={'/qr'}>
                                            <div>
                                                <IonIcon slot="start" icon={qrCode}/><br/>
                                                Get QR Code
                                            </div> 
                                        </IonButton>
                                    </IonCol>
                                    <IonCol>
                                        <IonButton fill="clear" size="small" onClick={logoutUser.bind(this)}>Logout User</IonButton>
                                    </IonCol>

                                </IonRow>
                            </IonGrid>
                                
                        </div>
                        
                        <div className="">
                            <h2>Requesters</h2>
                            <IonList>
                                {
                                    this.state.requests.length > 0 ? 
                                    this.state.requests.map((e,i)=>{
                                        e = e.split('|+|')
                                        return(
                                            <IonItem key={`req_${i}`} onClick={this.popoverCall.bind(this,e[1],e[0])} button>
                                                <IonLabel>{e[0]}</IonLabel>
                                            </IonItem>
                                        )
                                    })
                                    :
                                    <p>No new Requester</p>
                                }
                            </IonList>
                        </div>
                        
                        <div className="">
                            <h2>Followers</h2>
                            <IonList>
                                {
                                    this.state.followers.slice(1).length > 0 ? 
                                    this.state.followers.slice(1).map((e,i)=>{
                                        e = e.split('|+|')
                                        return(
                                            <IonItem key={`fol_${i}`} button>
                                                <IonLabel>{e[0]}</IonLabel>
                                            </IonItem>
                                        )
                                    })
                                    :
                                    <p>No new Followers</p>
                                }
                            </IonList>
                        </div>

                        <div className="">

                            <IonButton expand="block">
                                Settings
                            </IonButton>
                            <IonButton expand="block">
                                About
                            </IonButton>
                        </div>
                    </div>

                    <IonAlert
                        isOpen={this.state.popover}
                        onDidDismiss={this.popoverSwitch.bind(this, false)}
                        header={'Request'}
                        message={'Accept request of ' + this.state.popoverName}
                        buttons={[
                            {
                              text: 'Accept',
                              handler: () => {
                                this.addRequest()
                              }
                            },
                            {
                              text: 'Reject',
                              handler: () => {
                                console.log('Confirm Reject');
                              }
                            },
                          ]}
                        />
                    

                </IonContent>
                
            </IonPage>
            
        )
    }
    
}

export default Profile