import { IQuestion, ISubmittedBy } from './common';

export interface IResponse {
  message: string;
  [key: string]: any;
}

export interface IError {
  message: string;
  [key: string]: any;
}

export interface ICreateEnumeratorRequest {
  firstName: string;
  lastName: string;
  email: string;
  age: string;
  cnic: string;
  mobile: string;
  address: string;
  password: string;
  enumeratorId: string;
}

export interface ICreateAdminRequest {
  name: string;
  email: string;
  password: string;
}

export interface IGetUserRequest {
  email: string;
  password: string;
}

export interface IResumeSessionRequest {
  email: string;
  token: string;
}

export interface IListEnumeratorsRequest {
  email: string;
  token: string;
}

export interface IToggleEnumeratorStatusRequest {
  email: string;
  token: string;
  enumeratorEmail: string;
}

export interface IIListSurveysRequest {
  email: string;
  token: string;
}

export interface ICreateSurveyRequest {
  surveyId: string;
  sectionA: IQuestion[];
  sectionB: IQuestion[];
  sectionC: IQuestion[];
  sectionD: IQuestion[];
  submittedBy: ISubmittedBy;
  submittedAt: string;
  token: string;
}

export interface IGetSurveyRequest {
  surveyId: string;
  token: string;
  email: string;
}
