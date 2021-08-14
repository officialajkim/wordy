// Main
import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
// type
import { Wrn } from '../../../type/availableType';
import { CreateOkrObjectInput, CreateOkrObjectPayload } from '../../../type/payloadType'
import { pathFinder, WordyEvent, EventType } from '../../../type/wordyEventType';
import { OkrObjectPure, OkrContainerPure, ResourceId } from '../../../type/resourceType';
import LogicalErrorCode from '../../../type/LogicalErrorCode.json';
import { pushDataEvenUndefined } from '../../../type/sharedWambda';
// Mogno DB
import { OkrObjectModel, ResCheck, ContainerModel } from '../../../models/EncryptedResource';
// Mdl
import { onlyToWordyMemberMdl } from '../../middleware/onlyToMdl';
// internal
import { ctGateway } from '../../../internal/management/cloudTrail';
import { generatedWrn, intoResource, getNow, intoPayload } from '../../../internal/compute/backendWambda';

// Gateway
import { connectToMongoDB } from '../../../internal/database/mongo';
// Router
const router = express.Router();
const EVENT_TYPE = "okr:createOkrObject";
const SERVICE_NAME: EventType = `${EVENT_TYPE}`
dotenv.config();

// Only available to Wordy Members
router.use(onlyToWordyMemberMdl); 

// connects into mongodb
router.use(connectToMongoDB);

router.post(pathFinder(EVENT_TYPE), async (req: Request, res: Response) => {
  // declare requested event & write it down with validation 
  const RE = req.body as WordyEvent; // receives the event
  const { type, title, associateContainerWrn } = RE.requesterInputData as CreateOkrObjectInput;
  RE.validatedBy 
    ? RE.validatedBy.push(SERVICE_NAME) 
    : RE.validatedBy = [SERVICE_NAME];

  // Cleaning the data before using it
  title.trim();

  // First, prepare okr object data.
  const okrObjectWrn: Wrn = generatedWrn(`wrn::okr:okr_object:mdb:${type}:`);
  const newMyOkr: OkrObjectPure = { type, title, isDataSatisfied: "NotSatisfied" }; // NotSatisfied by default
  const newMyOkrResource = intoResource(newMyOkr, okrObjectWrn, RE);

  // Before creating the okr object, the container first must allow 
  // if it is addable or not. so it checks here following
  // this line of code rejects if not satisfied. and modify, and finally prepare for E/R (Encrypted Reosurce)
  const foundContainer = await ContainerModel.findOne({ wrn: associateContainerWrn, ownerWrn: RE.requesterWrn })
  if (!foundContainer) ctGateway(RE, "LogicallyDenied", "associateContainerWrn does not exist");
  if (!foundContainer) return res.status(RE.status!).send(RE);
  const pureContainerRes = intoPayload(foundContainer, RE) as ResourceId & OkrContainerPure;
  if (pureContainerRes.addableUntil < getNow()) ctGateway(RE, "LogicallyDenied", LogicalErrorCode.NO_LONGER_ADDABLE_TO_THE_CONTAINER);
  if (pureContainerRes.addableUntil < getNow()) return res.status(RE.status!).send(RE);
  pureContainerRes.containingObject = pushDataEvenUndefined(okrObjectWrn, pureContainerRes.containingObject);
  const modifiedContainerRes = intoResource(pureContainerRes, pureContainerRes.wrn, RE, pureContainerRes.wpWrn);

  // Finally save and respond
  await new OkrObjectModel(ResCheck(newMyOkrResource)).save()
    .then(async () => {
      await ContainerModel.findOneAndUpdate({ wrn: pureContainerRes.wrn }, ResCheck(modifiedContainerRes))
        .then(() => {
          RE.payload = pureContainerRes as CreateOkrObjectPayload;
          ctGateway(RE, "Accepted");
          return res.status(RE.status!).send(RE) })
        .catch(() => {
          ctGateway(RE, "LogicallyDenied", LogicalErrorCode.FAILED_TO_MODIFY_FOLLOWING_MODEL_DUE_TO_DB_FAILURE + "ContainerModel");
          return res.status(RE.status!).send(RE) });
    })
    .catch(() => {
      ctGateway(RE, "LogicallyDenied", LogicalErrorCode.FAILED_TO_SAVE_FOLLOWING_MODEL_DUE_TO_DB_FAILURE + "OkrObjectModel");
      return res.status(RE.status!).send(RE)
    });
});

export default router;