import React from "react"

import { IonIcon } from '@ionic/react';
import {  qrCode,  } from 'ionicons/icons';

import style from "./Logo.module.css"

class Logo extends React.Component {

    constructor(props){
        super(props)
        
    }

    render(){
        return (
            <>
                <h1 className={style.size}><span className={style.style}><IonIcon icon={qrCode}/>Q</span>SEE</h1>
            </>
        )
    }
    
}

export default Logo