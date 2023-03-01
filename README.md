# EXAMPLE RECRUITMENT TASK

## Task

We ask you to create an app with frontend implemented in React and
connected to an API written in Node.js with data being saved in a DB
(e.g. mongodb, postgresql, sqlite, mysql). You are allowed to use any
open-source libraries and frameworks. The app does not need to be
deployed anywhere.

### Form

The application should allow the user to submit a log report by filling in
a form with the following fields. The backend will then process the log
that the user submits and save the `processed log` along with all the
other form fields in a database. It will then display a list of `relevant lines`
to the user using monospace font. The form should have the
following fields:

- Name (required)
- Email (required, valid email address)
- Log (required, textarea field)

### Log

The log can have any number of lines. Each line begins with either E for
errors, W for warnings and I for informational messages. Error messages
then have a number indicating the severity of the error, between 1 and 100.
All types of messages then have an integer timestamp and a textual
content which runs until the end of the line. Here are a few valid lines:

<pre>
I 6 Nothing to report
W 7 Out for lunch
E 63 21 ERROR: Something has gone horribly wrong
I 52 Something went wrong while I was out for lunch
</pre>

A `processed log` only has lines which conform to the template
described above (other lines are discarded) and is sorted with the
timestamps in ascending order.
A `relevant line` is an error line with severity of at least 50.
Example log file has been provided.

### Criteria

The following criteria are important for us:

- Tests for frontend and backend
- Data validation on frontend and backend
- Error handling
- State management on frontend (form and request lifecycle state)
- Readme with all information needed to install and run the app and test
- File and component structur­e
- Code readability and extensibility

Styling will not be taken into account.

## Structure

The project is divided into two folders, backend and frontend. The first one is responsible for server-side operations, and the other one for the UI.

### Backend

The backend folder is divided into migrations, models, tests and utils folders.

### Frontend

The frontend folder is an npx create-react-app template folder. Source folder is divided into components, pages, styles and types folders.

## Usage

### Installation

Run `npm run install`.

### Development

Run `npm run devbackend`. In another terminal run `npm run devfrontend`.

### Test

Run `npm test`.

### Production

Run `npm run app`.
