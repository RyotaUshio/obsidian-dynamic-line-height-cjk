import * as cjk from 'cjk-regex';

const regex = cjk.all().toRegExp();

export function isCJK(char: string): boolean {
    return regex.test(char);
}
