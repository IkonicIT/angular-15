# angular-15

## Description

**angular-15** is a responsive Single Page Application (SPA) built with **Angular 15** for **Heco Inc.** It serves as a migration project of **gotracrat-web-app** from Angular 5 to Angular 15. This frontend interface is used for managing motor repairs, sales, and services. The application seamlessly integrates with backend microservices via secured REST APIs and supports JWT-based authentication with role-based access control.

---

Key features include:
- Company, location, item, and repair management
- Attribute-driven item configurations
- Responsive design across devices
- Secure login and role-based access

---

## Tech Stack

- **Angular:** 15.2.10  
- **Node.js:** 18.20.4  
- **NPM:** 8.19.4  
- **Angular CLI:** 15.2.11

## Build

To build the project for development:

`ng build`

For a production build:

`ng build --prod`

Build artifacts will be stored in the `dist/` directory.

## Installation

To install required dependencies:

Run `npm install`

## Run

### Local Server

To run the application locally:

`ng serve`

Navigate to: http://localhost:4200/  
The application will automatically reload if you make changes to the source files.

### Development Server (Deployed)

Navigate to: https://angular15.gotracrat.in/  
The application communicates with deployed backend microservices over HTTPS.

## Login Instructions

1. Open the application in your browser:
   - http://localhost:4200/
   - https://angular15.gotracrat.in/

2. Use the following credentials to log in:

   **Username:** `ypatel`  
   **Password:** `Ypatel@123`

## Code Scaffolding

To generate a new component:

`ng generate component component-name`

You can also use the following to generate other elements:

`ng generate directive|pipe|service|class|module`

## Running Unit Tests

To execute unit tests using Karma:

`ng test`

## Running End-to-End Tests

To execute E2E tests using Protractor:

`ng e2e`

Before running the tests, make sure the application is running via:

`ng serve`

## Further Help

To get more help on the Angular CLI:

`ng help`

Or check out the official [Angular CLI README](https://github.com/angular/angular-cli)