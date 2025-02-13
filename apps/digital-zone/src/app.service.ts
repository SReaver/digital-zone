import { BadRequestException, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { catchError, retry } from 'rxjs/operators';
import { forkJoin, throwError, lastValueFrom } from 'rxjs';

import { isValidUrl } from './utils';

@Injectable()
export class AppService {
  constructor(private httpService: HttpService) { }

  getHello(): string {
    return 'Hello World!';
  }

  async fetchDataFromUrls(urls: string[]): Promise<any[]> {
    if (!urls || !urls.length) throw new BadRequestException('No URLs provided');

    // validate urls
    urls.forEach(u => {
      if (!isValidUrl(u)) {
        throw new BadRequestException(`Invalid URL: ${u}`);
      }
    });

    const requests = urls.map(u =>
      this.httpService.get(u).pipe(
        retry(3),
        catchError(error => {
          console.error(`Error fetching data from ${u}:`, error.message);
          return throwError(error);
        })
      )
    );

    return await lastValueFrom(forkJoin(requests));
  }
}
