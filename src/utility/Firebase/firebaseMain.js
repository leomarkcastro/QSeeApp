import firebase from "firebase"

const config = {
    apiKey: "AIzaSyCg6K9kEdTCV1Ap8NTdBLCiUdJcOgbJMfs",
    authDomain: "qrmap-app.firebaseapp.com",
    projectId: "qrmap-app",
    storageBucket: "qrmap-app.appspot.com",
    messagingSenderId: "72141194135",
    appId: "1:72141194135:web:ac6ad4a2c92e4db426fad2"
};

firebase.initializeApp(config)

export async function loginUser(email, password, resultCB=(e)=>console.log(e)){
    
    try{
        const res = await firebase.auth().signInWithEmailAndPassword(email, password)

        resultCB(res)
        return true
    }
    catch(error){
        resultCB(error)
        return false
    }
    
}

export async function loginUserGoogle(resultCB=(e)=>console.log(e), errorCB=(e)=>console.log(e),){
    
    try{
        let provider = new firebase.auth.GoogleAuthProvider();

        firebase.auth().signInWithRedirect(provider);
        
        firebase.auth()
            .getRedirectResult()
            .then((result) => {
                if (result.credential) {
                    /** @type {firebase.auth.OAuthCredential} */
                    let credential = result.credential;

                    // This gives you a Google Access Token. You can use it to access the Google API.
                    let token = credential.accessToken;
                    // ...
                }
                    // The signed-in user info.
                let user = result.user;
                resultCB(result)
            }).catch((error) => {
                /*
                // Handle Errors here.
                let errorCode = error.code;
                let errorMessage = error.message;
                // The email of the user's account used.
                let email = error.email;
                // The firebase.auth.AuthCredential type that was used.
                let credential = error.credential;
                // ...
                */
                errorCB(error)
            });
        
        return true
    }
    catch(error){
        resultCB(error)
        return false
    }
    
}

export async function registerUser(email, password, resultCB=(e)=>console.log(e)){
    
    try{
        const res = await firebase.auth().createUserWithEmailAndPassword(email, password)

        resultCB(res)
        return true
    }
    catch(error){
        resultCB(error)
        return false
    }
    
}

export function logoutUser(){
    firebase.auth().signOut()
}

export function hookAccount(callback){

    firebase.auth().onAuthStateChanged(callback)

}

export function data_hook(col, doc, callback=(e)=>console.log(e), errorCB=(e)=>console.log(e)){

    const unsubscribe = firebase.firestore()
        .collection(col)
        .doc(doc)
        .onSnapshot(
            callback,errorCB
        )
    
    return {
        unsubscribe : unsubscribe,
        createAgain : function(){
            unsubscribe()
            data_read()

        }
    }

}

export async function data_read(doc, col='location'){

    try{
        let res = await firebase.firestore()
                            .collection(col)
                            .doc(doc)
                            .get()

        if (res.exists) {
            //console.log("Document data:", res.data());
            return res.data()
        } else {

            // doc.data() will be undefined in this case
            return {}
        }

    }
    catch(error){
        console.log(error)
        return false
    }

}

export async function data_write(doc, message, col='location'){

    try{
        await firebase.firestore()
                            .collection(col)
                            .doc(doc)
                            .set(message)

        console.log("Write Done")
        return true
    }
    catch(error){
        console.log(error)
        return false
    }

}

export async function data_array_update(doc, message, col='location'){

    try{
        await firebase.firestore()
                            .collection(col)
                            .doc(doc)
                            .update({requests: firebase.firestore.FieldValue.arrayUnion(message)})

        console.log("Write Done")
        return true
    }
    catch(error){
        console.log(error)
        return false
    }

}

export async function data_array_updatev2(doc, key, message, col='location'){

    let toUpdate = {}
    try{
        toUpdate[key] = firebase.firestore.FieldValue.arrayUnion(message)
        await firebase.firestore()
                            .collection(col)
                            .doc(doc)
                            .update(toUpdate)

        console.log("Update Add Done")
        return true
    }
    catch(error){
        console.log(error)
        return false
    }

}

export async function data_array_delete(doc, key, message, col='location'){
    
    let toDelete = {}
    try{
        toDelete[key] = firebase.firestore.FieldValue.arrayRemove(message)
        await firebase.firestore()
                            .collection(col)
                            .doc(doc)
                            .update(toDelete)

        console.log("Update Remove Done")
        return true
    }
    catch(error){
        console.log(error)
        return false
    }

}


export async function location_write(doc, message){

    try{
        let address = await firebase.firestore()
                            .collection('location')
                            .doc(doc)
        
        try{
            await address.get()
            address.update({loc: message.loc, time: message.time})
            console.log('update')

        }
        catch(err){
            address.set(message)
            console.log('write')
        }
        
        return true
    }
    catch(error){
        console.log(error)
        return false
    }

}

export async function data_delete(doc, col='location'){

    try{
        await firebase.firestore()
                            .collection(col)
                            .doc(doc)
                            .delete()

        console.log("Delete Done")
        return true
    }
    catch(error){
        console.log(error)
        return false
    }

}