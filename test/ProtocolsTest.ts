/**
 * Protocol test suite to test protocol implementations
 */

import { suite, test, slow, timeout, skip, only } from "mocha-typescript";
import { expect, should } from "chai";
// should must be called to augment all variables
should();

import HttpServer from "../src/protocols/http/http-server";
import CoapServer from "../src/protocols/coap/coap-server";
import AssetResourceListener from "../src/resource-listeners/asset-resource-listener";

import * as http from "http";
import * as rp from "request-promise";

const coap = require("coap");

@suite("HTTP implementation")
class HttpTest {

    @test "should start and stop a server"() {
        let httpServer = new HttpServer(58080);
        let ret = httpServer.start();

        expect(ret).to.eq(true);
        expect(httpServer.getPort()).to.eq(58080); // from test

        ret = httpServer.stop();

        expect(ret).to.eq(true);
        expect(httpServer.getPort()).to.eq(-1); // from getPort() when not listening
    }

    @test "should change resource from 'off' to 'on' and try to invoke and delete"(done : Function) {
        let httpServer = new HttpServer(0);
        httpServer.addResource("/", new AssetResourceListener("off") );
        let ret = httpServer.start();

        let uri = `http://localhost:${httpServer.getPort()}/`;

        rp.get(uri).then(body => {
                expect(body).to.equal("off");
                rp.put(uri, {body: "on"}).then(body => {
                        expect(body).to.equal("");
                        rp.get(uri).then(body => {
                                expect(body).to.equal("on");
                                rp.post(uri, {body: "toggle"}).then(body => {
                                        expect(body).to.equal("TODO");

                                        ret = httpServer.stop();
                                        done();
                                    });
                            });
                    });
            });
    }

    @test "should cause EADDRINUSE error when already running"(done : Function) {
        let httpServer1 = new HttpServer(0);
        httpServer1.addResource("/", new AssetResourceListener("One") );
        let ret1 = httpServer1.start();

        expect(httpServer1.getPort()).to.be.above(0);

        let httpServer2 = new HttpServer(httpServer1.getPort());
        httpServer2.addResource("/", new AssetResourceListener("Two") );
        let ret2 = httpServer2.start(); // should fail

        expect(ret2).to.eq(false);
        expect(httpServer2.getPort()).to.eq(-1);

        let uri = `http://localhost:${httpServer1.getPort()}/`;

        rp.get(uri).then(body => {
                expect(body).to.equal("One");
        
                ret1 = httpServer1.stop();
                ret2 = httpServer2.stop();

                done();
            });
    }
}

@suite("CoAP implementation")
class CoapTest {

    @test "should start and stop a server"() {
        let coapServer = new CoapServer(56831);
        let ret = coapServer.start();

        expect(ret).to.eq(true);
        expect(coapServer.getPort()).to.eq(56831); // from test

        ret = coapServer.stop();

        expect(ret).to.eq(true);
        expect(coapServer.getPort()).to.eq(-1); // from getPort() when not listening
    }

    @test "should cause EADDRINUSE error when already running"(done : Function) {
        let coapServer1 = new CoapServer(0); // cannot use 0, since getPort() does not work
        coapServer1.addResource("/", new AssetResourceListener("One") );
        let ret1 = coapServer1.start();

        expect(ret1).to.eq(true);
        expect(coapServer1.getPort()).to.be.above(0); // from server._port, not real socket

        let coapServer2 = new CoapServer(coapServer1.getPort());
        coapServer2.addResource("/", new AssetResourceListener("Two") );
        let ret2 = coapServer2.start(); // should fail, but does not...

        expect(ret2).to.eq(false);
        expect(coapServer2.getPort()).to.eq(-1);

        let req = coap.request({ method: "GET", hostname: "localhost", port: coapServer1.getPort(), path: "/" });
        req.on("response", (res : any) => {
            expect(res.payload.toString()).to.equal("One");

            ret1 = coapServer1.stop();
            ret2 = coapServer2.stop();

            done();
        });
        req.end();
    }
}

@suite("Multi-protcol implementation")
class ProtocolsTest {

    @test "should work cross-protocol"(done : Function) {
        let httpServer = new HttpServer(0);
        let coapServer = new CoapServer(0);

        let asset = new AssetResourceListener("test");

        httpServer.addResource("/", asset );
        coapServer.addResource("/", asset );
        
        httpServer.start();
        coapServer.start();

        let uri = `http://localhost:${httpServer.getPort()}/`;

        rp.get(uri).then(body => {
            expect(body).to.equal("test");

            let req1 = coap.request({ method: "PUT", hostname: "localhost", port: coapServer.getPort(), path: "/" } );
            req1.on("response", (res1 : any) => {
                expect(res1.code).to.equal("2.04");
                rp.get(uri).then(body => {
                    expect(body).to.equal("by-coap");

                    rp.put(uri, {body: "by-http"}).then(body => {
                        let req2 = coap.request({ method: "GET", hostname: "localhost", port: coapServer.getPort(), path: "/" } );
                        req2.on("response", (res2 : any) => {
                                expect(res2.payload.toString()).to.equal("by-http");

                                httpServer.stop();
                                coapServer.stop();

                                done();
                            });
                        req2.end();
                    });
                });
            });
            req1.write("by-coap");
            req1.end();
        });
    }
}
