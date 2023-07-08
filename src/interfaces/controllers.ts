import { SURVEY_COMPONENTS } from './common';
import { ISurvey } from './survey';

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

export interface IListSurveysRequest {
  email: string;
  token: string;
}

export interface IListSurveysRequestBySurveyId {
  email: string;
  token: string;
  surveyId: SURVEY_COMPONENTS;
}

export interface ICreateSurveyRequest extends ISurvey {
  token: string;
}

export interface ISyncSurveysRequest {
  email: string;
  token: string;
  surveys: ISurvey[];
}

export interface IGetSurveyRequest {
  surveyId: string;
  token: string;
  email: string;
}

export interface IGetStatsRequest {
  email: string;
  token: string;
}

export interface IDeleteSurveyRequest {
  email: string;
  token: string;
  id: string;
}
