"use client";
import Image from "next/image";
import Logo from "@assets/pic1medical-logo.png";

export default function LandingPage() {
  return (
    <div
      className="card"
      style={{
        width: "60%",
        minWidth: "320px",
        maxWidth: "560px",
        height: "40%",
        minHeight: "320px",
        maxHeight: "560px",
      }}
    >
      <div className="card-body">
        <h5 className="card-title">
          <div className="d-flex align-items-center justify-content-center">
            <Image src={Logo} height="60" alt="" />
          </div>
          <hr />
        </h5>
        <p className="card-text">
          This website is for internal usage for the Pic1Medical company, it is
          not intended to be publicly used. If you are not: a member of the
          Pic1Medical Staff, and have been given access from an administrator;
          then you should exit out of this tab. Otherwise, click{" "}
          <a href="/client">here</a> to continue.
        </p>
        <p className="card-text">Thank you! - Pic1Medical Team</p>
      </div>
    </div>
  );
}

// "use client";

// import { useState, useEffect } from "react";
// import { generateClient } from "aws-amplify/data";
// import type { Schema } from "@/amplify/data/resource";
// import "./app.css";
// import "@aws-amplify/ui-react/styles.css";
// import { useAuthenticator } from "@aws-amplify/ui-react";

// const client = generateClient<Schema>();

// export default function App() {
//   const [todos, setTodos] = useState<Array<Schema["Todo"]["type"]>>([]);

//   const { user, signOut } = useAuthenticator();

//   function listTodos() {
//     client.models.Todo.observeQuery().subscribe({
//       next: (data) => setTodos([...data.items]),
//     });
//   }

//   useEffect(() => {
//     listTodos();
//   }, []);

//   function createTodo() {
//     client.models.Todo.create({
//       content: window.prompt("Todo content"),
//     });
//   }

//   function deleteTodo(id: string) {
//     client.models.Todo.delete({ id });
//   }

//   return (
//     <main>
//       <h1>
//         <i>{user?.signInDetails?.loginId}</i>'s todos
//       </h1>
//       <button onClick={createTodo}>+ new</button>
//       <ul>
//         {todos.map((todo) => (
//           <li key={todo.id} onClick={() => deleteTodo(todo.id)}>
//             {todo.content}
//           </li>
//         ))}
//       </ul>
//       <div>
//         🥳 App successfully hosted. Try creating a new todo.
//         <br />
//         <a href="https://docs.amplify.aws/nextjs/start/quickstart/nextjs-app-router-client-components/">
//           Review next steps of this tutorial.
//         </a>
//       </div>
//     </main>
//   );
// }
