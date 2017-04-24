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
 * Basic test suite for helper functions
 * uncomment the @skip to see failing tests
 * 
 * h0ru5: there is currently some problem with VSC failing to recognize experimentalDecorators option, it is present in both tsconfigs
 */

import { suite, test, slow, timeout, skip, only } from "mocha-typescript";
import { expect } from "chai";

import * as Helpers from "../src/helpers";

@suite("tests to verify the helpers")
class HelperTest {
    
    @test "should extract the http scheme"() {
        let scheme = Helpers.extractScheme("http://blablupp.de")
        expect(scheme).to.eq("http")
    }

    @test "should raise exeption on empty url"(){
        expect(function(){
            Helpers.extractScheme("");
        }).to.throw("Protocol in url ")
    }

    @test "should raise exeption on nasty url"(){
        expect(function(){
            Helpers.extractScheme("ThisIsNotAURL");
        }).to.throw("Protocol in url ")
    }
    
    @test "should extract https scheme"() {
        let scheme = Helpers.extractScheme("https://blablupp.de")
        expect(scheme).to.eq("https")
    }
    
    @test "should extract scheme when a port is given"() {
        let scheme = Helpers.extractScheme("http://blablupp.de:8080")
        expect(scheme).to.eq("http")
    }

    @test "should extract combined scheme"() {
        let scheme = Helpers.extractScheme("coap+ws://blablupp.de")
        expect(scheme).to.eq("coap+ws")
    }

    @test "should retrieve only valid addresses and localhost"(){
        let address = Helpers.getAddresses();
        expect(address).contain('127.0.0.1')
        expect(address).to.have.length.above(1)
        // ToDo: extend to possible V6 addresses
        address.map((item) => expect(item).to.match(/^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/))
    }
}