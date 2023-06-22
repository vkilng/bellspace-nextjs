import Users from "@/models/User";
import Communities from "@/models/Community";
import {
  uniqueNamesGenerator,
  adjectives,
  animals,
  NumberDictionary,
} from "unique-names-generator";
const numberDictionary = NumberDictionary.generate({ min: 10, max: 99 });

export async function usernameExists(
  input_username: string | string[] | undefined
) {
  const usernameQueryResult = await Users.findOne({
    username: input_username,
  }).exec();
  if (usernameQueryResult) return true;
  return false;
}

export async function getNewUsername(): Promise<string> {
  const newUsername = uniqueNamesGenerator({
    dictionaries: [adjectives, animals, numberDictionary],
    length: 3,
    separator: "-",
  });
  if (await usernameExists(newUsername)) {
    return await getNewUsername();
  } else {
    return newUsername;
  }
}

export async function communityExists(
  communityName: string | string[] | undefined
) {
  const communityQueryResult = await Communities.findOne({
    name: communityName,
  }).exec();
  if (communityQueryResult) return true;
  return false;
}

export function removeElemFromArr(
  arr: Array<string>,
  elem: string,
  upvotes: number,
  increment: boolean
) {
  const indexOfElem = arr.indexOf(elem);
  if (indexOfElem > -1) {
    arr.splice(indexOfElem, 1);
    if (increment) upvotes += 1;
    else upvotes -= 1;
  }
  return [arr, upvotes];
}
