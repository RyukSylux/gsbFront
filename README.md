# GSB Expense Management - React Frontend

## Project Overview
This project is a web application developed as part of the E5 exam for the BTS SIO (Services Informatiques aux Organisations), SLAM (Solutions Logicielles et Applications Métiers) option. The application is designed for the management and digitalization of expense reports for the GSB (Galaxy Swiss Bourdin) company.

## Main Features
- **User Authentication**: Secure login and session management.
- **Expense Submission**: Users can create new expense reports (bills) with the following features:
  - Upload a receipt (image or PDF)
  - Automatic extraction of description, total amount, and date using OCR (Tesseract.js)
  - Manual entry if OCR fails
  - Date picker for expense date
- **Expense List & Filtering**:
  - Display all submitted expenses in a table
  - Filter by description, date, creation date, status, and amount (min/max)
  - Sort and search functionalities
- **Admin Features**:
  - View all users and their expenses
  - Edit or delete users and expenses
  - Bulk actions (select and delete multiple bills)
- **Notifications**: User feedback for actions and errors
- **Responsive Design**: Usable on desktop and mobile

## Test Credentials

The following accounts can be used for testing the application:

### Administrator
- **Email**: test@gmail.com
- **Password**: test

### Standard User
- **Email**: hugo@gmail.com
- **Password**: hugo

### Commercial
- **Email**: pablito@gmail.com
- **Password**: pablito1

---

## Technical Stack
- **Frontend**: React 19, Vite, Tailwind CSS
- **OCR**: Tesseract.js (v4.1.1)
- **UI Components**: Headless UI, Heroicons
- **Library**: Date-fns for date manipulation
- **State Management**: React Context API
- **API Communication**: Axios
- **Authentication**: JWT (handled by backend)

## Project Structure
- `src/components/` : UI components (tables, modals, layout, etc.)
- `src/services/` : API and OCR service logic
- `src/contexts/` : Context providers (auth, notifications)
- `src/pages/` : Main application pages
- `src/hooks/` : Custom React hooks

## How to Run
1. Clone the repository
2. Install dependencies: `npm install`
3. Configure the API URL in `.env` if needed
4. Start the development server: `npm run dev`
5. Build for production: `npm run build`
6. Preview production build: `npm run preview`

## Author & Context
- **Author**: Morgan Bourré
- **Context**: BTS SIO SLAM - E5 Project (Professional Project)
- **Company**: Galaxy Swiss Bourdin (GSB)
- **Year**: 2025

## Exam Objectives (E5 - SLAM)
- Design and develop a business application
- Implement data processing and automation (OCR)
- Ensure security and data integrity
- Provide a user-friendly and professional interface

