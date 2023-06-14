export enum SURVEY_COMPONENTS {
  S1 = 'WATERCOURSE BENEFICIARIES (WCB)',
  S2 = 'HIGH EFFICIENCY IRRIGATION SYSTEM (HEIS)',
  S3 = 'KITCHEN GARDENING (KG)',
  S4 = 'LASER LEVELLER (PLL)',
  S5 = 'DEEP RIPPING (DR)',
  S6 = 'FARMERS FIELD SCHOOL (FFS)',
  S7 = 'REHABILITATION OF FLOOD DAMAGES (RFD)',
}

export type ISubmittedBy = {
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
