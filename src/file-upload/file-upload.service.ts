import {
  HttpException,
  BadRequestException,
  Injectable,
  Logger,
} from '@nestjs/common';
import * as fs from 'fs';
import * as util from 'util';
import { FastifyRequest, FastifyReply} from 'fastify';
import { pipeline } from 'stream';

import { AppResponseDto } from '../utils/app-response.dto';

@Injectable()
export class FileUploadService {
  // upload file
  async uploadFile(
    req: FastifyRequest,
    res: FastifyReply<any>,
  ): Promise<any> {
    try {
      //Check request is multipart
      //@ts-ignore
      if (!req?.isMultipart()) {
        res.send(
          new BadRequestException(
            new AppResponseDto(400, undefined, 'Request is not multipart'),
          ),
        );
        return;
      }      
      //@ts-ignore
      const mp = await req.multipart(this.handler, onEnd);

      mp.on('field', (key: string, value: any) => {
        Logger.log('form-data', key, value);
      });
      // Uploading finished
      async function onEnd(err: any) {
        if (err) {
          res.send(new HttpException('Internal server error', 500));
          return;
        }
        res
          .code(200)
          .send(
            new AppResponseDto(200, undefined, 'Data uploaded successfully'),
          );
      }
    } catch (error) {
      Logger.error(error);
    }
  }
  //Save files in directory
  async handler(field: string, file: any, filename: string): Promise<void> {
    try {
      const myPipeline = util.promisify(pipeline);
      const writeStream = fs.createWriteStream(`uploads/${filename}`); //File path
      await myPipeline(file, writeStream);
    } catch (err) {
      Logger.error('Pipeline failed', err);
      return
    }
  }
}
