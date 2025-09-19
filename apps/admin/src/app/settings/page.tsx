import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Settings ",
  description: "Manage settings here.",
};

function page() {
  return (
    <div>
      <h1>Settings Page</h1>
          <p>Manage your application settings here.</p>
          {/* TODO: 1. The sections on the portoflio page ,
           like the projects, posts and resume , that order should be modified using a reodering comp here   */}
    </div>
  )
}

export default page