/*
 * The MIT License (MIT)
 * Copyright (c) 2017 the thingweb community
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software
 * and associated documentation files (the "Software"), to deal in the Software without restriction,
 * including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense,
 * and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial
 * portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED
 * TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
 * THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF
 * CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 * DEALINGS IN THE SOFTWARE.
 */

/**
 * HTTPS client Factory
 */

import logger from 'node-wot-logger';
import { ProtocolClientFactory, ProtocolClient } from 'node-wot-protocols'
import HttpClient from './http-client';

export default class HttpsClientFactory implements ProtocolClientFactory {

  public static readonly schemes: Array<string> = ['https'];

  public getClient(): ProtocolClient {
    logger.debug(`HttpsClientFactory creating client for '${this.getSchemes()}'`);
    return new HttpClient(true);
  }

  public init(): boolean {
    logger.info(`HttpsClientFactory for '${this.getSchemes()}' initializing`);
    return true;
  }

  public destroy(): boolean {
    logger.info(`HttpsClientFactory for '${this.getSchemes()}' destroyed`);
    return true;
  }

  public getSchemes(): Array<string> {
    return HttpsClientFactory.schemes;
  }
}
