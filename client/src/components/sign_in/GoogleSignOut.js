import React from 'react';
import {GoogleLogout} from 'react-google-login';
 // Credential
import {GOOGLE_CLIENT_ID} from '../../credential';

const GoogleSignOut = (props) => {
  // Signin Signout button 
  //
  const handleSuccessfulSignOut = () => {
    props.setPage('welcome');
    props.setProfile({isSignedIn: false});
    props.setWords([]);
    props.setSnackbar({
      status: 'open',
      severity: 'info',
      message: 'You have been successfully signed out'
    })
  }

  const handleLogoutFailure = (res) => {
    props.setSnackbar({
      status: 'open',
      severity: 'error',
      message: `Fail: ${res}`
    })
  }

  return (
    <div>
      <GoogleLogout
        clientId={GOOGLE_CLIENT_ID}
        buttonText='Sign out safely with Google'
        onLogoutSuccess={() => {handleSuccessfulSignOut()}}
        onFailure={(res) => {handleLogoutFailure(res)}} 
      />
    </div>
  );
}

export default GoogleSignOut