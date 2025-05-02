// use the react timeline library to create a timeline of meetings
// on each card show the meeting date (as a timeline element data), project name , project desc, project link , project source code link, if avalikabke
// then clicking on each card should ref to the emais tab with the meeting email(the contact email) and auto populate a template
// or maybe it should check for the chat conversation of that meeting and show it


export default async function ProjectMeetingsPage() {
    return (
        <div className="container">
            <h1>Project Meetings</h1>
            <p>Meetings are a great way to keep track of your project progress.</p>
            <p>Use the form below to add a new meeting.</p>
        </div>
    );
}