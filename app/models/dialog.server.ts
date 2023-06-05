import { fetchData } from "~/proxy.server";

export type LevelActorAction<TKeywords> = {
  actionKeywords: TKeywords;
  onAction: number;
};

export type LevelActor<TKeywords> = {
  exceptionKeywords: TKeywords;
  mindKeywords: TKeywords;
  actions: Array<LevelActorAction<TKeywords>>;
  silenceInterval: number;
  mindInterval: number;
  onExcept: number;
  onSilence: number;
  onUnMind: number;
};

export type Level<TKeywords> = {
  levelNum: number;
  title: string;
  description: string;
  topic: string;
  track: number;
  needExceptCall: boolean;
  needCompleteCall: boolean;
  actor: LevelActor<TKeywords>;
};

export type GoalStep = {
  name: string;
  dialogLevel: Array<number>;
  increment: number;
  decrement: number;
  definitelyValue: number;
};

export type Goal = {
  name: string;
  steps: Array<GoalStep>;
  goalAchievementValue: number;
  goalData: Array<any>;
  goalAchieved: boolean;
  goalCheckPattern: string;
};

export type Dialog<TKeywords> = {
  dialogName: string;
  dialogType: number;
  levels: Array<Level<TKeywords>>;
  goals: Array<Goal>;
};

export type DialogResponse<TKeywords = Array<string>> = {
  dialogId: string;
  dialogName: string;
  dialog: Dialog<TKeywords>;
};

export type SaveDialogResponse = { dialogId: number; saved: boolean };

export function getDialogList() {
  return fetchData<DialogResponse[]>(`/GetDialogList`);
}

export function getDialog(id: string) {
  return fetchData<DialogResponse>(`/getdialog?dialogId=${id}`);
}

export function saveDialog(dialog: DialogResponse) {
  return fetchData<SaveDialogResponse>(
    `/SaveDialog?dialogId=${dialog.dialogId}`,
    {
      method: "POST",
      body: JSON.stringify(dialog.dialog),
    }
  );
}

export function createNewDialog(): DialogResponse {
  return {
    dialogId: "",
    dialogName: "",
    dialog: { dialogName: "", dialogType: 1, levels: [], goals: [] },
  };
}

const KEYS_FOR_JOIN = [
  "exceptionKeywords",
  "mindKeywords",
  "actionKeywords",
  "dialogLevel",
];
const KEYS_FOR_TIMER = ["mindInterval", "silenceInterval"];

export function transformToForm(
  data: DialogResponse<Array<string>>
): DialogResponse<string> {
  return JSON.parse(JSON.stringify(data), (key, value) => {
    if (KEYS_FOR_JOIN.includes(key) && Array.isArray(value))
      return value.join(",");

    if (KEYS_FOR_TIMER.includes(key) && typeof value === "number")
      return value / 1000;

    return value;
  });
}

export function transformToData(
  data: DialogResponse<string>
): DialogResponse<Array<string>> {
  return JSON.parse(JSON.stringify(data), (key, value) => {
    if (KEYS_FOR_JOIN.includes(key) && typeof value === "string")
      return value.split(",");

    if (KEYS_FOR_TIMER.includes(key) && typeof value === "number")
      return value * 1000;

    return value;
  });
}
