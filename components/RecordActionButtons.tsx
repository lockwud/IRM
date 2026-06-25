"use client";

import { useState } from "react";

function PencilIcon() { return <svg viewBox="0 0 24 24"><path d="m14.5 5.5 4 4M4 20l3.8-.8L19 8a2.1 2.1 0 0 0-3-3L4.8 16.2 4 20Z"/></svg>; }
function BinIcon() { return <svg viewBox="0 0 24 24"><path d="M4 7h16M9 7V4h6v3M6.5 7l.8 13h9.4l.8-13M10 11v5M14 11v5"/></svg>; }

/** Reusable grey pencil/bin actions with an inline destructive confirmation dialog. */
export function RecordActionButtons({ label, onEdit, onDelete }: { label: string; onEdit: () => void; onDelete: () => void }) {
  const [confirming, setConfirming] = useState(false);
  return <>
    <div className="record-action-buttons"><button onClick={onEdit} aria-label={`Edit ${label}`} title="Edit"><PencilIcon/></button><button onClick={() => setConfirming(true)} aria-label={`Delete ${label}`} title="Delete"><BinIcon/></button></div>
    {confirming && <div className="modal-backdrop" onMouseDown={() => setConfirming(false)}><section className="delete-dialog" role="alertdialog" aria-modal="true" onMouseDown={event => event.stopPropagation()}><div><BinIcon/></div><h2>Delete record?</h2><p><strong>{label}</strong> will be removed. This action cannot be undone.</p><footer><button className="secondary" onClick={() => setConfirming(false)}>Cancel</button><button className="delete-button" onClick={() => { onDelete(); setConfirming(false); }}>Delete</button></footer></section></div>}
  </>;
}
