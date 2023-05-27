import { Router } from 'express';
import { createSurvey } from '@controllers/survey';

const surveyRouter = Router();

surveyRouter.post('/create-survey', createSurvey);

export { surveyRouter };
