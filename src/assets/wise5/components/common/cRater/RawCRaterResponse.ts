/**
 * CRaterResponses is the response object from the CRater API.
 * This is different from CRaterResponse, which is the object that WISE creates to store the
 * response.
 */
export interface RawCRaterResponse {
  advisories: string[];
  feedback: any;
  response_id: string;
  scores?: any;
  trait_scores: any;
}
