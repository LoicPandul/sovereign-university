/// <reference types="mocha" />

import assert from 'node:assert';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { pdfThumbnail } from './pdf-thumbnail.js';

const BITCOIN_WHITE_PAPER_PDF_HASH =
  'b1674191a88ec5cdd733e4240a81803105dc412d6c6708d53ab94fc248f4f553';

const EXPECTED_THUMBNAIL_HASH =
  '58d43b4e38edfe70ed964d21802a07e0059a4b07b0a8bcfce5e808f68a595805';

const pdfFile = path.resolve(
  import.meta.dirname,
  '../../../apps/web/public/bitcoin.pdf',
);

describe('PDF Thumbnail', () => {
  it('should be able to convert pdf to png', async () => {
    const blob = readFileSync(pdfFile);
    const hash = createHash('sha256').update(blob).digest('hex');
    assert(hash === BITCOIN_WHITE_PAPER_PDF_HASH, 'hash should match');

    const result = await pdfThumbnail(blob);
    assert(Buffer.isBuffer(result), 'result should be a buffer');
    const resultHash = createHash('sha256').update(result).digest('hex');
    assert(resultHash === EXPECTED_THUMBNAIL_HASH, 'hash should match');
  });
});
