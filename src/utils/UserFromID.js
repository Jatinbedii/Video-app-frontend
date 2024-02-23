export default function getObjectById(userId, arrayOfObjects) {
  for (let i = 0; i < arrayOfObjects.length; i++) {
    if (arrayOfObjects[i]._id == userId) {
      return arrayOfObjects[i];
    }
  }
  return null;
}
