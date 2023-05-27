import { Schema, model, Types } from 'mongoose';
import type { ISurvey, ISurveyMethods, TSurveyModel } from '@interfaces/survey';
import { IQuestion } from '@interfaces/common';

const surveySchema = new Schema<ISurvey, TSurveyModel, ISurveyMethods>(
  {
    surveyId: {
      type: String,
      required: true,
    },
    sectionA: {
      type: new Types.Array<IQuestion>(),
      required: true,
    },
    sectionB: {
      type: new Types.Array<IQuestion>(),
      required: true,
    },
    sectionC: {
      type: new Types.Array<IQuestion>(),
      required: true,
    },
    sectionD: {
      type: new Types.Array<IQuestion>(),
      required: true,
    },
    submittedBy: {
      type: Object,
      required: true,
    },
    submittedAt: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const SurveyModel = model<ISurvey, TSurveyModel>('survey', surveySchema);
