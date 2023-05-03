const API_URL = process.env.API_URL;

function fetchData<TData>(
  url: string,
  options?: {
    method?: "GET" | "POST";
    body?: BodyInit;
  }
) {
  const { method = "GET", body } = options ?? {};

  const headers = new Headers();
  headers.append("Content-Type", "application/json");

  return fetch(`${API_URL}/api${url}`, { method, body, headers }).then(
    (res) => {
      return res.json().then((data) => {
        if (res.status !== 200) {
          throw new ApiError(res.statusText, data);
        }
        return data as TData;
      });
    }
  );
}

export class ApiError extends Error {
  errorResponse: ErrorResponse;
  constructor(statusText: string, errorResponse: ErrorResponse) {
    super(statusText);
    this.errorResponse = errorResponse;
  }
}

export type ErrorResponse = {
  type: string;
  title: string;
  status: number;
  traceId: string;
  errors: { [key: string]: string[] };
};

export type LevelActorAction<TKeywords> = {
  actionKeywords: TKeywords;
  onAction: number;
};

export type LevelActor<TKeywords> = {
  exceptionKeywords: TKeywords;
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
  console.info(JSON.stringify(dialog.dialog));
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

export function transformToForm(
  data: DialogResponse<Array<string>>
): DialogResponse<string> {
  return JSON.parse(JSON.stringify(data), (key, value) => {
    if (
      ["exceptionKeywords", "actionKeywords", "dialogLevel"].includes(key) &&
      Array.isArray(value)
    )
      return value.join(",");

    if (
      ["mindInterval", "silenceInterval"].includes(key) &&
      typeof value === "number"
    )
      return value / 1000;

    return value;
  });
}

export function transformToData(
  data: DialogResponse<string>
): DialogResponse<Array<string>> {
  return JSON.parse(JSON.stringify(data), (key, value) => {
    if (
      ["exceptionKeywords", "actionKeywords", "dialogLevel"].includes(key) &&
      typeof value === "string"
    )
      return value.split(",");

    if (
      ["mindInterval", "silenceInterval"].includes(key) &&
      typeof value === "number"
    )
      return value * 1000;

    return value;
  });
}
