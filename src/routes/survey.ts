import { Router } from 'express';
import { createSurvey, getSurvey } from '@controllers/survey';

const surveyRouter = Router();

surveyRouter.post('/create-survey', createSurvey);

export { surveyRouter };
