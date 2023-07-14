import { fetchData } from "~/proxy.server";

const KEYS_FOR_JOIN = [
  "exceptionKeywords",
  "mindKeywords",
  "actionKeywords",
  "dialogLevel",
];

const KEYS_FOR_TIMER = ["mindInterval", "silenceInterval"];

export type Phrase = {
  id?: number;
  file: string;
  content: string;
};

export function getPhrases() {
  return fetchData<Phrase[]>(`/GetPhrases`);
}

export function getPhrase(phraseId: number) {
  return fetchData<Phrase>(`/getphrase?phraseId=${phraseId}`);
}

export function createNewPhrase(): Partial<Phrase> {
  return {
    file: "",
    content: "",
  };
}
