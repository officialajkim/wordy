// External Library
import jwt from 'jsonwebtoken';
import dotenv from "dotenv";
import { NextFunction, Request, Response } from 'express';
// type
import { WordyEvent, EventType } from '../../type/wordyEventType';
import { Gateway } from '../../type/availableType';
// Declare
dotenv.config();
const LOGIN_TOKEN_EXPIRES_IN_DAYS = 5;
const SERVICE_NAME: Gateway = "watGateway"

type Jwt = string;

export const generateJwt = (data: any): Jwt => {
  // Declare using dotenv
  dotenv.config();

  const signedJwt = jwt.sign(
    data, // this data is actually readable without key. 
    process.env.WORDY_ACCESS_TOKEN_JWT!, 
    {expiresIn: `${LOGIN_TOKEN_EXPIRES_IN_DAYS}d`
  }); 

  return signedJwt;
};

const identifiedWrnDefiner = (RE: WordyEvent) => {
  if (typeof RE.tempAccessToken === 'string' && RE.tempAccessToken.length > 0) {
    // validate if tempAccessToken is validating

    // for temporarily I will just put the following
    RE.identifiedAsWrn = RE.requesterWrn;
  } else {
    // just apply identifedWrn as requesterWrn
    RE.identifiedAsWrn = RE.requesterWrn;
  }
}

const NOT_REQUIRING_WAT_EVENTS: EventType[] = ["user:createUser", "okr:getMyOkr"];
// okr:getMyOkr is available to anyone, even without token. 

// WordyAccessToken Service
export const watGateway = (req: Request, res: Response, next: NextFunction) => {
  // get httponly token from header
  const httpOnlyToken = req.cookies.WordyAccessToken;
  const requestedEvent = req.body as WordyEvent;

  // Record
  req.body.validatedBy 
    ? req.body.validatedBy.push(SERVICE_NAME) 
    : req.body.validatedBy = [SERVICE_NAME];
    
  jwt.verify(httpOnlyToken!, process.env.WORDY_ACCESS_TOKEN_JWT!, (err: any, data: any) => {
    if (err) {
      // Validated if action does not require jwt token
      const idx = NOT_REQUIRING_WAT_EVENTS.findIndex(event => event === requestedEvent.eventType);
      if (idx !== -1) {
        requestedEvent.requesterWrn = "wrn::user:::";
        requestedEvent.requesterInfo = data;
        identifiedWrnDefiner(requestedEvent);
        return next(); // you are free to go, even w/o WAT
      };

      requestedEvent.serverResponse = "Denied";
      requestedEvent.serverMessage = `Your requested event ${requestedEvent.eventType} was rejected by jwtService due to absense or invalid WordyAccessToken`;
      return res.status(401).send(requestedEvent);
    } else {
      // validated, no err
      requestedEvent.requesterInfo = data;
      requestedEvent.requesterWrn = data.wrn;
      identifiedWrnDefiner(requestedEvent);
      next();
    }
  });
};
