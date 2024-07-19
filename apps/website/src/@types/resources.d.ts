interface Resources {
  "main": {
    "hooks": {
      "useConfirmOnLeave": "You have unsaved changes - are you sure you wish to leave this page?"
    },
    "components": {
      "NavBar": {
        "supportEntry": "Support",
        "dashboardEntry": "Dashboard",
        "accountEntry": "Account"
      }
    },
    "pages": {
      "error": {
        "errors": {
          "NotAuthenticated": "You are not logged in.",
          "NotAuthorized": "You are not authorized to access this page.",
          "NotFound": "The page you were looking for could not be found.",
          "InternalServerError": "An unexpected error occurred."
        },
        "nav": {
          "homeBtn": "Go home",
          "tryAgainBtn": "Try again",
          "supportBtn": "Get support",
          "backBtn": "Go back"
        }
      }
    }
  }
}

export default Resources;
