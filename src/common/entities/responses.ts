export class ResponseClass {
  public statusCode: number;
  public type?: string;
  public message?: string;
  public detail?: string;

  constructor(values: Object = {}) {
    Object.assign(this, values);
  }
}

export class SuccesfulDefault extends ResponseClass {
  public statusCode: number = 200;
  public message: string = "Succesful Operation";
}

export class SuccesfulCustom extends ResponseClass {
  public statusCode: number = 200;

  constructor(message: string) {
    super();
    this.message = message;
  }
}
