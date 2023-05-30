export enum SURVEY_COMPONENTS {
  A = 'High Efficiency irrigation system',
  B = 'Kitchen Gardening',
}

export type ISubmittedBy = {
  id: string;
  name: string;
  age: string;
  email: string;
  cnic?: string;
  mobile?: string;
  address?: string;
  enumeratorId?: string;
};

export interface IQuestion {
  questionId: string;
  question: string;
  options?: string[];
  answer: string;
  questionType:
    | 'text'
    | 'number'
    | 'text-area'
    | 'radio'
    | 'radio-text'
    | 'checkbox'
    | 'checkbox-text'
    | 'picker'
    | 'date'
    | 'time';
  keyboardType?: string;
  maxLength?: number;
}

export interface ISurveyPayload {
  surveyId: string;
  sectionA: IQuestion[];
  sectionB: IQuestion[];
  sectionC: IQuestion[];
  sectionD: IQuestion[];
  submittedBy: ISubmittedBy;
  submittedAt: string;
}
