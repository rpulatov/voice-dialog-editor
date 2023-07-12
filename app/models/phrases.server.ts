import { fetchData } from "~/proxy.server";

const KEYS_FOR_JOIN = [
  "exceptionKeywords",
  "mindKeywords",
  "actionKeywords",
  "dialogLevel",
];

const KEYS_FOR_TIMER = ["mindInterval", "silenceInterval"];

export type Phrase = {
  id: number;
  file: string;
  content: string;
};

export function getPhrases() {
  return fetchData<Phrase[]>(`/GetPhrases`);
}

export type PhraseResponse<TKeywords = Array<string>> = {
  id: string;
  file: string;
  content: string;
};

export function getPhrase(phraseId: string) {
  return fetchData<PhraseResponse>(`/getphrases?phrasesId=${phraseId}`);
}

export function createNewPhrase(): PhraseResponse {
  return {
    id: "",
    file: "",
    content: "",
  };
}

export function transformToForm(
  data: PhraseResponse<Array<string>>
): PhraseResponse<string> {
  return JSON.parse(JSON.stringify(data), (key, value) => {
    if (KEYS_FOR_JOIN.includes(key) && Array.isArray(value))
      return value.join(",");
    if (KEYS_FOR_TIMER.includes(key) && typeof value === "number")
      return value / 1000;

    return value;
  });
}

export type SavePhraseResponse = { phraseId: number; saved: boolean };

// export function savePhrase(phrase: PhraseResponse) {
//   return fetchData<SavePhraseResponse>(
//     `/SavePhrase?phraseId=${phraseId}`,
//     {
//       method: "POST",
//       body: JSON.stringify(phrase.),
//     }
//   );
// }
