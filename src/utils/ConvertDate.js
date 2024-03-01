export default function changedate(date) {
  let part = date.split("T")[0];
  let parts = part.split("-");

  let formattedDate = `${parts[2]}-${parts[1]}-${parts[0]}`;
  return formattedDate;
}
