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
 * THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
 * TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

/**
 * Basic test suite for http client
 * 
 */

import { suite, test, slow, timeout, skip, only } from "mocha-typescript";
import { expect, should } from "chai";
// should must be called to augment all variables
should();

import HttpServer from "node-wot-protocols-http-server";
import {AssetResourceListener,Content} from "node-wot-protocols";
import HttpClient from "../src/http-client";


@suite("HTTP client implementation")
class HttpClientTest {
    // should we test private methods or only pulic APIs?
    @test "uriToOptions should extract option out of an uri"() {
        let client = new HttpClient()
        let options = (client as any).uriToOptions("http://username:password@hostname:9876/resource");
        expect(options.port).to.eq(9876);
    }

    @test "read resource from an server"(){
        let httpServer = new HttpServer(0);
        let asset = new AssetResourceListener("test");
        httpServer.addResource("/", asset );
        httpServer.start();
        let client = new HttpClient()
        let rp=client.readResource(`http://localhost:${httpServer.getPort()}/`);
        rp.then<Content>(
           /* onfullfilled:(value: Content) => {
            console.log("got content")
            
        )
        expect(true).to.true
    }
}
