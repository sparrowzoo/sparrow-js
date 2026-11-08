export interface QuestionOption {
    readonly label: string;
    readonly description: string;
}
export interface QuestionItem {
    readonly question: string;
    readonly header: string;
    readonly multiSelect: boolean;
    readonly options: readonly QuestionOption[];
}
export interface QuestionEvent {
    readonly questionId: string;
    readonly questions: readonly QuestionItem[];
}

function object(value: unknown): value is Record<string, unknown> {
    return value !== null && typeof value === 'object' && !Array.isArray(value);
}
function text(value: unknown): value is string {
    return typeof value === 'string' && value.trim().length > 0;
}

export function parseQuestion(payload: string): QuestionEvent {
    const value: unknown = JSON.parse(payload);
    if (!object(value) || !text(value.questionId) || !Array.isArray(value.questions)
        || value.questions.length < 1 || value.questions.length > 4) throw new Error('Invalid question');
    const questions = value.questions.map((item: unknown) => {
        if (!object(item) || !text(item.question) || !text(item.header) || typeof item.multiSelect !== 'boolean'
            || !Array.isArray(item.options) || item.options.length < 2 || item.options.length > 4) {
            throw new Error('Invalid question item');
        }
        const options = item.options.map((option: unknown) => {
            if (!object(option) || !text(option.label) || !text(option.description)) throw new Error('Invalid option');
            return Object.freeze({label: option.label, description: option.description});
        });
        return Object.freeze({question: item.question, header: item.header,
            multiSelect: item.multiSelect, options: Object.freeze(options)});
    });
    return Object.freeze({questionId: value.questionId, questions: Object.freeze(questions)});
}
