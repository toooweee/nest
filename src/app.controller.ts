import { Controller, Get, NotFoundException, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';

@Controller()
export class AppController {
  constructor() {}

  @Get('cookies')
  getCookies(
    @Req() request: Request,
  ): { name: string; value: string }[] | unknown {
    const cookiesString: string | undefined = request.headers?.cookie;

    if (cookiesString) {
      const cookies: string[] = cookiesString.split(';');

      const data: { name: string; value: string }[] = [];

      for (const cookie of cookies) {
        data.push({
          name: cookie.split('=')[0],
          value: cookie.split('=')[1],
        });
      }

      return data;
    }

    throw new NotFoundException('Cookies not found');
  }

  @Get('express')
  expressReturn(@Res() res: Response) {
    return res.status(200).json({ data: 'Express return in nest' });
  }
}
