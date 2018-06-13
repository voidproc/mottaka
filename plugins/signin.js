import firebase from '~/plugins/firebase'
const provider = new firebase.auth.GoogleAuthProvider()

function signInWithRedirect () {
  firebase.auth().signInWithRedirect(provider)
}
export default signInWithRedirect