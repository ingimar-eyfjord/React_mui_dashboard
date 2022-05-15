# This React dashboard

This React dashboard is an internal web app solution still in development for the company I am currently employeed in. The goal is to make it into a scalable single page progressive web app. The company depends on the application for day-to-day project management operations. The solution captures essential data which is then used for business analytics, project management, salary and invoicing. 

## Other services
The application communicates with other software using a companion Express app. As an example, Emply a SAS for HR and employee management, the application consumes data about the logged in user which is used when the users make transactions like invoicing hours or adding to their schedule. Furthermore, the authentication barrier is handled by Microsoft Graph API, the application uses [MSAL2 Provider](https://docs.microsoft.com/en-us/graph/toolkit/providers/msal2) global state prviders and [Microsoft Graph Toolkit React components](https://docs.microsoft.com/en-us/graph/toolkit/get-started/mgt-react) to achieve SSO (single sign on) and the possibility of using premade microsoft components, this requires a set up in the Microsoft Active Directory and programming an authentication barrier by following Microsoft’s documentation.

- [Single sign-on with MSAL.js](https://docs.microsoft.com/en-us/azure/active-directory/develop/msal-js-sso)

# Getting started

This documentation tells you how to get started working with this app.

Each folder should have further explanatory README.md document file, which should inform the developer what the folder contains and the purpose of the content inside.

- [src](src/README.md) | Documents in more intricate details the configuration, authentication and structure of the app.

Developers should update these files when or if they add functionality, change a functionality or change the structure of the application.

## Prerequisites

- [NodeJS](https://nodejs.org/en/)

- [Nodemon](https://www.npmjs.com/package/nodemon) (For developing the API locally)

- [Microsoft SPA registration](https://docs.microsoft.com/en-us/azure/active-directory/develop/scenario-spa-overview) | You need an account with the appropriate permissions register an application in Azure portal.

- Further npm packages are installed in this application, make sure you have the package-lock.json and package.json.

## Run the program (for development):


- In the project directory, execute this in the terminal:

`yarn`

`yarn start`

- In the API app, execute:

`nodemon server.js`