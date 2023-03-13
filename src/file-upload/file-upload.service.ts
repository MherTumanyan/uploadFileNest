import { HttpException, BadRequestException, Injectable, Logger } from '@nestjs/common';
import { AppResponseDto } from '../utils/app-response.dto';

import * as fs from 'fs';
import stream = require('stream');
import fastify = require('fastify');
import * as util from 'util';

@Injectable()
export class FileUploadService {
  // upload file
  async uploadFile(
    req: fastify.FastifyRequest,
    res: fastify.FastifyReply<any>,
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

      mp.on('field', function (key: any, value: any) {
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
    } catch (error) {}
  }
  //Save files in directory
  async handler(field: string, file: any, filename: string): Promise<void> {
    const pipeline = util.promisify(stream.pipeline);
    const writeStream = fs.createWriteStream(`uploads/${filename}`); //File path
    try {
      await pipeline(file, writeStream);
    } catch (err) {
      Logger.error('Pipeline failed', err);
    }
  }
}
