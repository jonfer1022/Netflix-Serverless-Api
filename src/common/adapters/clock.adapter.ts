export abstract class Clock 
{
    abstract getToday(): Date;
}
  
export class LocalClock extends Clock 
{
    getToday(): Date 
    {
        return new Date();
    }
}