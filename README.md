# BVND2 Hospital Appointment System - Frontend
![React](https://img.shields.io/badge/React-18.2.0-blue)
![TailWind](https://img.shields.io/badge/Tailwind-3.4.0-38B2AC)
![Node](https://img.shields.io/badge/Node-18.x-green)

A modern, responsive web application for hospital appointment management. This frontend client serves as the user interface for patients, doctors, and nurses to manage appointments and schedules efficiently. Built during a 2-month internship, this project demonstrates full-stack development capabilities with a focus on user experience and real-world business logic.

## Table of Contents
- Features
- Tech Stack
- Project Structure
- Installation
- Usage
- Screenshots
- API Integration
- Contributing
- License
- Contact
## Features
### For Patients
- User Authentication - Secure sign up and login
- Appointment Booking - Browse available doctors and schedule appointments
- Appointment History - View past and upcoming appointments
- Profile Management - Update personal information
### For Doctors
- Schedule Management - Create and manage working hours
- Appointment Overview - View daily/weekly appointment lists
- Patient Information - Access patient details for each appointment
- Availability Toggle - Set availability status for different time slots
### For Nurses/Coordinators
- Patient Registration - Register new patients and book appointments on their behalf
- Doctor Schedule Administration - Create and modify doctor schedules
- Appointment Coordination - View and manage all appointments across departments
- Department Overview - Monitor different departments and rooms
### General Features
- Role-Based Access Control - Different views and permissions for each user type
- Responsive Design - Works seamlessly on desktop, tablet, and mobile
- Real-time Updates - Live appointment status updates
- Search & Filter - Find appointments by date, doctor, or patient name
## Tech Stack
|Technology|Purpose|
|----------|-------|
|Reach 18|Frontend library for building user interfaces|
|React Router DOM|Navigation and routing|
|Tailwind CSS|Utility-first CSS framework for styling|
|Axios|HTTP client for API requests|
|Context API|State management|
|React Hooks|Managing component logic and side effects|
|Create React App|Project bootstrapping and build tool|
## Project Structure
```
AppointmentBVND2_Client/
├── public/                 # Static assets
├── src/
│   ├── components/         # Reusable UI components
│   │   ├── auth/           # Login/Signup components
│   │   ├── layout/         # Header, Footer, Sidebar
│   │   ├── appointments/   # Appointment-related components
│   │   ├── schedules/      # Schedule management components
│   │   └── common/         # Buttons, Modals, Forms
│   ├── pages/              # Main application pages
│   │   ├── PatientPage/    # Patient dashboard
│   │   ├── DoctorPage/     # Doctor dashboard
│   │   ├── NursePage/      # Nurse dashboard
│   │   ├── LoginPage/      # Authentication page
│   │   └── RegisterPage/   # New user registration
│   ├── services/           # API calls and business logic
│   │   ├── api.js          # Axios configuration
│   │   ├── authService.js  # Authentication methods
│   │   ├── appointmentService.js # Appointment API calls
│   │   └── scheduleService.js # Schedule API calls
│   ├── contexts/           # React Context providers
│   ├── hooks/              # Custom React hooks
│   ├── utils/              # Helper functions
│   └── App.js              # Main application component
├── .env.example            # Environment variables template
├── package.json            # Dependencies and scripts
└── README.md               # Project documentation
```
## Screenshots
![Interface](https://res.cloudinary.com/dhjbseski/image/upload/v1772096005/apoment_image_zumwmp.png)

# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
