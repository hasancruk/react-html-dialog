import { useState, type HTMLAttributes, type ReactNode, type RefObject } from "react";
import "./App.css";
import type { Dialog } from "./hlx-dialog";

const TableHeadings = ({ headings }: { headings: string[] }) => (
  <thead>
    <tr>
      {headings.map((heading, i) => (
        <th key={`${heading}-${i}`}>{heading}</th>
      ))}
    </tr>
  </thead>
);

const TableBody = ({ body }: { body: Data[] }) => {
  return (
    <tbody>
      {body.map((row, i) => (
        <tr key={`${row.ticketType} ${row.name} ${i}`}>
          <td>{row.ticketType}</td>
          <td>{row.name}</td>
          <td>{row.email}</td>
          <td>{<SummaryActions {...row} />}</td>
        </tr>
      ))}
    </tbody>
  );
};

type Data = {
  ticketType: string;
  name: string;
  email: string;
  actions: string | ReactNode;
};

type SummaryProps = {
  data: Data[];
};

function SummaryActions({ email, actions }: Data) {
  if (typeof actions === "string") {
    return (
      <button
        type="button"
        data-action-for={email}
        onClick={(e) => {
          e.target.dispatchEvent(new Event("hlx-request-dialog", { bubbles: true })) 
        }}
      >
      { actions }
      </button>
    );
  }
  return actions;
};

export const ParticipantSummary = ({ data }: SummaryProps) => {
  const [selected, setSelected] = useState(-1);

  const richData = data.map((d, i) => ({
    ...d,
    actions: <button onClick={(e) => {
      setSelected(i);
      emit(e.target);
    }}>{d.actions}</button>
  }));

  return (
    <div className="participant-summary form-section-content">
      <table>
        <TableHeadings headings={["Ticket type", "Name", "Email", "Action"]} />
        <TableBody body={richData} />
      </table>
      <Dialog handleClose={() => setSelected(-1)}>
        <p>Form for {data[selected]?.name}</p>
      </Dialog>
      <button
        type="button"
        data-action-for="test@example.com"
        onClick={(e) => emit(e.target)}
      >
        Test button
      </button>
    </div>
  );
};

function emit(target: EventTarget, eventName = "hlx-dialog-requested") {
  console.log("DEBUG emitting from:", target);
  target.dispatchEvent(new Event(eventName, { bubbles: true })); 
}

declare module "react/jsx-runtime" {
  namespace JSX {
    interface IntrinsicElements {
      "hlx-dialog": HTMLAttributes<Dialog>;
    }
  }
}

function Dialog({ handleClose, children }: { handleClose: () => void; children: ReactNode }) {
  return (
    <hlx-dialog onhlx-dialog-closed={() => handleClose()}>
      <dialog>
        { children } 
      </dialog>
    </hlx-dialog>
  );
}

function App() {
  const tickets = [
    {
      ticketType: "Adult",
      name: "Jesse Abulu",
      email: "jesse@awesome.com",
      actions: "edit",
    },
    {
      ticketType: "Adult",
      name: "Tom Metcalfe",
      email: "tom@awesome.com",
      actions: "add",
    },
  ];

  return (
    <>
      <ParticipantSummary data={tickets} />
    </>
  );
}

export default App;
