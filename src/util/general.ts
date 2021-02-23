export class GeneralUtil {
  static fixFunctionString(input: string): string {
    if (input.startsWith('function sort')) {
      return input.replace('function sort', '').replace(' {', ' => {');
    } else if (input.startsWith('function query')) {
      return input.replace('function query', '').replace(' {', ' => {');
    } else if (input.startsWith('function filter')) {
      return input.replace('function filter', '').replace(' {', ' => {');
    }
    return input;
  }
}
