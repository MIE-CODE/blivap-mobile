import { ScreeningQuestion } from "../../services/questionnaire.service";
import { asRecord, pickString } from "./api-lists";

export function parseGeneratedQuestionnaire(body: unknown): {
  questionnaireId: string;
  questions: ScreeningQuestion[];
} | null {
  const root = asRecord(body);
  const data = asRecord(root?.data) ?? root;
  if (!data) return null;

  const questionnaireId =
    pickString(data.questionnaireId) ??
    pickString(data.id) ??
    pickString(data._id);
  const rawQuestions = Array.isArray(data.questions) ? data.questions : [];
  const questions = rawQuestions.flatMap((item) => {
    const question = asRecord(item);
    if (!question) return [];
    const id =
      pickString(question.questionId) ??
      pickString(question.id) ??
      pickString(question._id);
    const text =
      pickString(question.question) ??
      pickString(question.text) ??
      pickString(question.prompt);
    if (!id || !text) return [];
    return [{ id, text }];
  });

  if (!questionnaireId || questions.length === 0) return null;
  return { questionnaireId, questions };
}
