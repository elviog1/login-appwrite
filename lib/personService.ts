import { ID, Query } from "react-native-appwrite";
import { COLLECTION_ID, DATABASE_ID, databases } from "./appwrite";

export type PersonDocument = {
  $id: string;
  firstName: string;
  lastName: string;
  birthDate: string;
  description?: string;
  parentId: string | null; // null para raíces
  userId: string; // para filtrar por usuario
};

export type Person = PersonDocument & {
  children: Person[];
};

// Crear una nueva persona
export async function createPerson(
  userId: string,
  data: {
    firstName: string;
    lastName: string;
    birthDate: string;
    description?: string;
    parentId: string | null; // 👈 Acepta parentId explícitamente
  },
) {
  try {
    const response = await databases.createDocument(
      DATABASE_ID,
      COLLECTION_ID,
      ID.unique(),
      {
        ...data,
        userId,
      },
    );
    return response;
  } catch (error) {
    console.error("Error creating person:", error);
    throw error;
  }
}

// Obtener todas las personas de un usuario
export async function getAllPersons(userId: string): Promise<PersonDocument[]> {
  try {
    const response = await databases.listDocuments(DATABASE_ID, COLLECTION_ID, [
      Query.equal("userId", userId),
    ]);
    return response.documents as unknown as PersonDocument[];
  } catch (error) {
    console.error("Error fetching persons:", error);
    throw error;
  }
}

// Construir el árbol genealógico desde la lista plana
export function buildFamilyTree(persons: PersonDocument[]): Person[] {
  const personMap = new Map<string, Person>();

  // Primero, crear todos los nodos
  persons.forEach((person) => {
    personMap.set(person.$id, { ...person, children: [] });
  });

  const roots: Person[] = [];

  // Luego, construir las relaciones padre-hijo
  persons.forEach((person) => {
    const node = personMap.get(person.$id)!;

    if (person.parentId === null) {
      // Es una raíz
      roots.push(node);
    } else {
      // Tiene un padre
      const parent = personMap.get(person.parentId);
      if (parent) {
        parent.children.push(node);
      } else {
        // Si no se encuentra el padre, tratarlo como raíz
        roots.push(node);
      }
    }
  });

  return roots;
}

// Actualizar una persona
export async function updatePerson(
  personId: string,
  data: Partial<Omit<PersonDocument, "$id" | "userId">>,
) {
  try {
    const response = await databases.updateDocument(
      DATABASE_ID,
      COLLECTION_ID,
      personId,
      data,
    );
    return response;
  } catch (error) {
    console.error("Error updating person:", error);
    throw error;
  }
}

// Eliminar una persona y todos sus descendientes
export async function deletePerson(personId: string) {
  try {
    // Primero obtener todos los descendientes
    const allPersons = await databases.listDocuments(
      DATABASE_ID,
      COLLECTION_ID,
    );
    const descendants = findAllDescendants(
      personId,
      allPersons.documents as unknown as PersonDocument[],
    );

    await Promise.all(
      descendants.map((d) =>
        databases.deleteDocument(DATABASE_ID, COLLECTION_ID, d.$id),
      ),
    );

    // Finalmente eliminar la persona
    await databases.deleteDocument(DATABASE_ID, COLLECTION_ID, personId);
  } catch (error) {
    console.error("Error deleting person:", error);
    throw error;
  }
}

// Función auxiliar para encontrar todos los descendientes
function findAllDescendants(
  personId: string,
  allPersons: PersonDocument[],
): PersonDocument[] {
  const descendants: PersonDocument[] = [];
  const children = allPersons.filter((p) => p.parentId === personId);

  children.forEach((child) => {
    descendants.push(child);
    descendants.push(...findAllDescendants(child.$id, allPersons));
  });

  return descendants;
}

// Obtener el árbol genealógico completo de un usuario
export async function getFamilyTree(userId: string): Promise<Person[]> {
  const persons = await getAllPersons(userId);
  return buildFamilyTree(persons);
}

export async function getPersonCount(userId: string) {
  const response = await databases.listDocuments(DATABASE_ID, COLLECTION_ID, [
    Query.equal("userId", userId),
    Query.limit(1), // 👈 solo necesitamos el total
  ]);

  return response.total;
}

export const getPersonsByUser = async (userId: string) => {
  const response = await databases.listDocuments(DATABASE_ID, COLLECTION_ID, [
    Query.equal("userId", userId),
  ]);

  return response.documents;
};
