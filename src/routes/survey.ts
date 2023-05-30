import { Router } from 'express';
import { createSurvey, getSurvey, syncSurveys } from '@controllers/survey';

const surveyRouter = Router();

surveyRouter.post('/create-survey', createSurvey);
surveyRouter.get('/get-survey', getSurvey);
surveyRouter.post('/sync-surveys', syncSurveys);

export { surveyRouter };
