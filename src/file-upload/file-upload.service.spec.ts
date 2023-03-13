import { Test, TestingModule } from '@nestjs/testing';
import { FileUploadService } from './file-upload.service';
import * as fs from 'fs';
import * as util from 'util';
import stream = require('stream');

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
    const file = stream.Readable.from(['test']);

    const pipeline = util.promisify(stream.pipeline);
    const writeStream = fs.createWriteStream(`uploads/test.txt`);
    await pipeline(file, writeStream);

    expect(fs.existsSync('uploads/test.txt')).toBe(true);
    fs.unlinkSync('uploads/test.txt');
  });
});
