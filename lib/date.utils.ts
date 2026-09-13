export function calculateAge(dateString: string): number {
  if (!dateString) return 0;

  const birth = new Date(dateString);
  if (isNaN(birth.getTime())) return 0;

  const today = new Date();

  const birthYear = birth.getUTCFullYear();
  const birthMonth = birth.getUTCMonth();
  const birthDay = birth.getUTCDate();

  let age = today.getFullYear() - birthYear;

  const hasHadBirthdayThisYear =
    today.getMonth() > birthMonth ||
    (today.getMonth() === birthMonth && today.getDate() >= birthDay);

  if (!hasHadBirthdayThisYear) age--;

  return age;
}
