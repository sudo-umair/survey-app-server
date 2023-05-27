import type { Model } from 'mongoose';
import type { IQuestion, ISubmittedBy, SURVEY_COMPONENTS } from './common';

export interface ISurvey {
  surveyId: SURVEY_COMPONENTS;
  sectionA: IQuestion[];
  sectionB: IQuestion[];
  sectionC: IQuestion[];
  sectionD: IQuestion[];
  submittedBy: ISubmittedBy;
  submittedAt: string;
}

export interface ISurveyMethods {}

export type TSurveyModel = Model<ISurvey, {}, ISurveyMethods>;
