import { IResponse } from "../types/api-response";
import { api } from "./fetcher";

export type QuestionnaireAnswer = "YES" | "NO" | "NULL";

export type ScreeningQuestion = {
  id: string;
  text: string;
};

export default () => {
  return {
    async generate(
      donationType = "whole_blood",
    ): Promise<IResponse<Record<string, unknown>>> {
      return await api("/questionnaire/generate", {
        method: "POST",
        body: JSON.stringify({ donationType }),
      });
    },
    async answer(
      questionnaireId: string,
      answers: { questionId: string; answer: QuestionnaireAnswer }[],
    ): Promise<IResponse<unknown>> {
      return await api(
        `/questionnaire/${encodeURIComponent(questionnaireId)}/answer`,
        {
          method: "PATCH",
          body: JSON.stringify({ answers }),
        },
      );
    },
  };
};
