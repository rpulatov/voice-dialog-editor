import { fetchData } from "~/proxy.server";

export type Phrase = {
  id: number;
  file: string;
  content: string;
};

export function getPhrases() {
  return fetchData<Phrase[]>(`/GetPhrases`);
}
