import { Router } from 'express';
import {
  createSurvey,
  getSurvey,
  syncSurveys,
  deleteSurvey,
} from '@controllers/survey';

const surveyRouter = Router();

surveyRouter.post('/create-survey', createSurvey);
surveyRouter.get('/get-survey', getSurvey);
surveyRouter.post('/sync-surveys', syncSurveys);
surveyRouter.delete('/delete-survey', deleteSurvey);

export { surveyRouter };
