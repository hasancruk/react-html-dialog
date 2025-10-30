import { useEffect, useRef, useState, type ReactNode, type RefObject } from "react";
import "./App.css";

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
          <td>{<SummaryActions actions={row.actions} />}</td>
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
  const containerRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);

  const richData = data.map((d, i) => ({
    ...d,
    actions: <button onClick={() => {
      setSelected(i);
      dialogRef.current?.showModal();
    }}>{d.actions}</button>
  }));

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
    
    containerRef.current?.addEventListener("hlx-request-dialog", (e) => {
      console.log("[DEBUG] request dialog event:", e);
      console.log("[DEBUG] data:", (e.target as HTMLButtonElement).dataset.actionFor);
      dialogRef.current?.showModal();
    }, { signal });

    return () => {
      controller.abort();
    };
  }, []);

  return (
    <div className="participant-summary form-section-content" ref={containerRef}>
      <table>
        <TableHeadings headings={["Ticket type", "Name", "Email", "Action"]} />
        <TableBody body={richData} />
      </table>
      <Dialog ref={dialogRef}>
        <p>Form for {data[selected]?.name}</p>
      </Dialog>
      <button
        type="button"
        data-action-for="test@example.com"
        onClick={(e) => {
          e.target.dispatchEvent(new Event("hlx-request-dialog", { bubbles: true })) 
        }}
      >
        Test button
      </button>
    </div>
  );
};

function Dialog({ ref, children }: { ref: RefObject<HTMLDialogElement | null>; children: ReactNode }) {
  return (
    <dialog ref={ref}>
      { children } 
    </dialog>
  );
}

function App() {
  const tickets = [
    {
      ticketType: "Adult",
      name: "Hasan Ali",
      email: "hasan@awesome.com",
      actions: "edit",
    },
    {
      ticketType: "Adult",
      name: "Ruby Chohan",
      email: "ruby@awesome.com",
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
