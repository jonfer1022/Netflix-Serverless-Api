/**
 * Generic error conforming to RFC 7807
 */
export class Problem {
  public statusCode: number;
  public type?: string;
  public title?: string;
  public detail?: string;

  constructor(values: Object = {}) {
    Object.assign(this, values);
  }
}

export class BadRequestProblem extends Problem {
  public statusCode: number = 400;
  public title: string = "Bad request";
}

export class MissingRequiredInputsProblem extends BadRequestProblem {
  public detail: string = "Missing required inputs";
}

export class InvalidJSONProblem extends BadRequestProblem {
  public detail: string = "Invalid JSON";
}

export class UnauthorizedProblem extends Problem {
  public statusCode: number = 401;
  public title: string = "Unauthorized";
}

export class ForbiddenProblem extends Problem {
  public statusCode: number = 403;
  public title: string = "Forbidden";
}

export class NotFoundProblem extends Problem {
  public statusCode: number = 404;
  public title: string = "Not found";
}

export class InternalServerProblem extends Problem {
  public statusCode: number = 500;
  public title: string = "Internal server error";
}

export class InternalServerProblemCustom extends Problem {
  public statusCode: number = 500;

  constructor(message: string) {
    super();
    this.title = message;
  }
}
