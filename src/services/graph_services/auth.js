useEffect(() => {
  microsoftTeams.getContext(function (context) {
    setcontext(context);
    // ////////////////////////////
    let config = {
      clientId: "2b5ad6fe-b7ae-4bc3-bea6-a5a60d69d549",
      // redirectUri must be in the list of redirect URLs for the Azure AD app
      redirectUri: window.location.origin + "/tab-auth/silent-end",
      cacheLocation: "localStorage",
      navigateToLoginRequestUrl: false,
    };
    ///////////////////////////
    if (context.loginHint) {
      config.extraQueryParameter = "scope=openid+profile&login_hint=" + encodeURIComponent(context.loginHint);
    } else {
      config.extraQueryParameter = "scope=openid+profile";
    }
    //////////////////////////
    let authContext = new AuthenticationContext(config); // from the ADAL.js library
    // See if there's a cached user and it matches the expected user
    let user = authContext.getCachedUser();
    if (user) {
      if (user.profile.oid !== context.userObjectId) {
        // User doesn't match, clear the cache
        authContext.clearCache();
      }
    }

    // In this example we are getting an id token (which ADAL.js returns if we ask for resource = clientId)
    authContext.acquireToken(config.clientId, function (errDesc, token, err, tokenType) {
      if (token) {
        // Make sure ADAL gave us an id token
        if (tokenType !== authContext.CONSTANTS.ID_TOKEN) {
          token = authContext.getCachedToken(config.clientId);
        }
        // showProfileInformation(idToken);
      } else {
        console.log("Renewal failed: " + err);
        // Failed to get the token silently; show the login button

        // You could attempt to launch the login popup here, but in browsers this could be blocked by
        // a popup blocker, in which case the login attempt will fail with the reason FailedToOpenWindow.
      }
    });

    if (authContext.isCallback(window.location.hash)) {
      authContext.handleWindowCallback(window.location.hash);
      if (window.parent === window) {
        if (authContext.getCachedUser()) {
          microsoftTeams.authentication.notifySuccess();
        } else {
          microsoftTeams.authentication.notifyFailure(authContext.getLoginError());
        }
      }
    }
  });
  microsoftTeams.initialize();
  var authTokenRequest = {
    successCallback: function (result) {
      console.log(result);
    },
    failureCallback: function (error) {
      console.log(error);
    },
  };
  microsoftTeams.authentication.getAuthToken(authTokenRequest);
}, []);
useEffect(() => {
  microsoftTeams.initialize();
  var authTokenRequest = {
    successCallback: function (result) {
      console.log(result);
    },
    failureCallback: function (error) {
      console.log(error);
    },
  };
  microsoftTeams.authentication.getAuthToken(authTokenRequest);
}, []);
