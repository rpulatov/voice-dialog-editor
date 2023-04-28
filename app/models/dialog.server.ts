const API_URL = process.env.API_URL;

function fetchData<TData>(
  url: string,
  options?: {
    method?: "GET" | "POST";
    body?: BodyInit;
  }
) {
  const { method = "GET", body } = options ?? {};

  return fetch(`${API_URL}/api${url}`, { method, body }).then((res) => {
    return res.json().then((data) => {
      if (res.status !== 200) return Promise.reject(new Error(data.message));
      return data as TData;
    });
  });
}

export type LevelActorAction = {
  actionKeywords: Array<string>;
  onAction: number;
};

export type LevelActor = {
  exceptionKeywords: Array<string>;
  actions: Array<LevelActorAction>;
  silenceInterval: number;
  mindInterval: number;
  onExcept: number;
  onSilence: number;
  onUnMind: number;
};

export type Level = {
  levelNum: number;
  title: string;
  description: string;
  topic: string;
  needExceptCall: boolean;
  needCompleteCall: boolean;
  actor: LevelActor;
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

export type Dialog = {
  dialogName: string;
  dialogType: number;
  levels: Array<Level>;
  goals: Array<Goal>;
};

export type DialogResponse = {
  dialogId: string;
  dialogName: string;
  dialog: Dialog;
};

export function getDialogList() {
  return fetchData<DialogResponse[]>(`/GetDialogList`);
}

export function getDialog(id: string) {
  return fetchData<DialogResponse>(`/getdialog?dialogId=${id}`);
}
