import { Injectable } from '@nestjs/common';
import { CacheService } from '../../../shared/cache/cache.service';

@Injectable()
export class GenerateCodeService {
  constructor(private cache: CacheService) {}

  randomCode(length: number): string {
    let code = '';

    for (let index = 0; index < length; index++) {
      code += Math.floor(Math.random() * 10).toString();
    }

    return code;
  }

  async uniqueCode(CODE_LENGTH = 4): Promise<string> {
    let code = null;
    let isUnique = false;

    do {
      code = this.randomCode(CODE_LENGTH);
      isUnique = !(await this.cache.get<string | undefined>(code));
    } while (!isUnique);

    return code;
  }
}
