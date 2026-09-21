export function calculateAge(dateString: string): number {
  if (!dateString) return 0;

  const birth = new Date(dateString);
  if (isNaN(birth.getTime())) return 0;

  const today = new Date();

  let age = today.getFullYear() - birth.getFullYear();

  const hasHadBirthdayThisYear =
    today.getMonth() > birth.getMonth() ||
    (today.getMonth() === birth.getMonth() && today.getDate() >= birth.getDate());

  if (!hasHadBirthdayThisYear) age--;

  return Math.max(0, age);
}

export function formatBirthDate(dateString: string): string {
  if (!dateString) return "";
  const birth = new Date(dateString);
  if (isNaN(birth.getTime())) return "";
  return birth.toLocaleDateString("es-AR");
}
