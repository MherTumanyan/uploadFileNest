import { Test, TestingModule } from '@nestjs/testing';
import * as fs from 'fs';
import { promisify } from 'util';
import { pipeline, Readable } from 'stream';

import { FileUploadService } from './file-upload.service';

describe('FileUploadService', () => {
  let service: FileUploadService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FileUploadService],
    }).compile();

    service = module.get<FileUploadService>(FileUploadService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should save file to directory', async () => {
    const file = Readable.from(['test']);

    const myPipeline = promisify(pipeline);
    const writeStream = fs.createWriteStream(`uploads/test.txt`);
    await myPipeline(file, writeStream);

    expect(fs.existsSync('uploads/test.txt')).toBe(true);
    fs.unlinkSync('uploads/test.txt');
  });
});
