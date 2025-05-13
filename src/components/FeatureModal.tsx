import { useState, useEffect } from "react";

interface FeatureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (attributes: Record<string, any>) => void;
  initialData?: Record<string, any>;
}

export default function FeatureModal({
  isOpen, 
  onClose,
  onSave,
  initialData
}: FeatureModalProps) {
  const [name, setName] = useState("");
  const [type, setType] = useState("");

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || "");
      setType(initialData.type || "");
    }
    console.log(initialData)
  }, [initialData]);

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <h2>Edit Feature</h2>
        <label htmlFor="">
          Name : <input type="text" value={name} onChange={e => setName(e.target.value)} />
        </label>
        <label htmlFor="">
          Type: 
          <input type="text" value={type} onChange={e => setType(e.target.value)} />
        </label>
        <div className="modal-actions">
          <button onClick={onClose}>Cancel</button>
          <button onClick={() => onSave({name, type})}>Save</button>
        </div>
      </div>
    </div>
  )
}