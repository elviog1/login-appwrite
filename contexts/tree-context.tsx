import React, { createContext, useContext, useState } from "react";
import { Person } from "../lib/personService";

type TreeContextType = {
  rootPerson: Person | null;
  setRootPerson: (person: Person) => void;
};

const TreeContext = createContext<TreeContextType | null>(null);

export function TreeProvider({ children }: { children: React.ReactNode }) {
  const [rootPerson, setRootPerson] = useState<Person | null>(null);

  return (
    <TreeContext.Provider value={{ rootPerson, setRootPerson }}>
      {children}
    </TreeContext.Provider>
  );
}

export function useTree() {
  const context = useContext(TreeContext);
  if (!context) {
    throw new Error("useTree must be used inside TreeProvider");
  }
  return context;
}
