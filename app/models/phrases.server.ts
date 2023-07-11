import { fetchData } from "~/proxy.server";

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

export function getPhrase(id: string) {
  return fetchData<PhraseResponse>(`/getphrases?phrasesId=${id}`);
}

export function createNewPhrase(): PhraseResponse {
  return {
    id: "",
    file: "",
    content: "",
  };
}

