import { v4 as uuidv4 } from "uuid";
import { Question, QuestionResponse } from "../types";

export class QuestionService {
  /**
   * Parse questions from AI response text
   * Looks for [QUESTION:id:type:text] and [OPTIONS:option1|option2] patterns
   */
  static parseQuestions(responseText: string): Question[] {
    const questions: Question[] = [];

    // Regex to match [QUESTION:id:type:text] pattern
    const questionRegex = /\[QUESTION:([^:]+):([^:]+):([^\]]+)\]/g;
    // Regex to match [OPTIONS:option1|option2|option3] pattern
    const optionsRegex = /\[OPTIONS:([^\]]+)\]/g;

    let questionMatch;
    const optionsMap = new Map<number, string[]>();

    // First, extract all options and their positions
    let optionsMatch;
    while ((optionsMatch = optionsRegex.exec(responseText)) !== null) {
      const options = optionsMatch[1].split("|").map((opt) => opt.trim());
      optionsMap.set(optionsMatch.index, options);
    }

    // Then extract questions
    while ((questionMatch = questionRegex.exec(responseText)) !== null) {
      const [, id, type, text] = questionMatch;

      // Find the closest OPTIONS after this question
      let options: string[] | undefined;
      let closestOptionsIndex = Infinity;

      for (const [optionsIndex, optionsArray] of optionsMap.entries()) {
        if (
          optionsIndex > questionMatch.index &&
          optionsIndex < closestOptionsIndex
        ) {
          closestOptionsIndex = optionsIndex;
          options = optionsArray;
        }
      }

      const question: Question = {
        id: uuidv4(),
        text: text.trim(),
        type: type as "open" | "choice" | "numeric" | "yes_no",
        options: options,
        required: true,
        context: id,
      };

      questions.push(question);
    }

    return questions;
  }

  /**
   * Clean AI response text by removing question markers
   */
  static cleanResponseText(responseText: string): string {
    // Remove [QUESTION:...] patterns
    let cleanText = responseText.replace(/\[QUESTION:[^\]]+\]/g, "");

    // Remove [OPTIONS:...] patterns
    cleanText = cleanText.replace(/\[OPTIONS:[^\]]+\]/g, "");

    // Clean up extra whitespace and newlines
    cleanText = cleanText.replace(/\n\s*\n/g, "\n\n");
    cleanText = cleanText.trim();

    return cleanText;
  }

  /**
   * Generate a contextual follow-up response based on the question response
   */
  static generateFollowUpContext(
    question: Question,
    response: QuestionResponse
  ): string {
    const context = `User answered question about ${question.context}: "${question.text}"
Response: "${response.answer}"

Please acknowledge their response and provide relevant insights or follow-up discussion based on their answer.`;

    return context;
  }

  /**
   * Validate question response based on question type
   */
  static validateQuestionResponse(
    question: Question,
    answer: string
  ): { isValid: boolean; error?: string } {
    if (!answer || answer.trim().length === 0) {
      return { isValid: false, error: "Answer cannot be empty" };
    }

    switch (question.type) {
      case "numeric":
        const numValue = parseFloat(answer);
        if (isNaN(numValue)) {
          return { isValid: false, error: "Please enter a valid number" };
        }
        break;

      case "yes_no":
        const lowerAnswer = answer.toLowerCase().trim();
        if (!["yes", "no", "y", "n"].includes(lowerAnswer)) {
          return { isValid: false, error: "Please answer with Yes or No" };
        }
        break;

      case "choice":
        if (question.options && !question.options.includes(answer)) {
          return {
            isValid: false,
            error: "Please select one of the provided options",
          };
        }
        break;

      case "open":
        if (answer.trim().length < 3) {
          return {
            isValid: false,
            error: "Please provide a more detailed answer",
          };
        }
        break;
    }

    return { isValid: true };
  }

  /**
   * Find unanswered questions in a conversation
   */
  static findUnansweredQuestions(
    questions: Question[],
    responses: QuestionResponse[]
  ): Question[] {
    const answeredQuestionIds = new Set(responses.map((r) => r.questionId));
    return questions.filter((q) => !answeredQuestionIds.has(q.id));
  }

  /**
   * Convert question response to natural language for AI context
   */
  static formatResponseForAI(
    question: Question,
    response: QuestionResponse
  ): string {
    let formattedResponse = `Question: ${question.text}\nAnswer: ${response.answer}`;

    if (question.type === "choice" && question.options) {
      formattedResponse += `\n(Selected from options: ${question.options.join(", ")})`;
    }

    return formattedResponse;
  }
}
